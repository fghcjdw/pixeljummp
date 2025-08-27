export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CollisionResolution {
  x: number;
  y: number;
  side: 'top' | 'bottom' | 'left' | 'right';
}

export class CollisionDetector {
  isColliding(rect1: Rectangle, rect2: Rectangle): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  resolveCollision(moving: Rectangle, stationary: Rectangle): CollisionResolution {
    // Calculate overlap on each axis
    const overlapX = Math.min(
      moving.x + moving.width - stationary.x,
      stationary.x + stationary.width - moving.x
    );
    
    const overlapY = Math.min(
      moving.y + moving.height - stationary.y,
      stationary.y + stationary.height - moving.y
    );

    // Resolve on the axis with smaller overlap
    if (overlapX < overlapY) {
      // Horizontal collision
      if (moving.x < stationary.x) {
        // Collision from left
        return { x: -overlapX, y: 0, side: 'right' };
      } else {
        // Collision from right
        return { x: overlapX, y: 0, side: 'left' };
      }
    } else {
      // Vertical collision
      if (moving.y < stationary.y) {
        // Player is above platform (landing on top)
        return { x: 0, y: -overlapY, side: 'top' };
      } else {
        // Player is below platform (hitting from bottom)
        return { x: 0, y: overlapY, side: 'bottom' };
      }
    }
  }
}
