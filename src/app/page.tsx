import Link from "next/link";

const pages = [
  {
    name: "RP Ranking",
    href: "/rankings/rp",
  },
  {
    name: "Guild Ranking",
    href: "/rankings/guild",
  },
  {
    name: "Fame Ranking",
    href: "/rankings/fame",
  },
  {
    name: "Event Box Simulator",
    href: "/events",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6">
        <h1 className="mb-3 text-4xl font-bold">Mafia42</h1>

        <p className="mb-10 text-gray-500">
          Rankings and Event Box Simulator
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="rounded-xl border border-gray-300 p-6 transition active:bg-gray-100 hover:border-gray-400 hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold">{page.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}