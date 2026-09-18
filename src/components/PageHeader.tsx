"use client";

import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DatePicker from "./DatePicker";
import { addDays, dayStart } from "@/utils/dateNavigation";

export const MIN_SELECTABLE_DATE = new Date(2026, 8, 17);

interface PageHeaderProps {
  title: string;
  date?: string | null;
  onDateChange?: (date: Date) => void;
}

interface DayStepButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

function DayStepButton({
  label,
  disabled,
  onClick,
  children,
}: DayStepButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition hover:bg-gray-50 active:bg-gray-100 disabled:pointer-events-none disabled:opacity-40 ${focusRing}`}
    >
      {children}
    </button>
  );
}

export default function PageHeader({
  title,
  date,
  onDateChange,
}: PageHeaderProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    date ? new Date(date) : new Date(),
  );
  const [today] = useState(() => new Date());

  // Same bounds as the calendar: nothing before the first data day, nothing in the future.
  const selectedDay = dayStart(selectedDate);
  const canGoPrev = selectedDay > dayStart(MIN_SELECTABLE_DATE);
  const canGoNext = selectedDay < dayStart(today);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <header className="mb-8 border-b border-gray-200 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Click the calendar to view rankings from previous days.
          </p>
        </div>

        {/* `relative` anchors the calendar popover to this row. */}
        <div className="relative flex items-center gap-2">
          <DayStepButton
            label="Previous day"
            disabled={!canGoPrev}
            onClick={() => handleDateChange(addDays(selectedDate, -1))}
          >
            <ChevronLeft className="h-5 w-5" />
          </DayStepButton>

          <div className="min-w-0 flex-1 sm:flex-none">
            <DatePicker value={selectedDate} onChange={handleDateChange} />
          </div>

          <DayStepButton
            label="Next day"
            disabled={!canGoNext}
            onClick={() => handleDateChange(addDays(selectedDate, 1))}
          >
            <ChevronRight className="h-5 w-5" />
          </DayStepButton>
        </div>
      </div>
    </header>
  );
}