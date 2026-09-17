"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { EventListItem, EventsResponse } from "@/types/event";
import HomeLink from "@/components/HomeLink";
import Image from "next/image";

export default function EventsPage() {
  const [events, setEvents] = useState<EventListItem[]>([]);
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
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        Loading...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        {error}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto max-w-4xl">
        <HomeLink />

        <h1 className="mb-2 text-3xl font-bold">
          Event Box Simulator
        </h1>

        <p className="mb-8 text-gray-500">
          Select an event to continue.
        </p>

        {!events.length ? (
          <p className="text-gray-500">
            No events available.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="overflow-hidden rounded-xl border border-gray-300 transition hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
              >
                <div className="relative h-48 border-b border-gray-200">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-semibold">
                    {event.name}
                  </h2>

                  <p className="mt-2 text-gray-500">
                    {event.month}/{event.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}