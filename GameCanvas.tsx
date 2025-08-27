import { useEffect, useRef, useCallback } from "react";
import { GameEngine } from "../lib/gameEngine";
import { useGame } from "../lib/stores/useGame";
import { useAudio } from "../lib/stores/useAudio";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number>();
  const { phase, end, currentLevel, collectKey, activateSwitch, setCheckpoint, collectedKeys, activatedSwitches, activeCheckpoint, nextLevel } = useGame();
  const { playHit, playSuccess } = useAudio();

  // Initialize game engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize game engine
    gameEngineRef.current = new GameEngine(canvas, ctx, {
      onGameOver: () => {
        console.log('Game over triggered');
        end();
      },
      onJump: () => {
        console.log('Jump sound triggered');
        playHit();
      },
      onGoalReached: () => {
        console.log('Goal reached, success sound triggered');
        playSuccess();
        nextLevel();
      },
      onKeyCollected: (keyId: string) => {
        console.log(`Key collected: ${keyId}`);
        collectKey(keyId);
      },
      onSwitchActivated: (switchId: string) => {
        console.log(`Switch activated: ${switchId}`);
        activateSwitch(switchId);
      },
      onCheckpointReached: (x: number, y: number) => {
        console.log(`Checkpoint reached: (${x}, ${y})`);
        setCheckpoint(x, y);
      }
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, playHit, playSuccess, nextLevel, collectKey, activateSwitch, setCheckpoint]);

  // Load current level when it changes
  useEffect(() => {
    if (gameEngineRef.current && currentLevel) {
      gameEngineRef.current.loadLevel(currentLevel, {
        collectedKeys,
        activatedSwitches,
        activeCheckpoint
      });
    }
  }, [currentLevel, collectedKeys, activatedSwitches, activeCheckpoint]);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!gameEngineRef.current) return;

    if (phase === 'playing') {
      gameEngineRef.current.update(timestamp);
      gameEngineRef.current.render();
    } else if (phase === 'ready') {
      gameEngineRef.current.renderStartScreen();
    } else if (phase === 'ended') {
      gameEngineRef.current.renderGameOverScreen();
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [phase]);

  // Start/stop game loop based on phase
  useEffect(() => {
    if (phase === 'playing' || phase === 'ready' || phase === 'ended') {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, gameLoop]);

  // Reset game when restarting
  useEffect(() => {
    if (phase === 'ready' && gameEngineRef.current) {
      gameEngineRef.current.reset();
    }
  }, [phase]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        touchAction: 'none'
      }}
    />
  );
}
