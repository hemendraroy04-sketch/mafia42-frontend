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
  const [openingBox, setOpeningBox] = useState<number | null>(null);
  const [result, setResult] = useState<EventItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api<Event>(`/api/events/${id}`);
        setEvent(data);
      } catch {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const openBox = async (boxId: number) => {
    try {
      setOpeningBox(boxId);
      setResult(null);
      setError("");

      const data = await api<{ item: EventItem }>(
        `/api/events/${id}/boxes/${boxId}/open`,
        {
          method: "POST",
        },
      );

      setResult(data.item);
    } catch {
      setError("Failed to open box");
    } finally {
      setOpeningBox(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  if (error && !event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        {error}
      </main>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">{event.name}</h1>

        <p className="mt-2 text-gray-400">{event.year}</p>

        {error && (
          <p className="mt-6 text-red-400">{error}</p>
        )}

        {result && (
          <div className="mt-8 rounded-xl border border-gray-700 p-6">
            <p className="mb-4 text-sm text-gray-400">
              You received
            </p>

            <div className="flex items-center gap-4">
              <img
                src={result.image}
                alt={result.name}
                className="h-20 w-20 rounded-lg object-contain"
              />

              <div>
                <h2 className="text-xl font-semibold">
                  {result.name}
                </h2>

                <p className="mt-1 text-gray-400">
                  {result.probability}%
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {event.boxes.map((box) => (
            <div
              key={box.id}
              className="rounded-xl border border-gray-800 p-6"
            >
              <h2 className="text-xl font-semibold">
                {box.name}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {box.items.length} items
              </p>

              <button
                onClick={() => openBox(box.id)}
                disabled={openingBox !== null}
                className="mt-6 w-full rounded-lg bg-white px-4 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {openingBox === box.id ? "Opening..." : "Open Box"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}