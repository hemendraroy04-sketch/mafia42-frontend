import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fame Ranking",
  description:
    "View Mafia42 Fame rankings and check Fame rankings from previous days.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}