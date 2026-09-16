"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
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

export default function EventPage() {
  const params = useParams();
  const id = params.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [openingBox, setOpeningBox] = useState(false);
  const [result, setResult] = useState<EventItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api<Event>(`/api/events/${id}`);

        setEvent(data);

        if (data.boxes.length > 0) {
          setSelectedBoxId(data.boxes[0].id);
        }
      } catch {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
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
      <div className="mx-auto max-w-4xl">
        <HomeLink />
        <h1 className="text-3xl font-bold">{event.name}</h1>

        <p className="mt-2 text-gray-400">{event.year}</p>

        {/* Box Selector */}
        <div className="mt-10">
          <label
            htmlFor="box"
            className="mb-2 block text-sm text-gray-400"
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
            className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
          >
            {event.boxes.map((box) => (
              <option key={box.id} value={box.id}>
                {box.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mt-6 text-red-400">{error}</p>
        )}

        {/* Selected Box */}
        {selectedBox && (
          <div className="mt-8 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {selectedBox.name}
              </h2>

              <span className="text-sm text-gray-500">
                {selectedBox.items.length} items
              </span>
            </div>

            {/* Items */}
            <div className="mt-6 space-y-3">
              {selectedBox.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-gray-800 p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-md object-contain"
                    />

                    <span>{item.name}</span>
                  </div>

                  <span className="text-sm text-gray-400">
                    {item.probability}%
                  </span>
                </div>
              ))}
            </div>

            {/* Open Button */}
            <button
              onClick={openBox}
              disabled={openingBox}
              className="mt-6 w-full rounded-lg bg-white px-4 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {openingBox ? "Opening..." : "Open Box"}
            </button>
          </div>
        )}

        {/* Result */}
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
      </div>
    </main>
  );
}