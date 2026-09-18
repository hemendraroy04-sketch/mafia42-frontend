import type { MetadataRoute } from "next";
import { EventListItem, EventsResponse } from "@/types/event";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://42.serenic.xyz";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
    {
      next: { revalidate: 3600 },
    },
  );

  const data: EventsResponse = await response.json();

  const eventUrls = data.events.map((event: EventListItem) => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/rankings/rp`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/rankings/fame`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/rankings/guild`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
    },
    ...eventUrls,
  ];
}