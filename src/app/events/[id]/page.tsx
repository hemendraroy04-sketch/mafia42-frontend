import type { Metadata } from "next";
import { api } from "@/lib/api";
import HomeLink from "@/components/HomeLink";
import EventBoxClient from "./EventBoxClient";
import { Event, EventsResponse } from "@/types/event";

export const revalidate = 60;

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const eventId = Number(id);

  if (Number.isNaN(eventId)) {
    return {
      title: "Event Not Found | Mafia42",
      description: "The requested Mafia42 event could not be found.",
    };
  }

  try {
    const event = await api<Event>(`/api/events/${eventId}`, {
      next: { revalidate: 60 },
    } as RequestInit);

    return {
      title: `${event.name} | Mafia42`,
      description: `Explore the Mafia42 ${event.name} event, including its Event Boxes, items, and drop probabilities.`,
      openGraph: {
        title: `${event.name} | Mafia42`,
        description: `Explore the Mafia42 ${event.name} event, including its Event Boxes, items, and drop probabilities.`,
        images: event.image ? [event.image] : undefined,
      },
    };
  } catch {
    return {
      title: "Event Not Found | Mafia42",
      description: "The requested Mafia42 event could not be found.",
    };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const eventId = Number(id);

  if (Number.isNaN(eventId)) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-black">
        <div className="mx-auto max-w-4xl">
          <HomeLink />
          <h1 className="text-3xl font-bold">Event Box Simulator</h1>
          <p className="mt-8 text-red-600">Event not found</p>
        </div>
      </main>
    );
  }

  const [eventsData, event] = await Promise.all([
    api<EventsResponse>("/api/events", {
      next: { revalidate: 300 },
    } as RequestInit),
    api<Event>(`/api/events/${eventId}`, {
      next: { revalidate: 60 },
    } as RequestInit).catch(() => null),
  ]);

  if (!event) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-black">
        <div className="mx-auto max-w-4xl">
          <HomeLink />
          <h1 className="text-3xl font-bold">Event Box Simulator</h1>
          <p className="mt-8 text-red-600">Event not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto max-w-4xl">
        <HomeLink />

        <h1 className="text-3xl font-bold">Event Box Simulator</h1>

        <EventBoxClient
          key={event.id}
          events={eventsData.events}
          event={event}
        />
      </div>
    </main>
  );
}