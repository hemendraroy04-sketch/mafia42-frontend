import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RP Ranking",
  description:
    "View Mafia42 RP rankings and check RP rankings from previous days.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}