"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RPRankingResponse } from "@/types/rp";
import HomeLink from "@/components/HomeLink";
import PageHeader from "@/components/PageHeader";
import NoData from "@/components/NoData";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function RPRankingPage() {
  const [data, setData] = useState<RPRankingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadRanking = async () => {
      try {
        const dateString = formatDate(new Date());

        const result = await api<RPRankingResponse>(
          `/api/rankings/rp?date=${dateString}`,
        );

        if (cancelled) return;

        setData(result);
      } catch {
        if (cancelled) return;

        setError("Failed to load RP ranking");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRanking();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDateChange = async (date: Date) => {
    try {
      setLoading(true);
      setError("");

      const dateString = formatDate(date);

      const result = await api<RPRankingResponse>(
        `/api/rankings/rp?date=${dateString}`,
      );

      setData(result);
    } catch {
      setError("Failed to load RP ranking");
    } finally {
      setLoading(false);
    }
  };

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

        <PageHeader
          title="RP Ranking"
          date={data?.date}
          onDateChange={handleDateChange}
        />

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
                    <p className="font-medium">{player.playerName}</p>

                    <p className="text-sm text-gray-500">
                      {player.playerId}
                    </p>
                  </div>
                </div>

                <span className="font-semibold">
                  {player.rp.toLocaleString()} RP
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}