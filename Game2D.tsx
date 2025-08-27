import { useEffect, useRef } from "react";
import { GameCanvas } from "./GameCanvas";
import { GameUI } from "./GameUI";
import { useGame } from "../lib/stores/useGame";
import { useAudio } from "../lib/stores/useAudio";

export function Game2D() {
  const { phase, start, restart, goToLevelSelect, resetLevel, goToCharacterSelect } = useGame();
  const { toggleMute, isMuted } = useAudio();
  const gameRef = useRef<HTMLDivElement>(null);

  // Handle keyboard controls for game state
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Enter':
        case 'Space':
          if (phase === 'ready') {
            start();
          } else if (phase === 'ended') {
            restart();
          }
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyR':
          if (phase === 'playing' || phase === 'ended') {
            resetLevel();
          }
          break;
        case 'Escape':
          if (phase === 'characterSelect') {
            goToLevelSelect();
          } else if (phase !== 'levelSelect' && phase !== 'levelComplete') {
            goToLevelSelect();
          }
          break;
        case 'KeyC':
          if (phase === 'levelSelect') {
            goToCharacterSelect();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, start, restart, resetLevel, goToLevelSelect, goToCharacterSelect, toggleMute]);

  // Focus the game container to ensure it receives keyboard events
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.focus();
    }
  }, []);

  return (
    <div 
      ref={gameRef}
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        outline: 'none'
      }}
      tabIndex={0}
    >
      <GameCanvas />
      <GameUI />
      
      {/* Audio indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        color: '#fff',
        fontSize: '12px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '4px 8px',
        borderRadius: '4px'
      }}>
        Audio: {isMuted ? 'OFF (M to toggle)' : 'ON (M to toggle)'}
      </div>
    </div>
  );
}
