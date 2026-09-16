"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import HomeLink from "@/components/HomeLink";
import Dropdown from "@/components/Dropdown";

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
  const [resultKey, setResultKey] = useState(0);
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

      // small artificial delay so the spinner is visible even on fast responses
      const [data] = await Promise.all([
        api<{ item: EventItem }>(
          `/api/events/${id}/boxes/${selectedBox.id}/open`,
          { method: "POST" },
        ),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);

      setResult(data.item);
      setResultKey((key) => key + 1);
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
          <Dropdown
            label="Select Event"
            value={event.id}
            onChange={(value) => router.push(`/events/${value}`)}
            options={events.map((item) => ({
              label: `${item.name} (${item.year})`,
              value: item.id,
            }))}
          />
        </div>

        {/* Box Selector */}
        <div className="mt-6">
          <Dropdown
            label="Select Box"
            value={selectedBoxId}
            onChange={(value) => {
              setSelectedBoxId(Number(value));
              setResult(null);
            }}
            options={event.boxes.map((box) => ({
              label: box.name,
              value: box.id,
            }))}
          />
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
                <div
                key={resultKey}
                className="reveal-pop h-full rounded-lg border border-gray-300 p-4"
                >
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
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] active:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
            {openingBox && <Loader2 size={18} className="animate-spin" />}
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

      <style jsx global>{`
        @keyframes reveal-pop {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(8px);
          }
          60% {
            opacity: 1;
            transform: scale(1.03) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .reveal-pop {
          animation: reveal-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </main>
  );
}