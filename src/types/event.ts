export interface EventItem {
  id: number;
  name: string;
  image: string;
  probability: number;
}

export interface EventBox {
  id: number;
  name: string;
  items: EventItem[];
}

export interface Event {
  id: number;
  name: string;
  year: number;
  month: number;
  image: string;
  boxes: EventBox[];
}

export interface EventListItem {
  id: number;
  name: string;
  year: number;
  month: number;
  image: string;
}

export interface EventsResponse {
  events: EventListItem[];
}