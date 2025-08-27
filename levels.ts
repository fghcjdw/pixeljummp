export interface PuzzleElement {
  type: 'switch' | 'door' | 'key' | 'movingPlatform' | 'pressurePlate' | 'spike' | 'checkpoint';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  id: string;
  target?: string; // For switches/keys that control doors
  isActive?: boolean;
  movePattern?: { startX: number; endX: number; startY: number; endY: number; speed: number };
}

export interface GameLevel {
  id: number;
  name: string;
  description: string;
  playerStart: { x: number; y: number };
  platforms: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    isGoal?: boolean;
  }>;
  puzzleElements: PuzzleElement[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit?: number; // in seconds
}

export const LEVELS: GameLevel[] = [
  // LEVEL 1 - Tutorial: Basic jumping
  {
    id: 1,
    name: "First Steps",
    description: "Learn to jump and move. Reach the green goal platform.",
    difficulty: 'easy',
    playerStart: { x: 50, y: 350 },
    platforms: [
      { x: 0, y: 380, width: 150, height: 20, color: '#8B4513' },
      { x: 200, y: 340, width: 100, height: 20, color: '#8B4513' },
      { x: 350, y: 300, width: 150, height: 20, color: '#4CAF50', isGoal: true }
    ],
    puzzleElements: []
  },

  // LEVEL 2 - Simple switch puzzle
  {
    id: 2,
    name: "Red Button",
    description: "Step on the red switch to open the door.",
    difficulty: 'easy',
    playerStart: { x: 50, y: 350 },
    platforms: [
      { x: 0, y: 380, width: 150, height: 20, color: '#8B4513' },
      { x: 200, y: 380, width: 100, height: 20, color: '#8B4513' },
      { x: 350, y: 380, width: 150, height: 20, color: '#8B4513' },
      { x: 600, y: 340, width: 150, height: 20, color: '#4CAF50', isGoal: true }
    ],
    puzzleElements: [
      { type: 'switch', x: 240, y: 360, width: 20, height: 20, color: '#FF0000', id: 'switch1', target: 'door1' },
      { type: 'door', x: 520, y: 320, width: 20, height: 60, color: '#8B4513', id: 'door1', isActive: false }
    ]
  },

  // LEVEL 3 - Key and door
  {
    id: 3,
    name: "Golden Key",
    description: "Collect the key to unlock the door.",
    difficulty: 'easy',
    playerStart: { x: 50, y: 350 },
    platforms: [
      { x: 0, y: 380, width: 150, height: 20, color: '#8B4513' },
      { x: 200, y: 300, width: 100, height: 20, color: '#8B4513' },
      { x: 350, y: 380, width: 150, height: 20, color: '#8B4513' },
      { x: 600, y: 340, width: 150, height: 20, color: '#4CAF50', isGoal: true }
    ],
    puzzleElements: [
      { type: 'key', x: 230, y: 280, width: 15, height: 15, color: '#FFD700', id: 'key1', target: 'door1' },
      { type: 'door', x: 520, y: 320, width: 20, height: 60, color: '#8B4513', id: 'door1', isActive: false }
    ]
  },

  // LEVEL 4 - Moving platform
  {
    id: 4,
    name: "Moving Bridge",
    description: "Time your jump onto the moving platform.",
    difficulty: 'easy',
    playerStart: { x: 50, y: 350 },
    platforms: [
      { x: 0, y: 380, width: 150, height: 20, color: '#8B4513' },
      { x: 500, y: 340, width: 150, height: 20, color: '#4CAF50', isGoal: true }
    ],
    puzzleElements: [
      { 
        type: 'movingPlatform', 
        x: 200, y: 360, width: 80, height: 15, color: '#9C27B0', id: 'moving1',
        movePattern: { startX: 200, endX: 350, startY: 360, endY: 360, speed: 2 }
      }
    ]
  },

  // LEVEL 5 - Pressure plate
  {
    id: 5,
    name: "Heavy Steps",
    description: "Stand on the pressure plate to keep the door open.",
    difficulty: 'easy',
    playerStart: { x: 50, y: 350 },
    platforms: [
      { x: 0, y: 380, width: 150, height: 20, color: '#8B4513' },
      { x: 200, y: 380, width: 100, height: 20, color: '#8B4513' },
      { x: 350, y: 300, width: 100, height: 20, color: '#8B4513' },
      { x: 500, y: 380, width: 150, height: 20, color: '#8B4513' },
      { x: 700, y: 340, width: 150, height: 20, color: '#4CAF50', isGoal: true }
    ],
    puzzleElements: [
      { type: 'pressurePlate', x: 380, y: 280, width: 30, height: 15, color: '#795548', id: 'plate1', target: 'door1' },
      { type: 'door', x: 670, y: 320, width: 20, height: 60, color: '#8B4513', id: 'door1', isActive: false }
    ]
  },

  // LEVEL 6-10: Increasing complexity
  {
    id: 6,
    name: "Double Switch",
    description: "Activate both switches to open the path.",
    difficulty: 'easy',
    playerStart: { x: 50, y: 350 },
    platforms: [
      { x: 0, y: 380, width: 150, height: 20, color: '#8B4513' },
      { x: 200, y: 320, width: 80, height: 20, color: '#8B4513' },
      { x: 320, y: 380, width: 80, height: 20, color: '#8B4513' },
      { x: 450, y: 320, width: 80, height: 20, color: '#8B4513' },
      { x: 600, y: 340, width: 150, height: 20, color: '#4CAF50', isGoal: true }
    ],
    puzzleElements: [
      { type: 'switch', x: 230, y: 300, width: 20, height: 20, color: '#FF0000', id: 'switch1', target: 'door1' },
      { type: 'switch', x: 480, y: 300, width: 20, height: 20, color: '#FF0000', id: 'switch2', target: 'door1' },
      { type: 'door', x: 570, y: 320, width: 20, height: 60, color: '#8B4513', id: 'door1', isActive: false }
    ]
  },

  {
    id: 7,
    name: "Spike Danger",
    description: "Avoid the deadly spikes!",
    difficulty: 'easy',
    playerStart: { x: 50, y: 350 },
    platforms: [
      { x: 0, y: 380, width: 100, height: 20, color: '#8B4513' },
      { x: 200, y: 380, width: 100, height: 20, color: '#8B4513' },
      { x: 400, y: 380, width: 100, height: 20, color: '#8B4513' },
      { x: 600, y: 340, width: 150, height: 20, color: '#4CAF50', isGoal: true }
    ],
    puzzleElements: [
      { type: 'spike', x: 120, y: 360, width: 60, height: 20, color: '#E91E63', id: 'spike1' },
      { type: 'spike', x: 320, y: 360, width: 60, height: 20, color: '#E91E63', id: 'spike2' }
    ]
  },

  {
    id: 8,
    name: "Key Chain",
    description: "Collect both keys in the right order.",
    difficulty: 'medium',
    playerStart: { x: 50, y: 350 },
    platforms: [
      { x: 0, y: 380, width: 150, height: 20, color: '#8B4513' },
      { x: 200, y: 300, width: 80, height: 20, color: '#8B4513' },
      { x: 320, y: 250, width: 80, height: 20, color: '#8B4513' },
      { x: 450, y: 300, width: 80, height: 20, color: '#8B4513' },
      { x: 600, y: 380, width: 150, height: 20, color: '#8B4513' },
      { x: 800, y: 340, width: 150, height: 20, color: '#4CAF50', isGoal: true }
    ],
    puzzleElements: [
      { type: 'key', x: 230, y: 280, width: 15, height: 15, color: '#FFD700', id: 'key1', target: 'door1' },
      { type: 'door', x: 410, y: 280, width: 20, height: 60, color: '#8B4513', id: 'door1', isActive: false },
      { type: 'key', x: 480, y: 280, width: 15, height: 15, color: '#FFD700', id: 'key2', target: 'door2' },
      { type: 'door', x: 770, y: 320, width: 20, height: 60, color: '#8B4513', id: 'door2', isActive: false }
    ]
  },

  {
    id: 9,
    name: "Moving Maze",
    description: "Navigate through moving platforms.",
    difficulty: 'medium',
    playerStart: { x: 50, y: 350 },
    platforms: [
      { x: 0, y: 380, width: 100, height: 20, color: '#8B4513' },
      { x: 600, y: 340, width: 150, height: 20, color: '#4CAF50', isGoal: true }
    ],
    puzzleElements: [
      { 
        type: 'movingPlatform', 
        x: 150, y: 360, width: 60, height: 15, color: '#9C27B0', id: 'moving1',
        movePattern: { startX: 150, endX: 250, startY: 360, endY: 360, speed: 2 }
      },
      { 
        type: 'movingPlatform', 
        x: 300, y: 320, width: 60, height: 15, color: '#9C27B0', id: 'moving2',
        movePattern: { startX: 300, endX: 400, startY: 320, endY: 280, speed: 1.5 }
      },
      { 
        type: 'movingPlatform', 
        x: 450, y: 350, width: 60, height: 15, color: '#9C27B0', id: 'moving3',
        movePattern: { startX: 450, endX: 520, startY: 350, endY: 350, speed: 3 }
      }
    ]
  },

  {
    id: 10,
    name: "Checkpoint Challenge",
    description: "Use the checkpoint to save your progress.",
    difficulty: 'medium',
    playerStart: { x: 50, y: 350 },
    platforms: [
      { x: 0, y: 380, width: 150, height: 20, color: '#8B4513' },
      { x: 200, y: 320, width: 80, height: 20, color: '#8B4513' },
      { x: 350, y: 380, width: 80, height: 20, color: '#8B4513' },
      { x: 500, y: 280, width: 80, height: 20, color: '#8B4513' },
      { x: 650, y: 380, width: 80, height: 20, color: '#8B4513' },
      { x: 800, y: 200, width: 80, height: 20, color: '#8B4513' },
      { x: 950, y: 340, width: 150, height: 20, color: '#4CAF50', isGoal: true }
    ],
    puzzleElements: [
      { type: 'checkpoint', x: 380, y: 360, width: 20, height: 20, color: '#00BCD4', id: 'checkpoint1' },
      { type: 'spike', x: 460, y: 360, width: 120, height: 20, color: '#E91E63', id: 'spike1' },
      { type: 'checkpoint', x: 680, y: 360, width: 20, height: 20, color: '#00BCD4', id: 'checkpoint2' },
      { type: 'spike', x: 760, y: 360, width: 120, height: 20, color: '#E91E63', id: 'spike2' }
    ]
  }
];

// Generate remaining levels (11-67) with increasing complexity
for (let i = 11; i <= 67; i++) {
  const difficulty = i <= 20 ? 'easy' : i <= 40 ? 'medium' : i <= 60 ? 'hard' : 'expert';
  const complexity = Math.floor(i / 10) + 1;
  
  LEVELS.push({
    id: i,
    name: `Challenge ${i}`,
    description: `Level ${i} - ${difficulty} difficulty puzzle`,
    difficulty: difficulty as any,
    playerStart: { x: 50, y: 350 },
    platforms: generatePlatforms(i, complexity),
    puzzleElements: generatePuzzleElements(i, complexity),
    timeLimit: i > 40 ? 300 - (i - 40) * 5 : undefined // Time pressure for harder levels
  });
}

function generatePlatforms(levelId: number, complexity: number): Array<{
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isGoal?: boolean;
}> {
  const platforms: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    isGoal?: boolean;
  }> = [
    { x: 0, y: 380, width: 150, height: 20, color: '#8B4513' } // Starting platform
  ];
  
  const platformCount = 3 + complexity * 2;
  const levelWidth = 800 + complexity * 200;
  
  for (let i = 1; i < platformCount; i++) {
    const x = (i * levelWidth) / platformCount + Math.random() * 100 - 50;
    const y = 200 + Math.random() * 200;
    const width = 60 + Math.random() * 80;
    
    platforms.push({
      x: Math.max(0, x),
      y,
      width,
      height: 20,
      color: '#8B4513'
    });
  }
  
  // Goal platform
  platforms.push({
    x: levelWidth,
    y: 300 + Math.random() * 100,
    width: 150,
    height: 20,
    color: '#4CAF50',
    isGoal: true
  });
  
  return platforms;
}

function generatePuzzleElements(levelId: number, complexity: number) {
  const elements: PuzzleElement[] = [];
  const elementCount = complexity;
  
  for (let i = 0; i < elementCount; i++) {
    const x = 200 + i * 150 + Math.random() * 100;
    const y = 300 + Math.random() * 100;
    
    const elementTypes = ['switch', 'key', 'movingPlatform', 'spike', 'pressurePlate', 'door'];
    const type = elementTypes[Math.floor(Math.random() * elementTypes.length)] as any;
    
    const element: PuzzleElement = {
      type,
      x,
      y: type === 'spike' ? y + 20 : y - 20,
      width: type === 'key' ? 15 : type === 'door' ? 20 : type === 'movingPlatform' ? 80 : 30,
      height: type === 'key' ? 15 : type === 'door' ? 60 : type === 'movingPlatform' ? 15 : 20,
      color: getElementColor(type),
      id: `${type}${i}_${levelId}`,
      target: type === 'switch' || type === 'key' || type === 'pressurePlate' ? `door${i}_${levelId}` : undefined,
      isActive: type === 'door' ? false : undefined,
      movePattern: type === 'movingPlatform' ? {
        startX: x,
        endX: x + 100 + Math.random() * 100,
        startY: y,
        endY: y + (Math.random() - 0.5) * 80,
        speed: 1 + Math.random() * 2
      } : undefined
    };
    
    elements.push(element);
    
    // Add corresponding door for switches/keys/pressure plates
    if (type === 'switch' || type === 'key' || type === 'pressurePlate') {
      elements.push({
        type: 'door',
        x: x + 200 + Math.random() * 100,
        y: y + 20,
        width: 20,
        height: 60,
        color: '#8B4513',
        id: `door${i}_${levelId}`,
        isActive: false
      });
    }
  }
  
  return elements;
}

function getElementColor(type: string): string {
  switch (type) {
    case 'switch': return '#FF0000';
    case 'key': return '#FFD700';
    case 'door': return '#8B4513';
    case 'movingPlatform': return '#9C27B0';
    case 'pressurePlate': return '#795548';
    case 'spike': return '#E91E63';
    case 'checkpoint': return '#00BCD4';
    default: return '#666666';
  }
}