export interface RPPlayer {
  id: number;
  date: string;
  rank: number;
  playerId: number;
  rp: number;
  change?: number | null;
  player: {
    id: number;
    name: string;
    country: string;
  };
}

export interface RPRankingResponse {
  date: string | null;
  rankings: RPPlayer[];
}