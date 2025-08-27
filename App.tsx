import { useEffect, useState } from "react";
import { useAudio } from "./lib/stores/useAudio";
import { Game2D } from "./components/Game2D";
import "@fontsource/inter";

function App() {
  const { setHitSound, setSuccessSound } = useAudio();
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Load audio assets
  useEffect(() => {
    const loadAudio = async () => {
      try {
        // Load hit sound
        const hitAudio = new Audio('/sounds/hit.mp3');
        hitAudio.preload = 'auto';
        await new Promise((resolve) => {
          hitAudio.oncanplaythrough = resolve;
        });
        setHitSound(hitAudio);

        // Load success sound
        const successAudio = new Audio('/sounds/success.mp3');
        successAudio.preload = 'auto';
        await new Promise((resolve) => {
          successAudio.oncanplaythrough = resolve;
        });
        setSuccessSound(successAudio);

        setAssetsLoaded(true);
        console.log('Audio assets loaded successfully');
      } catch (error) {
        console.error('Failed to load audio assets:', error);
        setAssetsLoaded(true); // Continue without audio
      }
    };

    loadAudio();
  }, [setHitSound, setSuccessSound]);

  if (!assetsLoaded) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#111',
        color: '#fff',
        fontFamily: 'Inter, sans-serif'
      }}>
        Loading game assets...
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      backgroundColor: '#87CEEB' // Sky blue background
    }}>
      <Game2D />
    </div>
  );
}

export default App;
