import React from "react";
import { useGame } from "../lib/stores/useGame";
import { useSkins } from "../lib/stores/useSkins";
import { LEVELS } from "../lib/levels";

export function LevelSelect() {
  const { selectLevel, unlockedLevels, currentLevel, goToCharacterSelect, stats } = useGame();
  const { checkUnlockConditions } = useSkins();

  // Check for new skin unlocks
  React.useEffect(() => {
    checkUnlockConditions({
      completedLevels: unlockedLevels - 1,
      totalTime: stats.totalPlayTime,
      deaths: stats.deaths
    });
  }, [unlockedLevels, stats, checkUnlockConditions]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      case 'expert': return '#9C27B0';
      default: return '#666';
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '20px',
      overflowY: 'auto',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        marginBottom: '30px', 
        color: '#4CAF50',
        textAlign: 'center'
      }}>
        Level Select
      </h1>
      
      <p style={{ 
        fontSize: '1.2rem', 
        marginBottom: '40px', 
        textAlign: 'center',
        opacity: 0.8
      }}>
        Choose your level • {unlockedLevels} / 67 unlocked
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '40px'
      }}>
        {LEVELS.slice(0, Math.min(unlockedLevels, 67)).map((level) => (
          <div
            key={level.id}
            onClick={() => selectLevel(level.id)}
            style={{
              backgroundColor: currentLevel === level.id ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255,255,255,0.1)',
              border: currentLevel === level.id ? '2px solid #4CAF50' : '2px solid transparent',
              borderRadius: '10px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentLevel === level.id ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                margin: 0,
                color: currentLevel === level.id ? '#4CAF50' : '#fff'
              }}>
                Level {level.id}
              </h3>
              <span style={{
                backgroundColor: getDifficultyColor(level.difficulty),
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                {level.difficulty}
              </span>
            </div>
            
            <h4 style={{ 
              fontSize: '1.1rem', 
              margin: '0 0 10px 0',
              color: '#FFD700'
            }}>
              {level.name}
            </h4>
            
            <p style={{ 
              fontSize: '0.9rem', 
              margin: 0,
              opacity: 0.8,
              lineHeight: '1.4'
            }}>
              {level.description}
            </p>

            {level.timeLimit && (
              <p style={{ 
                fontSize: '0.8rem', 
                margin: '10px 0 0 0',
                color: '#FF9800',
                fontWeight: 'bold'
              }}>
                ⏱️ Time Limit: {level.timeLimit}s
              </p>
            )}
          </div>
        ))}

        {/* Locked levels preview */}
        {Array.from({ length: Math.max(0, 67 - unlockedLevels) }, (_, i) => (
          <div
            key={`locked-${unlockedLevels + i + 1}`}
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '20px',
              cursor: 'not-allowed',
              opacity: 0.5
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                margin: 0,
                color: '#666'
              }}>
                Level {unlockedLevels + i + 1}
              </h3>
              <span style={{
                backgroundColor: '#666',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}>
                🔒 LOCKED
              </span>
            </div>
            
            <p style={{ 
              fontSize: '0.9rem', 
              margin: 0,
              color: '#666'
            }}>
              Complete previous levels to unlock
            </p>
          </div>
        ))}
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <button
          onClick={goToCharacterSelect}
          style={{
            backgroundColor: '#9C27B0',
            color: '#fff',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '10px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '20px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#7B1FA2';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#9C27B0';
            e.currentTarget.style.transform = 'translateY(0px)';
          }}
        >
          🎨 Character Skins
        </button>
        
        <p style={{ 
          fontSize: '1rem', 
          margin: '10px 0',
          opacity: 0.8
        }}>
          Click on any unlocked level to play
        </p>
        <p style={{ 
          fontSize: '0.9rem', 
          margin: 0,
          opacity: 0.6
        }}>
          C - Character Skins • ESC - Return to Menu
        </p>
      </div>
    </div>
  );
}