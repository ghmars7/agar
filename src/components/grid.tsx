import { Vector } from '../types/game';

export const GRID_SIZE = 100; 
export const GRID_COLOR = 'rgba(255, 255, 255, 0.1)';
export const BORDER_COLOR = '#FF0000';
export const BORDER_WIDTH = 5;

export function drawGrid(
    ctx: CanvasRenderingContext2D,
    worldSize: number,
    viewportOffset: Vector
) {
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;

    for (let x = 0; x <= worldSize; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x + viewportOffset.x, viewportOffset.y);
        ctx.lineTo(x + viewportOffset.x, worldSize + viewportOffset.y);
        ctx.stroke();
    }

    for (let y = 0; y <= worldSize; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(viewportOffset.x, y + viewportOffset.y);
        ctx.lineTo(worldSize + viewportOffset.x, y + viewportOffset.y);
        ctx.stroke();
    }

    ctx.strokeStyle = BORDER_COLOR;
    ctx.lineWidth = BORDER_WIDTH;
    ctx.strokeRect(
        viewportOffset.x,
        viewportOffset.y,
        worldSize,
        worldSize
    );
}