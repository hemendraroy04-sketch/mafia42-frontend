export interface FamePlayer {
  id: number;
  date: string;
  rank: number;
  playerId: string;
  playerName: string;
  fame: number;
}

export interface FameRankingResponse {
  date: string | null;
  rankings: FamePlayer[];
}