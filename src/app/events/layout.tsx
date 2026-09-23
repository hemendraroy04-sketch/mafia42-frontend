import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Box Simulator",
  description: "Simulate Mafia42 Event Boxes and explore events, boxes, items, and drop probabilities.",
};

export default function Layout({children}: { children: React.ReactNode }) {
  return children;
}