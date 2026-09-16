"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import HomeLink from "@/components/HomeLink";

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

interface EventListItem {
  id: number;
  name: string;
  year: number;
}

interface EventsResponse {
  events: EventListItem[];
}

export default function EventPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [events, setEvents] = useState<EventListItem[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [openingBox, setOpeningBox] = useState(false);
  const [result, setResult] = useState<EventItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api<EventsResponse>("/api/events");
        setEvents(data.events);
      } catch {
        setError("Failed to load events");
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");
        setResult(null);

        const data = await api<Event>(`/api/events/${id}`);

        setEvent(data);

        setSelectedBoxId(
          data.boxes.length > 0 ? data.boxes[0].id : null,
        );
      } catch {
        setEvent(null);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (!Number.isNaN(id)) {
      fetchEvent();
    }
  }, [id]);

  const selectedBox = event?.boxes.find(
    (box) => box.id === selectedBoxId,
  );

  const openBox = async () => {
    if (!selectedBox) return;

    try {
      setOpeningBox(true);
      setResult(null);
      setError("");

      const data = await api<{ item: EventItem }>(
        `/api/events/${id}/boxes/${selectedBox.id}/open`,
        {
          method: "POST",
        },
      );

      setResult(data.item);
    } catch {
      setError("Failed to open box");
    } finally {
      setOpeningBox(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-black">
        <div className="mx-auto max-w-4xl">
        <HomeLink />
          <h1 className="text-3xl font-bold">
            Event Box Simulator
          </h1>

          <p className="mt-8 text-gray-500">
            Loading event...
          </p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-black">
        <div className="mx-auto max-w-4xl">
        <HomeLink />
          <h1 className="text-3xl font-bold">
            Event Box Simulator
          </h1>

          <p className="mt-8 text-red-600">
            {error || "Event not found"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto max-w-4xl">
        <HomeLink />
        <h1 className="text-3xl font-bold">
          Event Box Simulator
        </h1>

        {/* Event Selector */}
        <div className="mt-10">
          <label
            htmlFor="event"
            className="mb-2 block text-sm text-gray-500"
          >
            Select Event
          </label>

          <select
            id="event"
            value={event.id}
            onChange={(e) => {
              router.push(`/events/${e.target.value}`);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-black"
          >
            {events.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.year})
              </option>
            ))}
          </select>
        </div>

        {/* Box Selector */}
        <div className="mt-6">
          <label
            htmlFor="box"
            className="mb-2 block text-sm text-gray-500"
          >
            Select Box
          </label>

          <select
            id="box"
            value={selectedBoxId ?? ""}
            onChange={(e) => {
              setSelectedBoxId(Number(e.target.value));
              setResult(null);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-black"
          >
            {event.boxes.map((box) => (
              <option key={box.id} value={box.id}>
                {box.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mt-6 text-red-600">
            {error}
          </p>
        )}

        {selectedBox && (
        <div className="mt-8 rounded-xl border border-gray-300 p-6">
            <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
                {selectedBox.name}
            </h2>

            <span className="text-sm text-gray-500">
                {selectedBox.items.length} items
            </span>
            </div>

            {/* Result */}
            <div className="mt-6 h-[112px]">
            {result && (
                <div className="h-full rounded-lg border border-gray-300 p-4">
                <p className="mb-2 text-sm text-gray-500">
                    You received
                </p>

                <div className="flex items-center gap-4">
                    <img
                    src={result.image}
                    alt={result.name}
                    className="h-14 w-14 rounded-lg object-contain"
                    />

                    <div>
                    <h2 className="font-semibold">
                        {result.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                        {result.probability}%
                    </p>
                    </div>
                </div>
                </div>
            )}
            </div>

            {/* Open Box Button */}
            <button
            onClick={openBox}
            disabled={openingBox}
            className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 active:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
            {openingBox ? "Opening..." : "Open Box"}
            </button>

            {/* Items */}
            <div className="mt-6 space-y-3">
            {selectedBox.items.map((item) => (
                <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-300 p-3 transition hover:bg-gray-50 active:bg-gray-100"
                >
                <div className="flex items-center gap-3">
                    <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-md object-contain"
                    />

                    <span>{item.name}</span>
                </div>

                <span className="text-sm text-gray-500">
                    {item.probability}%
                </span>
                </div>
            ))}
            </div>
        </div>
        )}
      </div>
    </main>
  );
}