export interface RPPlayer {
  id: number;
  date: string;
  rank: number;
  playerId: string;
  playerName: string;
  rp: number;
}

export interface RPRankingResponse {
  date: string | null;
  rankings: RPPlayer[];
}