
export type Role = 'admin' | 'player';

export type Gender = 'male' | 'female';

export type TeeColor = 'yellow' | 'red';

export type CourseSide = 'front9' | 'back9';

export interface Player {
  id: string;
  name: string;
  email: string;
  phone?: string;
  facebookLink?: string;
  gender: Gender;
  handicap: number;
  preferredTee: TeeColor;
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  date: Date;
  courseSide: CourseSide;
  teeTime: string;
  notes?: string;
  players: string[]; // Array of player IDs
  isVerified: boolean;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HoleInfo {
  holeNumber: number;
  par: number;
  strokeIndex: number;
  yardageYellow: number;
  yardageRed: number;
}

export interface CourseData {
  front9: HoleInfo[];
  back9: HoleInfo[];
}

export interface Score {
  id: string;
  gameId: string;
  playerId: string;
  holes: {
    holeNumber: number;
    strokes: number;
    stablefordPoints: number;
  }[];
  totalStrokes: number;
  totalNetStrokes: number;
  totalStablefordPoints: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  iconUrl: string;
  windSpeed: number;
}

export interface PhotoItem {
  id: string;
  gameId: string;
  url: string;
  caption?: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  playerId?: string; // Reference to player if user role is 'player'
}
