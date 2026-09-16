"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Event, EventsResponse } from "@/types/event";
import HomeLink from "@/components/HomeLink";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await api<EventsResponse>("/api/events");
        setEvents(result.events);
      } catch {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        {error}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <HomeLink />
        <h1 className="mb-2 text-3xl font-bold">
          Event Box Simulator
        </h1>

        <p className="mb-8 text-gray-400">
          Select an event to continue.
        </p>

        {!events.length ? (
          <p className="text-gray-400">
            No events available.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="rounded-xl border border-gray-800 p-6 transition hover:border-gray-500 hover:bg-gray-900"
              >
                <h2 className="text-xl font-semibold">
                  {event.name}
                </h2>

                <p className="mt-2 text-gray-400">
                  {event.year}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}