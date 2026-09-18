import type { ComponentProps } from "react";
import type PageHeader from "@/components/PageHeader";

type PageHeaderDate = ComponentProps<typeof PageHeader>["date"];

/** Minimum shape every ranking API response must satisfy. */
export interface BaseRankingResponse {
  date?: PageHeaderDate;
  rankings: readonly unknown[];
}

/** Normalised row data that <RankingRow /> knows how to render. */
export interface RankingRowData {
  id: string | number;
  rank: number;
  name: string;
  country: string;
  score: string;
}