import { api } from "@/lib/api";
import HomeLink from "@/components/HomeLink";
import EventBoxClient from "./EventBoxClient";
import { Event, EventsResponse } from "@/types/event";

// Revalidate this route's data at most once a minute (ISR-style).
// Adjust or remove if your event data changes more/less often.
export const revalidate = 60;

interface EventPageProps {
  params: Promise<{ id: string }>;
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

  // Fetch the events list (for the dropdown) and the current event's
  // detail in parallel, on the server, before any HTML is sent.
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