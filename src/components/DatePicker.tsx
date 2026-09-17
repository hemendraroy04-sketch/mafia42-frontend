"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  /**
   * Dates strictly before this date are shown grayed-out and are not
   * clickable (used to signal "no data available before this date").
   * Defaults to Sept 16, 2026 per current requirement — pass your own
   * to make this dynamic (e.g. driven by an API's earliest-data date).
   */
  minSelectableDate?: Date;
  /**
   * Dates strictly after this date are shown grayed-out and are not
   * clickable. Defaults to today, so future dates can't be picked.
   * Pass a later date (or a far-future one) to relax this.
   */
  maxSelectableDate?: Date;
  className?: string;
}

const WEEKDAY_LABELS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDisplayDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function formatMonthLabel(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(d);
}

// Builds a 7-column grid for the given month, with leading `null`s so the
// 1st lands under the correct weekday column (Sunday-first).
function buildMonthGrid(viewDate: Date): (Date | null)[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay(); // 0 = Sunday

  const cells: (Date | null)[] = Array(leadingBlanks).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }

  return cells;
}

const DEFAULT_MIN_SELECTABLE_DATE = new Date(2026, 8, 16); // Sept 16, 2026

export default function DatePicker({
  value,
  onChange,
  minSelectableDate = DEFAULT_MIN_SELECTABLE_DATE,
  maxSelectableDate = new Date(),
  className = "",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<Date | null>(value);
  const [viewDate, setViewDate] = useState<Date>(value ?? minSelectableDate);

  const containerRef = useRef<HTMLDivElement>(null);

  const minDay = startOfDay(minSelectableDate);
  const maxDay = startOfDay(maxSelectableDate);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openPicker = () => {
    const base = value ?? minSelectableDate;
    setTempSelected(value);
    setViewDate(base);
    setOpen(true);
  };

  const handleSelect = () => {
    if (tempSelected) {
      onChange(tempSelected);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(value);
    setOpen(false);
  };

  const goToPrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const grid = buildMonthGrid(viewDate);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={openPicker}
        className="flex items-center gap-2 text-sm font-medium text-gray-500"
      >
        <span>{value ? formatDisplayDate(value) : "Select date"}</span>

        <CalendarIcon
          size={18}
          className="text-gray-500 transition hover:text-black"
        />
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute z-20 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
          {/* Month header */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrevMonth}
              className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-black"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-base font-semibold text-black">
              {formatMonthLabel(viewDate)}
            </span>

            <button
              type="button"
              onClick={goToNextMonth}
              className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-black"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Weekday labels */}
          <div className="mt-4 grid grid-cols-7 gap-y-2 text-center text-xs font-medium text-gray-400">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          {/* Date grid */}
          <div className="mt-1 grid grid-cols-7 gap-y-2 text-center text-sm">
            {grid.map((date, index) => {
              if (!date) return <span key={`blank-${index}`} />;

              const disabled = date < minDay || date > maxDay;
              const isSelected =
                tempSelected !== null && isSameDay(date, tempSelected);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => setTempSelected(date)}
                  className={[
                    "mx-auto flex h-9 w-9 items-center justify-center rounded-full transition",
                    disabled
                      ? "cursor-not-allowed text-gray-300"
                      : isSelected
                        ? "bg-black font-semibold text-white"
                        : "text-black hover:bg-gray-100",
                  ].join(" ")}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 active:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSelect}
              disabled={!tempSelected}
              className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Select
            </button>
          </div>
        </div>
      )}
    </div>
  );
}