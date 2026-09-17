"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Dropdown from "@/components/Dropdown";
import { Event, EventItem, EventListItem } from "@/types/event";

const FALLBACK_IMAGE = "https://i.ibb.co/3YRDDNfv/none.png";

interface EventBoxClientProps {
  events: EventListItem[];
  event: Event;
}

export default function EventBoxClient({
  events,
  event,
}: EventBoxClientProps) {
  const router = useRouter();

  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(
    event.boxes.length > 0 ? event.boxes[0].id : null,
  );

  const [openingBox, setOpeningBox] = useState(false);
  const [result, setResult] = useState<EventItem | null>(null);
  const [resultKey, setResultKey] = useState(0);

  const selectedBox = event.boxes.find((box) => box.id === selectedBoxId);

  const openBox = () => {
    if (!selectedBox || selectedBox.items.length === 0) return;

    setOpeningBox(true);
    setResult(null);

    setTimeout(() => {
      const totalProbability = selectedBox.items.reduce(
        (sum, item) => sum + item.probability,
        0,
      );

      const random = Math.random() * totalProbability;

      let cumulativeProbability = 0;

      for (const item of selectedBox.items) {
        cumulativeProbability += item.probability;

        if (random < cumulativeProbability) {
          setResult(item);
          setResultKey((key) => key + 1);
          break;
        }
      }

      setOpeningBox(false);
    }, 500);
  };

  return (
    <>
      {/* Event Selector */}
      <div className="mt-10">
        <Dropdown
          label="Select Event"
          value={event.id}
          onChange={(value) => router.push(`/events/${value}`)}
          options={events.map((item) => ({
            label: `${item.name} (${item.month}/${item.year})`,
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

      {selectedBox && (
        <div className="mt-8 rounded-xl border border-gray-300 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{selectedBox.name}</h2>

            <span className="text-sm text-gray-500">
              {selectedBox.items.length} items
            </span>
          </div>

          {/* Result */}
          <div className="mt-6 h-28">
            {result && (
              <div
                key={resultKey}
                className="reveal-pop h-full rounded-lg border border-gray-300 p-4"
              >
                <p className="mb-2 text-sm text-gray-500">You received</p>

                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0">
                    <Image
                      src={result.image || FALLBACK_IMAGE}
                      alt={result.name}
                      fill
                      priority
                      className="rounded-lg object-contain"
                      sizes="56px"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold">{result.name}</h2>
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
            {selectedBox.items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-300 p-3 transition hover:bg-gray-50 active:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12">
                    <Image
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      fill
                      // Eagerly load the first few items (likely above the
                      // fold); let the rest lazy-load as the user scrolls.
                      priority={index < 4}
                      className="rounded-md object-contain"
                      sizes="48px"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>

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
    </>
  );
}