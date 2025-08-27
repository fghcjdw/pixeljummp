import { useSkins } from "../lib/stores/useSkins";
import { useGame } from "../lib/stores/useGame";

export function CharacterSelect() {
  const { skins, selectedSkin, unlockedSkins, selectSkin } = useSkins();
  const { goToLevelSelect } = useGame();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#4CAF50';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FF9800';
      default: return '#666';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'rare': return '0 0 10px rgba(33, 150, 243, 0.5)';
      case 'epic': return '0 0 15px rgba(156, 39, 176, 0.5)';
      case 'legendary': return '0 0 20px rgba(255, 152, 0, 0.7)';
      default: return 'none';
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#1a1a1a',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b2d 50%, #1a1a1a 100%)',
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
        fontSize: '3.5rem', 
        marginBottom: '10px', 
        color: '#DC143C',
        textShadow: '0 0 20px rgba(220, 20, 60, 0.5)',
        textAlign: 'center'
      }}>
        Choose Your Character
      </h1>
      
      <p style={{ 
        fontSize: '1.2rem', 
        marginBottom: '40px', 
        textAlign: 'center',
        opacity: 0.8,
        maxWidth: '600px'
      }}>
        Each character has unique visual style. Unlock new characters by completing levels and achieving milestones!
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '40px'
      }}>
        {skins.map((skin) => {
          const isSelected = selectedSkin === skin.id;
          const isUnlocked = unlockedSkins.has(skin.id);
          
          return (
            <div
              key={skin.id}
              onClick={() => isUnlocked && selectSkin(skin.id)}
              style={{
                backgroundColor: isSelected ? 'rgba(220, 20, 60, 0.2)' : 'rgba(255,255,255,0.1)',
                border: isSelected ? '3px solid #DC143C' : '2px solid rgba(255,255,255,0.2)',
                borderRadius: '15px',
                padding: '25px',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                position: 'relative',
                opacity: isUnlocked ? 1 : 0.5,
                boxShadow: isSelected ? '0 0 30px rgba(220, 20, 60, 0.4)' : getRarityGlow(skin.rarity)
              }}
              onMouseEnter={(e) => {
                if (isUnlocked) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isSelected ? 'rgba(220, 20, 60, 0.2)' : 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              {/* Character Preview */}
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: skin.color,
                border: `3px solid ${skin.secondaryColor || '#000'}`,
                borderRadius: '8px',
                margin: '0 auto 15px auto',
                position: 'relative',
                boxShadow: `inset 0 0 20px rgba(0,0,0,0.3), ${getRarityGlow(skin.rarity)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Add texture indicators */}
                {skin.texture === 'meat' && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(139,0,0,0.3) 2px, rgba(139,0,0,0.3) 4px)',
                    borderRadius: '5px'
                  }} />
                )}
                {skin.texture === 'crystal' && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.3) 75%)',
                    backgroundSize: '8px 8px',
                    borderRadius: '5px'
                  }} />
                )}
                {skin.texture === 'fire' && (
                  <div style={{
                    color: '#FFD700',
                    fontSize: '20px'
                  }}>
                    🔥
                  </div>
                )}
                {skin.texture === 'ice' && (
                  <div style={{
                    color: '#87CEEB',
                    fontSize: '20px'
                  }}>
                    ❄️
                  </div>
                )}
                {skin.texture === 'shadow' && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(47,47,47,1) 0%, rgba(26,26,26,1) 70%)',
                    borderRadius: '5px'
                  }} />
                )}
              </div>

              {/* Rarity indicator */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: getRarityColor(skin.rarity),
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                {skin.rarity}
              </div>

              {/* Lock indicator */}
              {!isUnlocked && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  color: '#FF6B6B',
                  fontSize: '1.5rem'
                }}>
                  🔒
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  color: '#4CAF50',
                  fontSize: '1.5rem'
                }}>
                  ✓
                </div>
              )}

              <h3 style={{ 
                fontSize: '1.3rem', 
                margin: '0 0 8px 0',
                color: isUnlocked ? '#fff' : '#888',
                textAlign: 'center'
              }}>
                {skin.name}
              </h3>
              
              <p style={{ 
                fontSize: '0.9rem', 
                margin: '0 0 15px 0',
                opacity: 0.8,
                lineHeight: '1.4',
                textAlign: 'center',
                color: isUnlocked ? '#fff' : '#666'
              }}>
                {skin.description}
              </p>

              <div style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '0.8rem',
                  margin: 0,
                  color: isUnlocked ? '#4CAF50' : '#FFD700',
                  fontWeight: 'bold'
                }}>
                  {isUnlocked ? '✓ UNLOCKED' : skin.unlockCondition.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '20px'
      }}>
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
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#45a049';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4CAF50';
            e.currentTarget.style.transform = 'translateY(0px)';
          }}
        >
          Continue to Level Select
        </button>
        <p style={{ 
          fontSize: '0.9rem', 
          margin: '15px 0 0 0',
          opacity: 0.6
        }}>
          ESC - Return to Main Menu
        </p>
      </div>
    </div>
  );
}