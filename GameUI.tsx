import { useGame } from "../lib/stores/useGame";
import { LevelSelect } from "./LevelSelect";
import { CharacterSelect } from "./CharacterSelect";
import { LEVELS } from "../lib/levels";

export function GameUI() {
  const { phase, currentLevel, goToLevelSelect, goToCharacterSelect } = useGame();

  const currentLevelData = LEVELS.find(l => l.id === currentLevel);

  if (phase === 'levelSelect') {
    return <LevelSelect />;
  }

  if (phase === 'characterSelect') {
    return <CharacterSelect />;
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      {phase === 'ready' && currentLevelData && (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '30px',
          borderRadius: '15px',
          maxWidth: '500px',
          pointerEvents: 'auto'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#4CAF50' }}>
            Level {currentLevelData.id}: {currentLevelData.name}
          </h1>
          <div style={{
            backgroundColor: getDifficultyColor(currentLevelData.difficulty),
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            display: 'inline-block',
            marginBottom: '20px'
          }}>
            {currentLevelData.difficulty}
          </div>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px', opacity: 0.9 }}>
            {currentLevelData.description}
          </p>
          {currentLevelData.timeLimit && (
            <p style={{ fontSize: '1rem', marginBottom: '20px', color: '#FF9800' }}>
              ⏱️ Time Limit: {currentLevelData.timeLimit} seconds
            </p>
          )}
          <div style={{ fontSize: '1rem', marginBottom: '20px', opacity: 0.8 }}>
            <p style={{ margin: '5px 0' }}>🎮 WASD/Arrow Keys to move</p>
            <p style={{ margin: '5px 0' }}>🚀 SPACE to jump</p>
            <p style={{ margin: '5px 0' }}>🔄 R to restart level</p>
            <p style={{ margin: '5px 0' }}>🎯 Reach the green goal!</p>
          </div>
          <p style={{ fontSize: '1.5rem', color: '#FFD700', marginBottom: '10px' }}>
            Press ENTER or SPACE to start
          </p>
          <p style={{ fontSize: '1rem', color: '#888' }}>
            ESC - Return to Level Select
          </p>
        </div>
      )}

      {phase === 'ended' && (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '30px',
          borderRadius: '15px',
          maxWidth: '500px',
          pointerEvents: 'auto'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#F44336' }}>
            Game Over!
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            Don't give up! Every puzzle master started somewhere.
          </p>
          <div style={{ fontSize: '1rem', marginBottom: '20px', opacity: 0.8 }}>
            <p style={{ margin: '5px 0' }}>💡 Try a different approach</p>
            <p style={{ margin: '5px 0' }}>🎯 Look for switches and keys</p>
            <p style={{ margin: '5px 0' }}>⏰ Time your jumps carefully</p>
          </div>
          <p style={{ fontSize: '1.5rem', color: '#FFD700', marginBottom: '10px' }}>
            Press ENTER to restart
          </p>
          <p style={{ fontSize: '1rem', color: '#888' }}>
            ESC - Return to Level Select • R - Quick restart
          </p>
        </div>
      )}

      {phase === 'levelComplete' && (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '30px',
          borderRadius: '15px',
          maxWidth: '500px',
          pointerEvents: 'auto'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#FFD700' }}>
            🎉 Congratulations! 🎉
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4CAF50' }}>
            You've completed all 67 levels!
          </p>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            You're a true puzzle master! 🧩👑
          </p>
          <button
            onClick={goToLevelSelect}
            style={{
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {phase === 'playing' && currentLevelData && (
        <>
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '15px',
            borderRadius: '10px',
            fontSize: '14px',
            pointerEvents: 'auto'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#4CAF50' }}>
              Level {currentLevelData.id}: {currentLevelData.name}
            </div>
            <div style={{ opacity: 0.8 }}>
              Difficulty: <span style={{ color: getDifficultyColor(currentLevelData.difficulty) }}>
                {currentLevelData.difficulty}
              </span>
            </div>
            {currentLevelData.timeLimit && (
              <div style={{ color: '#FF9800', marginTop: '5px' }}>
                ⏱️ Time Limit: {currentLevelData.timeLimit}s
              </div>
            )}
          </div>
          
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px 15px',
            borderRadius: '8px',
            fontSize: '12px',
            pointerEvents: 'auto'
          }}>
            <div>🎮 WASD/Arrows + Space</div>
            <div>🔄 R - Restart • ESC - Menu</div>
          </div>
        </>
      )}
    </div>
  );

  function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      case 'expert': return '#9C27B0';
      default: return '#666';
    }
  }
}
