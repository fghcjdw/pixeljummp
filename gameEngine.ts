import { Physics } from "./physics";
import { CollisionDetector, Rectangle } from "./collision";
import { LEVELS, GameLevel, PuzzleElement } from "./levels";
import { useSkins } from "./stores/useSkins";

interface GameCallbacks {
  onGameOver: () => void;
  onJump: () => void;
  onGoalReached: () => void;
  onKeyCollected: (keyId: string) => void;
  onSwitchActivated: (switchId: string) => void;
  onCheckpointReached: (x: number, y: number) => void;
}

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  isGrounded: boolean;
  color: string;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isGoal?: boolean;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private callbacks: GameCallbacks;
  private physics: Physics;
  private collision: CollisionDetector;
  
  private player: Player;
  private currentLevel: GameLevel | null = null;
  private platforms: Platform[];
  private puzzleElements: PuzzleElement[];
  private camera: { x: number; y: number };
  private keys: Set<string> = new Set();
  
  private lastTime = 0;
  private goalReached = false;
  private collectedKeys = new Set<string>();
  private activatedSwitches = new Set<string>();
  private checkpointPosition: { x: number; y: number } | null = null;
  private particles: Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}> = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.callbacks = callbacks;
    this.physics = new Physics();
    this.collision = new CollisionDetector();
    
    // Initialize player
    this.player = {
      x: 100,
      y: 300,
      width: 32,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      isGrounded: false,
      color: '#FF6B6B'
    };

    this.platforms = [];
    this.puzzleElements = [];
    this.camera = { x: 0, y: 0 };

    this.setupEventListeners();
  }

  loadLevel(levelId: number, gameState: { collectedKeys: Set<string>; activatedSwitches: Set<string>; activeCheckpoint: { x: number; y: number } | null }) {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) {
      console.error(`Level ${levelId} not found`);
      return;
    }

    this.currentLevel = level;
    this.platforms = [...level.platforms];
    this.puzzleElements = [...level.puzzleElements];
    
    // Restore game state
    this.collectedKeys = new Set(gameState.collectedKeys);
    this.activatedSwitches = new Set(gameState.activatedSwitches);
    this.checkpointPosition = gameState.activeCheckpoint;

    // Set player start position
    if (this.checkpointPosition) {
      this.player.x = this.checkpointPosition.x;
      this.player.y = this.checkpointPosition.y;
    } else {
      this.player.x = level.playerStart.x;
      this.player.y = level.playerStart.y;
    }
    
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    this.player.isGrounded = false;
    this.goalReached = false;
    this.camera.x = 0;
    this.camera.y = 0;

    console.log(`Loaded level ${levelId}: ${level.name}`);
  }

  private setupEventListeners() {
    const handleKeyDown = (e: KeyboardEvent) => {
      this.keys.add(e.code);
      
      // Handle jump
      if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && this.player.isGrounded) {
        this.player.velocityY = -12; // Jump strength
        this.player.isGrounded = false;
        this.callbacks.onJump();
        console.log('Player jumped');
        
        // Add jump particles
        this.addJumpParticles();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      this.keys.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  }

  update(timestamp: number) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    // Handle input
    this.handleInput();
    
    // Update moving platforms
    this.updateMovingPlatforms(timestamp);
    
    // Apply physics
    this.physics.applyGravity(this.player);
    this.physics.applyMovement(this.player, deltaTime);
    
    // Handle collisions
    this.handleCollisions();
    
    // Handle puzzle interactions
    this.handlePuzzleInteractions();
    
    // Update particles
    this.updateParticles(deltaTime);
    
    // Update camera
    this.updateCamera();
    
    // Check for game over (fell off screen)
    if (this.player.y > this.canvas.height + 200) {
      console.log('Player fell off screen, triggering game over');
      this.callbacks.onGameOver();
    }
    
    // Check for goal
    if (!this.goalReached) {
      const goalPlatform = this.platforms.find(p => p.isGoal);
      if (goalPlatform && this.collision.isColliding(this.player, goalPlatform)) {
        this.goalReached = true;
        console.log('Goal reached!');
        this.callbacks.onGoalReached();
      }
    }
  }

  private updateMovingPlatforms(timestamp: number) {
    for (const element of this.puzzleElements) {
      if (element.type === 'movingPlatform' && element.movePattern) {
        const pattern = element.movePattern;
        const time = timestamp * 0.001; // Convert to seconds
        
        // Calculate position using sine wave for smooth movement
        const progress = (Math.sin(time * pattern.speed) + 1) / 2; // 0 to 1
        
        element.x = pattern.startX + (pattern.endX - pattern.startX) * progress;
        element.y = pattern.startY + (pattern.endY - pattern.startY) * progress;
      }
    }
  }

  private handlePuzzleInteractions() {
    for (const element of this.puzzleElements) {
      if (this.collision.isColliding(this.player, element)) {
        switch (element.type) {
          case 'key':
            if (!this.collectedKeys.has(element.id)) {
              this.collectedKeys.add(element.id);
              this.callbacks.onKeyCollected(element.id);
              console.log(`Collected key: ${element.id}`);
              
              // Remove key from puzzle elements
              const index = this.puzzleElements.indexOf(element);
              if (index > -1) {
                this.puzzleElements.splice(index, 1);
              }
            }
            break;
            
          case 'switch':
          case 'pressurePlate':
            if (!this.activatedSwitches.has(element.id)) {
              this.activatedSwitches.add(element.id);
              this.callbacks.onSwitchActivated(element.id);
              element.isActive = true;
              console.log(`Activated ${element.type}: ${element.id}`);
            }
            break;
            
          case 'checkpoint':
            if (this.checkpointPosition?.x !== element.x || this.checkpointPosition?.y !== element.y) {
              this.checkpointPosition = { x: element.x, y: element.y };
              this.callbacks.onCheckpointReached(element.x, element.y);
              console.log(`Checkpoint reached: (${element.x}, ${element.y})`);
            }
            break;
            
          case 'spike':
            console.log('Player hit spike, triggering game over');
            this.callbacks.onGameOver();
            break;
        }
      }
      
      // Check if doors should be open based on keys and switches
      if (element.type === 'door' && element.target) {
        const shouldBeOpen = this.collectedKeys.has(element.target) || this.activatedSwitches.has(element.target);
        element.isActive = shouldBeOpen;
      }
    }
  }

  private handleInput() {
    const moveSpeed = 5;
    
    // Horizontal movement
    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) {
      this.player.velocityX = -moveSpeed;
      console.log('Moving left');
    } else if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) {
      this.player.velocityX = moveSpeed;
      console.log('Moving right');
    } else {
      this.player.velocityX *= 0.8; // Friction
    }
  }

  private handleCollisions() {
    this.player.isGrounded = false;
    
    // Check collisions with all platforms
    for (const platform of this.platforms) {
      if (this.collision.isColliding(this.player, platform)) {
        const resolution = this.collision.resolveCollision(this.player, platform);
        
        if (resolution.side === 'top') {
          if (!this.player.isGrounded && this.player.velocityY > 0) {
            this.addLandingParticles(); // Add particles when landing on platform
          }
          this.player.isGrounded = true;
          this.player.velocityY = 0;
        } else if (resolution.side === 'bottom') {
          this.player.velocityY = 0;
        } else if (resolution.side === 'left' || resolution.side === 'right') {
          this.player.velocityX = 0;
        }
        
        this.player.x += resolution.x;
        this.player.y += resolution.y;
      }
    }
    
    // Check collisions with moving platforms
    for (const element of this.puzzleElements) {
      if (element.type === 'movingPlatform') {
        if (this.collision.isColliding(this.player, element)) {
          const resolution = this.collision.resolveCollision(this.player, element);
          
          if (resolution.side === 'top') {
            if (!this.player.isGrounded && this.player.velocityY > 0) {
              this.addLandingParticles(); // Add particles when landing on moving platform
            }
            this.player.isGrounded = true;
            this.player.velocityY = 0;
            
            // Move player with platform
            if (element.movePattern) {
              const deltaX = element.x - (element.movePattern.startX + (element.movePattern.endX - element.movePattern.startX) * 0.5);
              this.player.x += deltaX * 0.1; // Follow platform movement
            }
          } else if (resolution.side === 'bottom') {
            this.player.velocityY = 0;
          } else if (resolution.side === 'left' || resolution.side === 'right') {
            this.player.velocityX = 0;
          }
          
          this.player.x += resolution.x;
          this.player.y += resolution.y;
        }
      }
      
      // Check collisions with doors (solid when closed)
      if (element.type === 'door' && !element.isActive) {
        if (this.collision.isColliding(this.player, element)) {
          const resolution = this.collision.resolveCollision(this.player, element);
          
          if (resolution.side === 'top') {
            if (!this.player.isGrounded && this.player.velocityY > 0) {
              this.addLandingParticles(); // Add particles when landing
            }
            this.player.isGrounded = true;
            this.player.velocityY = 0;
          } else if (resolution.side === 'bottom') {
            this.player.velocityY = 0;
          } else if (resolution.side === 'left' || resolution.side === 'right') {
            this.player.velocityX = 0;
          }
          
          this.player.x += resolution.x;
          this.player.y += resolution.y;
        }
      }
    }
  }

  private updateCamera() {
    // Camera follows player with some offset
    const targetX = this.player.x - this.canvas.width / 2;
    const targetY = this.player.y - this.canvas.height / 2;
    
    this.camera.x += (targetX - this.camera.x) * 0.1;
    this.camera.y += (targetY - this.camera.y) * 0.1;
  }

  render() {
    // Clear canvas with dark, gritty background
    this.renderBackground();

    // Save context for camera transform
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // Render platforms with Super Meat Boy style
    this.renderPlatforms();

    // Render puzzle elements
    for (const element of this.puzzleElements) {
      this.ctx.fillStyle = element.color;
      
      switch (element.type) {
        case 'key':
          // Draw key with glow effect
          this.ctx.save();
          this.ctx.shadowColor = element.color;
          this.ctx.shadowBlur = 15;
          this.ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
          this.ctx.rotate(Math.PI / 4);
          this.ctx.fillRect(-element.width / 2, -element.height / 2, element.width, element.height);
          this.ctx.restore();
          
          // Add key icon
          this.ctx.fillStyle = '#000';
          this.ctx.font = '12px Inter';
          this.ctx.textAlign = 'center';
          this.ctx.fillText('🗝️', element.x + element.width / 2, element.y + element.height / 2 + 4);
          break;
          
        case 'switch':
        case 'pressurePlate':
          // Add glow effect
          this.ctx.shadowColor = element.color;
          this.ctx.shadowBlur = element.isActive ? 15 : 8;
          this.ctx.fillRect(element.x, element.y, element.width, element.height);
          this.ctx.shadowBlur = 0;
          
          if (element.isActive) {
            this.ctx.fillStyle = '#00FF00';
            this.ctx.fillRect(element.x + 5, element.y + 5, element.width - 10, element.height - 10);
          }
          
          // Add icon
          this.ctx.fillStyle = element.isActive ? '#000' : '#fff';
          this.ctx.font = '12px Inter';
          this.ctx.textAlign = 'center';
          const icon = element.type === 'switch' ? '⚡' : '⬇️';
          this.ctx.fillText(icon, element.x + element.width / 2, element.y + element.height / 2 + 4);
          break;
          
        case 'door':
          if (!element.isActive) {
            this.ctx.fillRect(element.x, element.y, element.width, element.height);
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(element.x, element.y, element.width, element.height);
            
            // Add door icon
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '16px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🚪', element.x + element.width / 2, element.y + element.height / 2 + 6);
          }
          break;
          
        case 'movingPlatform':
          this.ctx.fillRect(element.x, element.y, element.width, element.height);
          this.ctx.strokeStyle = '#000';
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(element.x, element.y, element.width, element.height);
          break;
          
        case 'spike':
          // Draw spikes as triangles with danger glow
          this.ctx.shadowColor = '#FF0000';
          this.ctx.shadowBlur = 8;
          this.ctx.beginPath();
          for (let i = 0; i < element.width; i += 10) {
            this.ctx.moveTo(element.x + i, element.y + element.height);
            this.ctx.lineTo(element.x + i + 5, element.y);
            this.ctx.lineTo(element.x + i + 10, element.y + element.height);
          }
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.shadowBlur = 0;
          
          // Add danger indicator
          this.ctx.fillStyle = '#FFFF00';
          this.ctx.font = '10px Inter';
          this.ctx.textAlign = 'center';
          this.ctx.fillText('⚠️', element.x + element.width / 2, element.y - 5);
          break;
          
        case 'checkpoint':
          // Add glow effect for checkpoints
          this.ctx.shadowColor = element.color;
          this.ctx.shadowBlur = 12;
          this.ctx.fillRect(element.x, element.y, element.width, element.height);
          this.ctx.shadowBlur = 0;
          
          this.ctx.fillStyle = '#FFFFFF';
          this.ctx.font = 'bold 14px Inter';
          this.ctx.textAlign = 'center';
          this.ctx.fillText('💾', element.x + element.width / 2, element.y + element.height / 2 + 4);
          break;
      }
    }

    // Render player with skin support
    this.renderPlayer();
    
    // Render particles
    this.renderParticles();

    // Restore context
    this.ctx.restore();

    // Render game HUD (not affected by camera)
    this.renderGameHUD();
  }

  private renderBackground() {
    // Create a dark, Super Meat Boy inspired background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#1a1a1a'); // Dark top
    gradient.addColorStop(0.3, '#2d1b2d'); // Purple middle
    gradient.addColorStop(0.7, '#1a1a1a'); // Dark again
    gradient.addColorStop(1, '#0d0d0d'); // Very dark bottom
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Add some atmospheric particles/dust
    this.renderAtmosphericEffects();
  }

  private renderAtmosphericEffects() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.1;
    
    // Add some floating dust particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const x = (this.camera.x + i * 100) % this.canvas.width;
      const y = (this.camera.y + i * 80) % this.canvas.height;
      
      this.ctx.fillStyle = '#666';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 1, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  private renderPlayer() {
    const selectedSkin = useSkins.getState().getSkinById(useSkins.getState().selectedSkin);
    
    if (!selectedSkin) {
      // Fallback to default rendering
      this.ctx.fillStyle = this.player.color;
      this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);
      return;
    }

    // Render character based on skin
    this.ctx.save();
    
    // Base character shape
    this.ctx.fillStyle = selectedSkin.color;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Add texture based on skin type
    this.renderSkinTexture(selectedSkin, this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Character border with secondary color
    this.ctx.strokeStyle = selectedSkin.secondaryColor || '#000';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Add glow effect for special skins
    if (selectedSkin.rarity === 'epic' || selectedSkin.rarity === 'legendary') {
      this.ctx.shadowColor = selectedSkin.color;
      this.ctx.shadowBlur = 10;
      this.ctx.strokeRect(this.player.x - 2, this.player.y - 2, this.player.width + 4, this.player.height + 4);
    }
    
    this.ctx.restore();
  }

  private renderSkinTexture(skin: any, x: number, y: number, width: number, height: number) {
    this.ctx.save();
    
    switch (skin.texture) {
      case 'meat':
        // Meat texture - add some meat-like striations
        this.ctx.strokeStyle = skin.secondaryColor || '#8B0000';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(x + 5 + i * 8, y);
          this.ctx.lineTo(x + 8 + i * 8, y + height);
          this.ctx.stroke();
        }
        break;
        
      case 'crystal':
        // Crystal texture - add crystalline facets
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.moveTo(x + width * 0.2, y);
        this.ctx.lineTo(x + width * 0.8, y + height * 0.3);
        this.ctx.lineTo(x + width * 0.4, y + height);
        this.ctx.lineTo(x, y + height * 0.7);
        this.ctx.closePath();
        this.ctx.fill();
        break;
        
      case 'fire':
        // Fire texture - add flame-like effects
        this.ctx.fillStyle = '#FF4500';
        this.ctx.globalAlpha = 0.7;
        for (let i = 0; i < 3; i++) {
          this.ctx.beginPath();
          this.ctx.arc(x + width * (0.2 + i * 0.3), y + height * 0.8, 4, 0, Math.PI * 2);
          this.ctx.fill();
        }
        break;
        
      case 'shadow':
        // Shadow texture - add dark overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
        break;
        
      case 'ice':
        // Ice texture - add icy gleam
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.fillRect(x + width * 0.1, y + height * 0.1, width * 0.3, 2);
        this.ctx.fillRect(x + width * 0.6, y + height * 0.6, width * 0.3, 2);
        break;
        
      case 'metal':
        // Metal texture - add metallic shine
        const gradient = this.ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, width, height);
        break;
        
      case 'ghost':
        // Ghost texture - semi-transparent with wispy edges
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillStyle = 'rgba(248, 248, 255, 0.3)';
        this.ctx.fillRect(x, y, width, height);
        break;
        
      case 'void':
        // Void texture - very dark with subtle energy
        this.ctx.fillStyle = 'rgba(28, 28, 28, 0.8)';
        this.ctx.fillRect(x + 4, y + 4, width - 8, height - 8);
        break;
    }
    
    this.ctx.restore();
  }

  private renderPlatforms() {
    for (const platform of this.platforms) {
      this.ctx.save();
      
      // Make platforms look more industrial/grimy
      if (platform.isGoal) {
        // Goal platform - bright and attractive
        const gradient = this.ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, '#FF8C00');
        this.ctx.fillStyle = gradient;
        
        // Add glow effect
        this.ctx.shadowColor = '#FFD700';
        this.ctx.shadowBlur = 15;
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        this.ctx.shadowBlur = 0;
        
        // Goal text with better visibility
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 18px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🎯 GOAL', platform.x + platform.width / 2, platform.y - 15);
        
        // Add pulsing effect
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        this.ctx.fillRect(platform.x - 5, platform.y - 5, platform.width + 10, platform.height + 10);
      } else {
        // Regular platforms - dark and industrial
        const gradient = this.ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
        gradient.addColorStop(0, '#4a4a4a');
        gradient.addColorStop(0.5, '#2d2d2d');
        gradient.addColorStop(1, '#1a1a1a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Add some texture/wear marks
        this.ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        this.ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, 2);
        
        // Add some rust/stains
        this.ctx.fillStyle = 'rgba(139, 69, 19, 0.2)';
        for (let i = 0; i < platform.width; i += 20) {
          this.ctx.fillRect(platform.x + i, platform.y + platform.height - 4, 8, 4);
        }
      }
      
      // Dark border
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
      
      this.ctx.restore();
    }
  }

  private addJumpParticles() {
    // Add some dust particles when jumping
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: this.player.x + this.player.width / 2 + (Math.random() - 0.5) * this.player.width,
        y: this.player.y + this.player.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2 + 1,
        life: 30,
        color: '#8B4513'
      });
    }
  }

  private addLandingParticles() {
    // Add particles when landing
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: this.player.x + this.player.width / 2 + (Math.random() - 0.5) * this.player.width,
        y: this.player.y + this.player.height,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 3,
        life: 20,
        color: '#666'
      });
    }
  }

  private updateParticles(deltaTime: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.2; // gravity
      particle.life--;
      
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private renderParticles() {
    this.ctx.save();
    
    for (const particle of this.particles) {
      this.ctx.globalAlpha = particle.life / 30;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  private renderGameHUD() {
    // Save the context state
    this.ctx.save();
    
    // Reset any transforms for UI rendering
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Collected items display (top-left)
    if (this.collectedKeys.size > 0 || this.activatedSwitches.size > 0) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
      this.ctx.fillRect(10, 10, 200, 60);
      
      this.ctx.fillStyle = '#FFD700';
      this.ctx.font = 'bold 14px Inter';
      this.ctx.textAlign = 'left';
      this.ctx.fillText('🗝️ Keys: ' + this.collectedKeys.size, 20, 30);
      this.ctx.fillText('🔴 Switches: ' + this.activatedSwitches.size, 20, 50);
    }

    // Goal indicator (top-center)
    const goalPlatform = this.platforms.find(p => p.isGoal);
    if (goalPlatform && !this.goalReached) {
      const canvasCenter = this.canvas.width / 2;
      this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
      this.ctx.fillRect(canvasCenter - 80, 10, 160, 40);
      
      this.ctx.fillStyle = '#4CAF50';
      this.ctx.font = 'bold 16px Inter';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🎯 Reach the Goal!', canvasCenter, 35);
    }

    // Lives/health indicator (top-right) - could be added later
    
    this.ctx.restore();
  }

  renderStartScreen() {
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render platforms preview
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    for (const platform of this.platforms) {
      this.ctx.fillStyle = platform.color;
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
    this.ctx.restore();
  }

  renderGameOverScreen() {
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  reset() {
    if (this.currentLevel) {
      if (this.checkpointPosition) {
        this.player.x = this.checkpointPosition.x;
        this.player.y = this.checkpointPosition.y;
      } else {
        this.player.x = this.currentLevel.playerStart.x;
        this.player.y = this.currentLevel.playerStart.y;
      }
    } else {
      this.player.x = 100;
      this.player.y = 300;
    }
    
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    this.player.isGrounded = false;
    this.camera.x = 0;
    this.camera.y = 0;
    this.goalReached = false;
    this.keys.clear();
    
    // Reset collected items and activated switches
    this.collectedKeys.clear();
    this.activatedSwitches.clear();
    
    // Reset puzzle elements
    if (this.currentLevel) {
      this.puzzleElements = [...this.currentLevel.puzzleElements];
    }
    
    console.log('Game reset');
  }

  getCurrentLevel() {
    return this.currentLevel;
  }

  getCollectedKeys() {
    return this.collectedKeys;
  }

  getActivatedSwitches() {
    return this.activatedSwitches;
  }
}
