"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FameRankingResponse } from "@/types/fame";
import HomeLink from "@/components/HomeLink";
import PageHeader from "@/components/PageHeader";
import NoData from "@/components/NoData";

export default function FameRankingPage() {
  const [data, setData] = useState<FameRankingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const result = await api<FameRankingResponse>(
          "/api/rankings/fame",
        );

        setData(result);
      } catch {
        setError("Failed to load Fame ranking");
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        Loading...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        {error}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto max-w-4xl">
        <HomeLink />
        <PageHeader title="Fame Ranking" date={data?.date} />

        {!data?.rankings.length ? (
          <NoData />
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-300">
            {data.rankings.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between border-b border-gray-300 px-6 py-4 transition last:border-b-0 hover:bg-gray-50 active:bg-gray-100"
              >
                <div className="flex items-center gap-6">
                  <span className="w-8 text-gray-500">
                    #{player.rank}
                  </span>

                  <div>
                    <p className="font-medium">
                      {player.playerName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {player.playerId}
                    </p>
                  </div>
                </div>

                <span className="font-semibold">
                  {player.fame.toLocaleString()} Fame
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}