import type { ComponentProps } from "react";
import type PageHeader from "@/components/PageHeader";

type PageHeaderDate = ComponentProps<typeof PageHeader>["date"];

export interface BaseRankingResponse {
  date?: PageHeaderDate;
  rankings: readonly unknown[];
}

export interface RankingRowData {
  id: string | number;
  detailId: string | number;
  rank: number;
  name: string;
  country: string;
  score: string;
  change?: number | null;
}

export interface PlayerRankingDetails {
  id: number;
  name: string;
  country: string;
  RPLbcount: number;
  FameLBcount: number;
  PeakRP: number | null;
  PeakFame: number | null;
  PeakRPRank: number | null;
  PeakFameRank: number | null;
}

export interface GuildRankingDetails {
  id: number;
  name: string;
  country: string;
  GuildLbCount: number;
  PeakGP: number | null;
  PeakGPRank: number | null;
}