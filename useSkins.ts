import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CharacterSkin {
  id: string;
  name: string;
  description: string;
  color: string;
  secondaryColor?: string;
  texture?: string;
  unlockCondition: {
    type: 'level' | 'secret' | 'time' | 'deaths' | 'default';
    requirement?: number | string;
    description: string;
  };
  isUnlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface SkinsState {
  selectedSkin: string;
  unlockedSkins: Set<string>;
  skins: CharacterSkin[];
  selectSkin: (skinId: string) => void;
  unlockSkin: (skinId: string) => void;
  checkUnlockConditions: (stats: { completedLevels: number; totalTime: number; deaths: number }) => void;
  getSkinById: (skinId: string) => CharacterSkin | undefined;
}

const DEFAULT_SKINS: CharacterSkin[] = [
  {
    id: 'meat_boy',
    name: 'Meat Boy',
    description: 'The original red cube of meat',
    color: '#DC143C',
    secondaryColor: '#8B0000',
    texture: 'meat',
    unlockCondition: {
      type: 'default',
      description: 'Default character'
    },
    isUnlocked: true,
    rarity: 'common'
  },
  {
    id: 'bandage_girl',
    name: 'Bandage Girl',
    description: 'Wrapped in medical bandages',
    color: '#F5F5DC',
    secondaryColor: '#D2B48C',
    texture: 'bandage',
    unlockCondition: {
      type: 'level',
      requirement: 5,
      description: 'Complete 5 levels'
    },
    isUnlocked: false,
    rarity: 'common'
  },
  {
    id: 'dark_boy',
    name: 'Dark Boy',
    description: 'A shadowy version from the depths',
    color: '#2F2F2F',
    secondaryColor: '#1A1A1A',
    texture: 'shadow',
    unlockCondition: {
      type: 'level',
      requirement: 15,
      description: 'Complete 15 levels'
    },
    isUnlocked: false,
    rarity: 'rare'
  },
  {
    id: 'gold_boy',
    name: 'Golden Boy',
    description: 'Shimmering with golden glory',
    color: '#FFD700',
    secondaryColor: '#FFA500',
    texture: 'metal',
    unlockCondition: {
      type: 'level',
      requirement: 30,
      description: 'Complete 30 levels'
    },
    isUnlocked: false,
    rarity: 'epic'
  },
  {
    id: 'ninja_boy',
    name: 'Ninja Boy',
    description: 'Silent and deadly platformer',
    color: '#4B0082',
    secondaryColor: '#301934',
    texture: 'cloth',
    unlockCondition: {
      type: 'level',
      requirement: 50,
      description: 'Complete 50 levels'
    },
    isUnlocked: false,
    rarity: 'epic'
  },
  {
    id: 'crystal_boy',
    name: 'Crystal Boy',
    description: 'Crystalline and transparent',
    color: '#87CEEB',
    secondaryColor: '#4682B4',
    texture: 'crystal',
    unlockCondition: {
      type: 'time',
      requirement: 300, // 5 minutes total
      description: 'Play for 5 minutes total'
    },
    isUnlocked: false,
    rarity: 'rare'
  },
  {
    id: 'fire_boy',
    name: 'Fire Boy',
    description: 'Burning with determination',
    color: '#FF4500',
    secondaryColor: '#FF0000',
    texture: 'fire',
    unlockCondition: {
      type: 'deaths',
      requirement: 100,
      description: 'Die 100 times (dedication!)'
    },
    isUnlocked: false,
    rarity: 'rare'
  },
  {
    id: 'ice_boy',
    name: 'Ice Boy',
    description: 'Cool as ice, literally',
    color: '#B0E0E6',
    secondaryColor: '#87CEEB',
    texture: 'ice',
    unlockCondition: {
      type: 'secret',
      requirement: 'fast_completion',
      description: 'Complete a level in under 10 seconds'
    },
    isUnlocked: false,
    rarity: 'epic'
  },
  {
    id: 'rainbow_boy',
    name: 'Rainbow Boy',
    description: 'Prismatic perfection',
    color: '#FF69B4',
    secondaryColor: '#FF1493',
    texture: 'rainbow',
    unlockCondition: {
      type: 'level',
      requirement: 67,
      description: 'Complete all 67 levels'
    },
    isUnlocked: false,
    rarity: 'legendary'
  },
  {
    id: 'pixel_boy',
    name: 'Pixel Boy',
    description: 'Retro 8-bit style',
    color: '#32CD32',
    secondaryColor: '#228B22',
    texture: 'pixel',
    unlockCondition: {
      type: 'secret',
      requirement: 'no_death_level',
      description: 'Complete any level without dying'
    },
    isUnlocked: false,
    rarity: 'rare'
  },
  {
    id: 'ghost_boy',
    name: 'Ghost Boy',
    description: 'Ethereal and spooky',
    color: '#F8F8FF',
    secondaryColor: '#E6E6FA',
    texture: 'ghost',
    unlockCondition: {
      type: 'secret',
      requirement: 'checkpoint_master',
      description: 'Use 50 checkpoints'
    },
    isUnlocked: false,
    rarity: 'epic'
  },
  {
    id: 'void_boy',
    name: 'Void Boy',
    description: 'From the darkness between levels',
    color: '#000000',
    secondaryColor: '#1C1C1C',
    texture: 'void',
    unlockCondition: {
      type: 'secret',
      requirement: 'ultimate_master',
      description: 'Complete all levels + all achievements'
    },
    isUnlocked: false,
    rarity: 'legendary'
  }
];

export const useSkins = create<SkinsState>()(
  persist(
    (set, get) => ({
      selectedSkin: 'meat_boy',
      unlockedSkins: new Set(['meat_boy']),
      skins: DEFAULT_SKINS.map(skin => ({
        ...skin,
        isUnlocked: skin.id === 'meat_boy'
      })),

      selectSkin: (skinId: string) => {
        const { unlockedSkins } = get();
        if (unlockedSkins.has(skinId)) {
          set({ selectedSkin: skinId });
        }
      },

      unlockSkin: (skinId: string) => {
        set(state => {
          const newUnlocked = new Set(state.unlockedSkins);
          newUnlocked.add(skinId);
          
          const updatedSkins = state.skins.map(skin => 
            skin.id === skinId ? { ...skin, isUnlocked: true } : skin
          );

          return {
            unlockedSkins: newUnlocked,
            skins: updatedSkins
          };
        });
      },

      checkUnlockConditions: (stats: { completedLevels: number; totalTime: number; deaths: number }) => {
        const { skins, unlockedSkins, unlockSkin } = get();
        
        skins.forEach(skin => {
          if (!unlockedSkins.has(skin.id)) {
            let shouldUnlock = false;
            
            switch (skin.unlockCondition.type) {
              case 'level':
                shouldUnlock = stats.completedLevels >= (skin.unlockCondition.requirement as number);
                break;
              case 'time':
                shouldUnlock = stats.totalTime >= (skin.unlockCondition.requirement as number);
                break;
              case 'deaths':
                shouldUnlock = stats.deaths >= (skin.unlockCondition.requirement as number);
                break;
            }
            
            if (shouldUnlock) {
              unlockSkin(skin.id);
            }
          }
        });
      },

      getSkinById: (skinId: string) => {
        return get().skins.find(skin => skin.id === skinId);
      }
    }),
    {
      name: 'skins-storage',
      partialize: (state) => ({ 
        selectedSkin: state.selectedSkin,
        unlockedSkins: Array.from(state.unlockedSkins),
        skins: state.skins
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        selectedSkin: persistedState?.selectedSkin || 'meat_boy',
        unlockedSkins: new Set(persistedState?.unlockedSkins || ['meat_boy']),
        skins: DEFAULT_SKINS.map(skin => ({
          ...skin,
          isUnlocked: persistedState?.unlockedSkins?.includes(skin.id) || skin.id === 'meat_boy'
        }))
      })
    }
  )
);