"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string | number;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
}

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

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

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="mb-2 block text-sm text-gray-500">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-black outline-none transition hover:border-gray-400 active:bg-gray-100"
      >
        <span className={selected ? "text-black" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-gray-200 active:bg-gray-300 ${
                    isSelected ? "bg-gray-300 font-medium" : ""
                  }`}
                >
                  <span>{option.label}</span>

                  {isSelected && (
                    <Check size={16} className="text-black" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}