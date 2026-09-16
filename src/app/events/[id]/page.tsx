"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";

interface EventItem {
  id: number;
  name: string;
  image: string;
  probability: number;
}

interface EventBox {
  id: number;
  name: string;
  items: EventItem[];
}

interface Event {
  id: number;
  name: string;
  year: number;
  boxes: EventBox[];
}

export default function EventPage() {
  const params = useParams();
  const id = params.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await api<Event>(`/api/events/${id}`);
        setEvent(result);
      } catch {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        {error || "Event not found"}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">{event.name}</h1>

        <p className="mt-2 text-gray-400">{event.year}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {event.boxes.map((box) => (
            <div
              key={box.id}
              className="rounded-xl border border-gray-800 p-6"
            >
              <h2 className="text-xl font-semibold">{box.name}</h2>

              <p className="mt-2 text-sm text-gray-500">
                {box.items.length} items
              </p>

              <button
                className="mt-6 w-full rounded-lg bg-white px-4 py-3 font-semibold text-black transition hover:bg-gray-200"
              >
                Open Box
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}