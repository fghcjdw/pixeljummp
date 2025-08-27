interface PhysicsObject {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

export class Physics {
  private gravity = 0.8;
  private maxFallSpeed = 15;

  applyGravity(object: PhysicsObject) {
    object.velocityY += this.gravity;
    
    // Cap fall speed
    if (object.velocityY > this.maxFallSpeed) {
      object.velocityY = this.maxFallSpeed;
    }
  }

  applyMovement(object: PhysicsObject, deltaTime: number) {
    // Normalize delta time to prevent frame rate dependent movement
    const normalizedDelta = Math.min(deltaTime / 16.67, 2); // 60fps base
    
    object.x += object.velocityX * normalizedDelta;
    object.y += object.velocityY * normalizedDelta;
  }
}
