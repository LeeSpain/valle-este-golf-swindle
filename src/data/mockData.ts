import { Player, Game, Score, WeatherData, PhotoItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Generate some mock data for our application
export const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+34 612 345 678',
    gender: 'male',
    handicap: 18.4,
    preferredTee: 'yellow',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Sarah Jones',
    email: 'sarah@example.com',
    phone: '+34 623 456 789',
    gender: 'female',
    handicap: 22.1,
    preferredTee: 'red',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    name: 'David Garcia',
    email: 'david@example.com',
    gender: 'male',
    handicap: 12.7,
    preferredTee: 'yellow',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    facebookLink: 'https://facebook.com/emma.wilson',
    gender: 'female',
    handicap: 20.3,
    preferredTee: 'red',
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12')
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+34 634 567 890',
    gender: 'male',
    handicap: 15.6,
    preferredTee: 'yellow',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  }
];

// Create mock games
const today = new Date();
const nextSunday = new Date(today);
nextSunday.setDate(today.getDate() + (7 - today.getDay()) % 7);

const lastSunday = new Date(today);
lastSunday.setDate(today.getDate() - today.getDay());

const twoWeeksAgo = new Date(lastSunday);
twoWeeksAgo.setDate(lastSunday.getDate() - 7);

export const mockGames: Game[] = [
  {
    id: '1',
    date: twoWeeksAgo,
    courseSide: 'front9',
    teeTime: '10:30',
    notes: 'Meet at the clubhouse at 10:00',
    players: ['1', '2', '3', '4'],
    isVerified: true,
    isComplete: true,
    createdAt: new Date(twoWeeksAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(twoWeeksAgo.getTime() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    date: lastSunday,
    courseSide: 'back9',
    teeTime: '10:30',
    players: ['1', '3', '4', '5'],
    isVerified: true,
    isComplete: true,
    createdAt: new Date(lastSunday.getTime() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(lastSunday.getTime() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    date: nextSunday,
    courseSide: 'front9',
    teeTime: '10:30',
    notes: 'Weather looks great this week!',
    players: ['1', '2', '3', '5'],
    isVerified: false,
    isComplete: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Create mock scores
export const mockScores: Score[] = [
  {
    id: '1',
    gameId: '1',
    playerId: '1',
    holes: [
      { holeNumber: 1, strokes: 5, stablefordPoints: 2 },
      { holeNumber: 2, strokes: 6, stablefordPoints: 2 },
      { holeNumber: 3, strokes: 5, stablefordPoints: 1 },
      { holeNumber: 4, strokes: 4, stablefordPoints: 1 },
      { holeNumber: 5, strokes: 5, stablefordPoints: 2 },
      { holeNumber: 6, strokes: 6, stablefordPoints: 1 },
      { holeNumber: 7, strokes: 4, stablefordPoints: 1 },
      { holeNumber: 8, strokes: 7, stablefordPoints: 1 },
      { holeNumber: 9, strokes: 5, stablefordPoints: 2 }
    ],
    totalStrokes: 47,
    totalNetStrokes: 37,
    totalStablefordPoints: 13,
    isVerified: true,
    createdAt: new Date(twoWeeksAgo.getTime() + 5 * 60 * 60 * 1000),
    updatedAt: new Date(twoWeeksAgo.getTime() + 5 * 60 * 60 * 1000)
  },
  {
    id: '2',
    gameId: '1',
    playerId: '2',
    holes: [
      { holeNumber: 1, strokes: 6, stablefordPoints: 1 },
      { holeNumber: 2, strokes: 7, stablefordPoints: 1 },
      { holeNumber: 3, strokes: 6, stablefordPoints: 1 },
      { holeNumber: 4, strokes: 4, stablefordPoints: 2 },
      { holeNumber: 5, strokes: 5, stablefordPoints: 2 },
      { holeNumber: 6, strokes: 6, stablefordPoints: 1 },
      { holeNumber: 7, strokes: 4, stablefordPoints: 1 },
      { holeNumber: 8, strokes: 8, stablefordPoints: 0 },
      { holeNumber: 9, strokes: 6, stablefordPoints: 1 }
    ],
    totalStrokes: 52,
    totalNetStrokes: 42,
    totalStablefordPoints: 10,
    isVerified: true,
    createdAt: new Date(twoWeeksAgo.getTime() + 5 * 60 * 60 * 1000),
    updatedAt: new Date(twoWeeksAgo.getTime() + 5 * 60 * 60 * 1000)
  },
  {
    id: '3',
    gameId: '1',
    playerId: '3',
    holes: [
      { holeNumber: 1, strokes: 4, stablefordPoints: 3 },
      { holeNumber: 2, strokes: 5, stablefordPoints: 3 },
      { holeNumber: 3, strokes: 5, stablefordPoints: 1 },
      { holeNumber: 4, strokes: 3, stablefordPoints: 3 },
      { holeNumber: 5, strokes: 4, stablefordPoints: 3 },
      { holeNumber: 6, strokes: 5, stablefordPoints: 2 },
      { holeNumber: 7, strokes: 3, stablefordPoints: 2 },
      { holeNumber: 8, strokes: 6, stablefordPoints: 2 },
      { holeNumber: 9, strokes: 4, stablefordPoints: 3 }
    ],
    totalStrokes: 39,
    totalNetStrokes: 32,
    totalStablefordPoints: 22,
    isVerified: true,
    createdAt: new Date(twoWeeksAgo.getTime() + 5 * 60 * 60 * 1000),
    updatedAt: new Date(twoWeeksAgo.getTime() + 5 * 60 * 60 * 1000)
  },
  {
    id: '4',
    gameId: '1',
    playerId: '4',
    holes: [
      { holeNumber: 1, strokes: 6, stablefordPoints: 1 },
      { holeNumber: 2, strokes: 7, stablefordPoints: 1 },
      { holeNumber: 3, strokes: 7, stablefordPoints: 0 },
      { holeNumber: 4, strokes: 4, stablefordPoints: 2 },
      { holeNumber: 5, strokes: 6, stablefordPoints: 1 },
      { holeNumber: 6, strokes: 5, stablefordPoints: 2 },
      { holeNumber: 7, strokes: 4, stablefordPoints: 1 },
      { holeNumber: 8, strokes: 8, stablefordPoints: 0 },
      { holeNumber: 9, strokes: 5, stablefordPoints: 2 }
    ],
    totalStrokes: 52,
    totalNetStrokes: 42,
    totalStablefordPoints: 10,
    isVerified: true,
    createdAt: new Date(twoWeeksAgo.getTime() + 5 * 60 * 60 * 1000),
    updatedAt: new Date(twoWeeksAgo.getTime() + 5 * 60 * 60 * 1000)
  },
  {
    id: '5',
    gameId: '2',
    playerId: '1',
    holes: [
      { holeNumber: 10, strokes: 5, stablefordPoints: 2 },
      { holeNumber: 11, strokes: 3, stablefordPoints: 2 },
      { holeNumber: 12, strokes: 6, stablefordPoints: 0 },
      { holeNumber: 13, strokes: 6, stablefordPoints: 2 },
      { holeNumber: 14, strokes: 5, stablefordPoints: 2 },
      { holeNumber: 15, strokes: 4, stablefordPoints: 1 },
      { holeNumber: 16, strokes: 5, stablefordPoints: 2 },
      { holeNumber: 17, strokes: 7, stablefordPoints: 1 },
      { holeNumber: 18, strokes: 5, stablefordPoints: 2 }
    ],
    totalStrokes: 46,
    totalNetStrokes: 36,
    totalStablefordPoints: 14,
    isVerified: true,
    createdAt: new Date(lastSunday.getTime() + 5 * 60 * 60 * 1000),
    updatedAt: new Date(lastSunday.getTime() + 5 * 60 * 60 * 1000)
  },
  {
    id: '6',
    gameId: '2',
    playerId: '3',
    holes: [
      { holeNumber: 10, strokes: 4, stablefordPoints: 3 },
      { holeNumber: 11, strokes: 3, stablefordPoints: 2 },
      { holeNumber: 12, strokes: 5, stablefordPoints: 1 },
      { holeNumber: 13, strokes: 5, stablefordPoints: 3 },
      { holeNumber: 14, strokes: 4, stablefordPoints: 3 },
      { holeNumber: 15, strokes: 3, stablefordPoints: 2 },
      { holeNumber: 16, strokes: 4, stablefordPoints: 3 },
      { holeNumber: 17, strokes: 6, stablefordPoints: 2 },
      { holeNumber: 18, strokes: 4, stablefordPoints: 3 }
    ],
    totalStrokes: 38,
    totalNetStrokes: 31,
    totalStablefordPoints: 22,
    isVerified: true,
    createdAt: new Date(lastSunday.getTime() + 5 * 60 * 60 * 1000),
    updatedAt: new Date(lastSunday.getTime() + 5 * 60 * 60 * 1000)
  },
  {
    id: '7',
    gameId: '2',
    playerId: '4',
    holes: [
      { holeNumber: 10, strokes: 6, stablefordPoints: 1 },
      { holeNumber: 11, strokes: 4, stablefordPoints: 1 },
      { holeNumber: 12, strokes: 7, stablefordPoints: 0 },
      { holeNumber: 13, strokes: 7, stablefordPoints: 1 },
      { holeNumber: 14, strokes: 5, stablefordPoints: 2 },
      { holeNumber: 15, strokes: 4, stablefordPoints: 1 },
      { holeNumber: 16, strokes: 6, stablefordPoints: 1 },
      { holeNumber: 17, strokes: 8, stablefordPoints: 0 },
      { holeNumber: 18, strokes: 6, stablefordPoints: 1 }
    ],
    totalStrokes: 53,
    totalNetStrokes: 43,
    totalStablefordPoints: 8,
    isVerified: true,
    createdAt: new Date(lastSunday.getTime() + 5 * 60 * 60 * 1000),
    updatedAt: new Date(lastSunday.getTime() + 5 * 60 * 60 * 1000)
  },
  {
    id: '8',
    gameId: '2',
    playerId: '5',
    holes: [
      { holeNumber: 10, strokes: 5, stablefordPoints: 2 },
      { holeNumber: 11, strokes: 3, stablefordPoints: 2 },
      { holeNumber: 12, strokes: 5, stablefordPoints: 1 },
      { holeNumber: 13, strokes: 6, stablefordPoints: 2 },
      { holeNumber: 14, strokes: 4, stablefordPoints: 3 },
      { holeNumber: 15, strokes: 3, stablefordPoints: 2 },
      { holeNumber: 16, strokes: 5, stablefordPoints: 2 },
      { holeNumber: 17, strokes: 6, stablefordPoints: 2 },
      { holeNumber: 18, strokes: 4, stablefordPoints: 3 }
    ],
    totalStrokes: 41,
    totalNetStrokes: 33,
    totalStablefordPoints: 19,
    isVerified: true,
    createdAt: new Date(lastSunday.getTime() + 5 * 60 * 60 * 1000),
    updatedAt: new Date(lastSunday.getTime() + 5 * 60 * 60 * 1000)
  }
];

// Mock weather data
export const mockWeather: WeatherData = {
  temperature: 22,
  condition: 'sunny',
  iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png',
  windSpeed: 8
};

export const mockPhotos: PhotoItem[] = [
  {
    id: 'ph1',
    url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa',
    caption: 'Beautiful day at the course',
    uploadedBy: 'p1',
    gameId: 'g1',
    createdAt: new Date()
  }
];

// Helper function to create a new player
export const createPlayer = (data: Partial<Player>): Player => {
  const now = new Date();
  return {
    id: uuidv4(),
    name: data.name || '',
    email: data.email || '',
    phone: data.phone,
    facebookLink: data.facebookLink,
    gender: data.gender || 'male',
    handicap: data.handicap || 28,
    preferredTee: data.preferredTee || (data.gender === 'female' ? 'red' : 'yellow'),
    createdAt: now,
    updatedAt: now
  };
};

// Helper function to create a new game
export const createGame = (data: Partial<Game>): Game => {
  const now = new Date();
  return {
    id: uuidv4(),
    date: data.date || now,
    courseSide: data.courseSide || 'front9',
    teeTime: data.teeTime || '10:30',
    notes: data.notes,
    players: data.players || [],
    isVerified: false,
    isComplete: false,
    createdAt: now,
    updatedAt: now
  };
};

// Helper function to create or update a score
export const createOrUpdateScore = (data: Partial<Score>): Score => {
  const now = new Date();
  const existingScore = data.id ? mockScores.find(s => s.id === data.id) : null;
  
  if (existingScore) {
    // Update existing score
    return {
      ...existingScore,
      ...data,
      updatedAt: now
    };
  }
  
  // Create new score
  return {
    id: uuidv4(),
    gameId: data.gameId || '',
    playerId: data.playerId || '',
    holes: data.holes || [],
    totalStrokes: data.totalStrokes || 0,
    totalNetStrokes: data.totalNetStrokes || 0,
    totalStablefordPoints: data.totalStablefordPoints || 0,
    isVerified: data.isVerified || false,
    createdAt: now,
    updatedAt: now
  };
};
