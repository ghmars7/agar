import { Vector } from '../types/game';

export function getQuadrantDirection(mouseX: number, mouseY: number, canvasSizeX: number, canvasSizeY: number): Vector {
    const halfWidth = canvasSizeX / 2;
    const halfHeight = canvasSizeY / 2;

    const isRight = mouseX >= halfWidth;
    const isBottom = mouseY >= halfHeight;

    let direction: Vector = { x: 0, y: 0 };

    if (isRight) {
        direction.x = 1; 
    } else {
        direction.x = -1; 
    }
    if (!isBottom) {
        direction.y = -1; 
    } else {
        direction.y = 1; 
    }
    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);

    return {
        x: direction.x / magnitude,
        y: direction.y / magnitude
    };
}