"use client";

import RankingPage from "@/components/RankingPage";
import { FameRankingResponse } from "@/types/fame";
import { formatScore } from "@/utils/numberFormatting";

export default function FameRankingPage() {
  return (
    <RankingPage<FameRankingResponse>
      title="Fame Ranking"
      endpoint="/api/rankings/fame"
      errorMessage="Failed to load Fame ranking"
      detailType="player"
      detailMode="fame"
      toRow={(entry) => ({
        id: entry.id,
        detailId: entry.playerId,
        rank: entry.rank,
        name: entry.player.name,
        country: entry.player.country,
        score: formatScore(entry.fame, "Fame"),
        change: entry.change,
      })}
    />
  );
}