"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { GuildRankingResponse } from "@/types/guild";
import HomeLink from "@/components/HomeLink";

export default function GuildRankingPage() {
  const [data, setData] = useState<GuildRankingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const result = await api<GuildRankingResponse>(
          "/api/rankings/guild",
        );

        setData(result);
      } catch {
        setError("Failed to load Guild ranking");
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        {error}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <HomeLink />
        <h1 className="mb-2 text-3xl font-bold">Guild Ranking</h1>

        {data?.date && (
          <p className="mb-8 text-gray-400">
            Date: {new Date(data.date).toLocaleDateString()}
          </p>
        )}

        {!data?.rankings.length ? (
          <p className="text-gray-400">
            No ranking data available.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-800">
            {data.rankings.map((guild) => (
              <div
                key={guild.id}
                className="flex items-center justify-between border-b border-gray-800 px-6 py-4 last:border-b-0"
              >
                <div className="flex items-center gap-6">
                  <span className="w-8 text-gray-400">
                    #{guild.rank}
                  </span>

                  <div>
                    <p className="font-medium">
                      {guild.guildName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {guild.guildId}
                    </p>
                  </div>
                </div>

                <span className="font-semibold">
                  {guild.gp.toLocaleString()} GP
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}