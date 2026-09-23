"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatDate } from "@/utils/dateFormatting";

export function useRanking<T>(endpoint: string, errorMessage: string) {
  const [date, setDate] = useState<Date>();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const url = date ? `${endpoint}?date=${formatDate(date)}` : endpoint;
        const result = await api<T>(url);

        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setError(errorMessage);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [endpoint, errorMessage, date]);

  // Runs from an event handler, so setting state here is fine.
  const loadForDate = useCallback((newDate: Date) => {
    setLoading(true);
    setError("");
    setDate(newDate);
  }, []);

  return { data, loading, error, loadForDate };
}