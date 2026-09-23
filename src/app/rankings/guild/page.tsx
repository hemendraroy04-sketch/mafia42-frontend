"use client";

import RankingPage from "@/components/RankingPage";
import { GuildRankingResponse } from "@/types/guild";
import { formatScore } from "@/utils/numberFormatting";

export default function GuildRankingPage() {
  return (
    <RankingPage<GuildRankingResponse>
      title="Guild Ranking"
      endpoint="/api/rankings/guild"
      errorMessage="Failed to load Guild ranking"
      toRow={(entry) => ({
        id: entry.id,
        rank: entry.rank,
        name: entry.guild.name,
        country: entry.guild.country,
        score: formatScore(entry.gp, "GP"),
        change: entry.change,
      })}
    />
  );
}