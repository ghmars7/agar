import React, { useEffect, useRef, useState } from 'react';

// socket
import { useGameStore } from '../store/gameStore';
import { socketService } from '../services/socket';

// map
import { drawGrid } from './grid';

// movement
import { getQuadrantDirection } from '../utils/movement';

// const
const WORLD_SIZE = 10000;

const GameCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { players, food, playerId } = useGameStore();
    const [CANVAS_SIZE_X, SET_CANVAS_SIZE_X] = useState(0);
    const [CANVAS_SIZE_Y, SET_CANVAS_SIZE_Y] = useState(0);


    useEffect(() => {
        socketService.connect();
        return () => socketService.disconnect();
    }, []);


    useEffect(() => {
        SET_CANVAS_SIZE_X(window.innerWidth - 5);
        SET_CANVAS_SIZE_Y(window.innerHeight - 5);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const currentPlayer = playerId ? players.get(playerId) : null;
        if (!currentPlayer) return;

        ctx.clearRect(0, 0, CANVAS_SIZE_X, CANVAS_SIZE_Y);

        const offsetX = CANVAS_SIZE_X / 2 - currentPlayer.x;
        const offsetY = CANVAS_SIZE_Y / 2 - currentPlayer.y;

        // grid
        drawGrid(ctx, WORLD_SIZE, { x: offsetX, y: offsetY });



        food.forEach((f) => {
            ctx.beginPath();
            ctx.fillStyle = f.color;
            ctx.arc(f.x + offsetX, f.y + offsetY, 5, 0, Math.PI * 2);
            ctx.fill();
        });

        players.forEach((p) => {
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.arc(p.x + offsetX, p.y + offsetY, p.radius, 0, Math.PI * 2);
            ctx.fill();

            if (p.isMoving) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + offsetX, p.y + offsetY);
            ctx.stroke();
            }
        });
    }, [players, food, playerId]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !playerId) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const direction = getQuadrantDirection(mouseX, mouseY, CANVAS_SIZE_X, CANVAS_SIZE_Y);
        socketService.updateDirection(direction, true);
    };

    const handleMouseLeave = () => {
        if (!playerId) return;
        socketService.updateDirection({ x: 0, y: 0 }, false);
    };

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_SIZE_X}
            height={CANVAS_SIZE_Y}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="border "
        />
    );
}

export default GameCanvas