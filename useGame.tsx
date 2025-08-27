import { create } from "zustand";
import { subscribeWithSelector, persist } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended" | "levelSelect" | "levelComplete" | "characterSelect";

interface GameStats {
  deaths: number;
  totalPlayTime: number;
  checkpointsUsed: number;
  fastestLevelTime: number;
  levelsCompletedWithoutDeath: Set<number>;
  sessionStartTime: number;
}

interface GameState {
  phase: GamePhase;
  score: number;
  currentLevel: number;
  unlockedLevels: number;
  collectedKeys: Set<string>;
  activatedSwitches: Set<string>;
  activeCheckpoint: { x: number; y: number } | null;
  stats: GameStats;
  levelStartTime: number;
  levelDeaths: number;
  
  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
  addScore: (points: number) => void;
  nextLevel: () => void;
  selectLevel: (levelId: number) => void;
  goToLevelSelect: () => void;
  goToCharacterSelect: () => void;
  collectKey: (keyId: string) => void;
  activateSwitch: (switchId: string) => void;
  setCheckpoint: (x: number, y: number) => void;
  clearCheckpoint: () => void;
  resetLevel: () => void;
  recordDeath: () => void;
  updatePlayTime: () => void;
}

export const useGame = create<GameState>()(
  persist(
    subscribeWithSelector((set, get) => ({
      phase: "levelSelect",
      score: 0,
      currentLevel: 1,
      unlockedLevels: 1,
      collectedKeys: new Set(),
      activatedSwitches: new Set(),
      activeCheckpoint: null,
      stats: {
        deaths: 0,
        totalPlayTime: 0,
        checkpointsUsed: 0,
        fastestLevelTime: Infinity,
        levelsCompletedWithoutDeath: new Set(),
        sessionStartTime: Date.now()
      },
      levelStartTime: Date.now(),
      levelDeaths: 0,
    
    start: () => {
      console.log('Game starting...');
      set((state) => {
        if (state.phase === "ready") {
          return { 
            phase: "playing",
            levelStartTime: Date.now(),
            levelDeaths: 0
          };
        }
        return {};
      });
    },
    
    restart: () => {
      console.log('Game restarting...');
      set((state) => ({ 
        phase: "ready", 
        collectedKeys: new Set(),
        activatedSwitches: new Set(),
        activeCheckpoint: null
      }));
    },
    
    end: () => {
      console.log('Game ending...');
      set((state) => {
        if (state.phase === "playing") {
          get().recordDeath();
          return { phase: "ended" };
        }
        return {};
      });
    },

    addScore: (points: number) => {
      set((state) => ({ score: state.score + points }));
    },

    nextLevel: () => {
      set((state) => {
        const levelTime = (Date.now() - state.levelStartTime) / 1000;
        const completedWithoutDeath = state.levelDeaths === 0;
        const nextLevelId = state.currentLevel + 1;
        const newUnlockedLevels = Math.max(state.unlockedLevels, nextLevelId);
        
        // Update stats
        const newStats = { ...state.stats };
        if (levelTime < newStats.fastestLevelTime) {
          newStats.fastestLevelTime = levelTime;
        }
        if (completedWithoutDeath) {
          newStats.levelsCompletedWithoutDeath.add(state.currentLevel);
        }
        
        if (nextLevelId <= 67) {
          return {
            currentLevel: nextLevelId,
            unlockedLevels: newUnlockedLevels,
            phase: "ready",
            collectedKeys: new Set(),
            activatedSwitches: new Set(),
            activeCheckpoint: null,
            score: state.score + 100 + (completedWithoutDeath ? 50 : 0) + (levelTime < 10 ? 100 : 0),
            stats: newStats
          };
        } else {
          return { phase: "levelComplete", stats: newStats };
        }
      });
    },

    selectLevel: (levelId: number) => {
      set((state) => {
        if (levelId <= state.unlockedLevels) {
          return {
            currentLevel: levelId,
            phase: "ready",
            collectedKeys: new Set(),
            activatedSwitches: new Set(),
            activeCheckpoint: null
          };
        }
        return {};
      });
    },

    goToLevelSelect: () => {
      set(() => ({ phase: "levelSelect" }));
    },

    goToCharacterSelect: () => {
      set(() => ({ phase: "characterSelect" }));
    },

    collectKey: (keyId: string) => {
      set((state) => {
        const newKeys = new Set(state.collectedKeys);
        newKeys.add(keyId);
        return { collectedKeys: newKeys };
      });
    },

    activateSwitch: (switchId: string) => {
      set((state) => {
        const newSwitches = new Set(state.activatedSwitches);
        newSwitches.add(switchId);
        return { activatedSwitches: newSwitches };
      });
    },

    setCheckpoint: (x: number, y: number) => {
      set((state) => ({ 
        activeCheckpoint: { x, y },
        stats: { ...state.stats, checkpointsUsed: state.stats.checkpointsUsed + 1 }
      }));
    },

    clearCheckpoint: () => {
      set(() => ({ activeCheckpoint: null }));
    },

    resetLevel: () => {
      set(() => ({
        phase: "ready",
        collectedKeys: new Set(),
        activatedSwitches: new Set(),
        activeCheckpoint: null,
        levelStartTime: Date.now(),
        levelDeaths: 0
      }));
    },

    recordDeath: () => {
      set((state) => ({
        stats: { ...state.stats, deaths: state.stats.deaths + 1 },
        levelDeaths: state.levelDeaths + 1
      }));
    },

    updatePlayTime: () => {
      set((state) => {
        const now = Date.now();
        const sessionTime = (now - state.stats.sessionStartTime) / 1000;
        return {
          stats: {
            ...state.stats,
            totalPlayTime: state.stats.totalPlayTime + sessionTime,
            sessionStartTime: now
          }
        };
      });
    }
    })),
    {
      name: 'game-storage',
      partialize: (state) => ({
        score: state.score,
        currentLevel: state.currentLevel,
        unlockedLevels: state.unlockedLevels,
        stats: {
          ...state.stats,
          levelsCompletedWithoutDeath: Array.from(state.stats.levelsCompletedWithoutDeath)
        }
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        score: persistedState?.score || 0,
        currentLevel: persistedState?.currentLevel || 1,
        unlockedLevels: persistedState?.unlockedLevels || 1,
        stats: {
          ...currentState.stats,
          deaths: persistedState?.stats?.deaths || 0,
          totalPlayTime: persistedState?.stats?.totalPlayTime || 0,
          checkpointsUsed: persistedState?.stats?.checkpointsUsed || 0,
          fastestLevelTime: persistedState?.stats?.fastestLevelTime || Infinity,
          levelsCompletedWithoutDeath: new Set(persistedState?.stats?.levelsCompletedWithoutDeath || []),
          sessionStartTime: Date.now()
        }
      })
    }
  )
);
