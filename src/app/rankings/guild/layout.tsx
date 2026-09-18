import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guild Ranking",
  description:
    "View Mafia42 Guild rankings and check Guild rankings from previous days.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}