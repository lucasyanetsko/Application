export interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  salary: number;
  projection: number;
  value?: number; // projection per $1000
}

export interface LineupPosition {
  position: string;
  count: number;
}

export interface LineupSettings {
  salaryCap: number;
  positions: LineupPosition[];
  maxFromTeam: number;
}