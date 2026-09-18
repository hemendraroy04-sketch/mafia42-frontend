"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Globe2 } from "lucide-react";
import { api } from "@/lib/api";
import { GuildRankingResponse } from "@/types/guild";
import HomeLink from "@/components/HomeLink";
import PageHeader from "@/components/PageHeader";
import NoData from "@/components/NoData";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function GuildRankingPage() {
  const [data, setData] = useState<GuildRankingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadRanking = async () => {
      try {
        const result = await api<GuildRankingResponse>(
          "/api/rankings/guild",
        );

        if (cancelled) return;

        setData(result);
      } catch {
        if (cancelled) return;

        setError("Failed to load Guild ranking");
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

      const result = await api<GuildRankingResponse>(
        `/api/rankings/guild?date=${dateString}`,
      );

      setData(result);
    } catch {
      setError("Failed to load Guild ranking");
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
          title="Guild Ranking"
          date={data?.date}
          onDateChange={handleDateChange}
        />

        {!data?.rankings.length ? (
          <NoData />
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-300">
            {data.rankings.map((guild) => (
              <div
                key={guild.id}
                className="flex items-center justify-between border-b border-gray-300 px-6 py-4 transition last:border-b-0 hover:bg-gray-50 active:bg-gray-100"
              >
                <div className="flex items-center gap-6">
                  <span className="w-8 text-gray-500">
                    #{guild.rank}
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-gray-200">
                      {guild.guild.country.toLowerCase() === "none" ? (
                        <Globe2 className="h-full w-full p-1.5 text-gray-500" />
                      ) : (
                        <Image
                          src={`https://flagcdn.com/w80/${guild.guild.country.toLowerCase()}.png`}
                          alt={guild.guild.country}
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <p className="font-medium">{guild.guild.name}</p>
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