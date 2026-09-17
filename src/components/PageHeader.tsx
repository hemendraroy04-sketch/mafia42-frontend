"use client";

import { useState } from "react";
import DatePicker from "./DatePicker";

interface PageHeaderProps {
  title: string;
  date?: string | null;
  onDateChange?: (date: Date) => void;
}

export default function PageHeader({ title, date, onDateChange }: PageHeaderProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    date ? new Date(date) : new Date()
  );

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>

        <div className="mt-2">
          <DatePicker value={selectedDate} onChange={handleDateChange} />
        </div>
      </div>
    </div>
  );
}