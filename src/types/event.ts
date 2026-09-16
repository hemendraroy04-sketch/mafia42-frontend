export interface Event {
  id: number;
  name: string;
  year: number;
}

export interface EventsResponse {
  events: Event[];
}