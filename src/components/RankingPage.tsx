"use client";

import { useState } from "react";
import HomeLink from "@/components/HomeLink";
import PageHeader from "@/components/PageHeader";
import NoData from "@/components/NoData";
import FullPageMessage from "@/components/FullPageMessage";
import RankingRow from "@/components/RankingRow";
import RankingSkeleton from "@/components/RankingSkeleton";
import { useRanking } from "@/hooks/useRanking";
import { api } from "@/lib/api";
import type {
  BaseRankingResponse,
  GuildRankingDetails,
  PlayerRankingDetails,
  RankingRowData,
} from "@/types/ranking";

interface RankingPageProps<TResponse extends BaseRankingResponse> {
  title: string;
  endpoint: string;
  errorMessage: string;
  detailType: "player" | "guild";
  detailMode?: "rp" | "fame";
  toRow: (entry: TResponse["rankings"][number]) => RankingRowData;
}

export default function RankingPage<TResponse extends BaseRankingResponse>({
  title,
  endpoint,
  errorMessage,
  detailType,
  detailMode,
  toRow,
}: RankingPageProps<TResponse>) {
  const { data, loading, error, loadForDate } = useRanking<TResponse>(
    endpoint,
    errorMessage,
  );

  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const [details, setDetails] = useState<
    PlayerRankingDetails | GuildRankingDetails | null
  >(null);

  const handleRowClick = async (
    id: string | number,
    row: RankingRowData,
  ) => {
    if (expandedId === id) {
      setExpandedId(null);
      setDetails(null);
      return;
    }

    try {
      const detailsEndpoint = detailType === "player"
        ? `/api/players/${row.name}`
        : `/api/guilds/${row.name}`;

      const result = await api<PlayerRankingDetails | GuildRankingDetails> (detailsEndpoint);

      setDetails(result);
      setExpandedId(id);
    }
    catch (error) {
      console.error("Failed to fetch ranking details:", error);
      setDetails(null);
      setExpandedId(null);
    }
  };

  if (loading && !data) {
    return <FullPageMessage>Loading...</FullPageMessage>;
  }

  let content;

  if (loading) {
    content = <RankingSkeleton />;
  } else if (error) {
    content = (
      <p
        role="alert"
        className="rounded-xl border border-gray-300 px-6 py-10 text-center text-gray-600"
      >
        {error}
      </p>
    );
  } else if (!data?.rankings.length) {
    content = <NoData />;
  } else {
    content = (
      <div className="overflow-hidden rounded-xl border border-gray-300">
        {data.rankings.map((entry) => {
          const row = toRow(entry);

          if (detailType === "player") {
            return (
              <RankingRow
                key={row.id}
                {...row}
                detailType="player"
                detailMode={detailMode}
                expanded={expandedId === row.id}
                onClick={() => handleRowClick(row.id, row)}
                details={
                  expandedId === row.id &&
                  details &&
                  "RPLbcount" in details
                    ? details
                    : null
                }
              />
            );
          }

          return (
            <RankingRow
              key={row.id}
              {...row}
              detailType="guild"
              expanded={expandedId === row.id}
              onClick={() => handleRowClick(row.id, row)}
              details={
                expandedId === row.id &&
                details &&
                "GuildLbCount" in details
                  ? details
                  : null
              }
            />
          );
        })}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <HomeLink />

        <PageHeader
          title={title}
          date={data?.date}
          onDateChange={(date) => {
            setExpandedId(null);
            setDetails(null);
            loadForDate(date);
          }}
        />

        {content}
      </div>
    </main>
  );
}