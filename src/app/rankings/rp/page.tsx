"use client";

import RankingPage from "@/components/RankingPage";
import { RPRankingResponse } from "@/types/rp";
import { formatScore } from "@/utils/numberFormatting";

export default function RPRankingPage() {
  return (
    <RankingPage<RPRankingResponse>
      title="RP Ranking"
      endpoint="/api/rankings/rp"
      errorMessage="Failed to load RP ranking"
      toRow={(entry) => ({
        id: entry.id,
        rank: entry.rank,
        name: entry.player.name,
        country: entry.player.country,
        score: formatScore(entry.rp, "RP"),
        change: entry.change,
      })}
    />
  );
}