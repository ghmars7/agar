import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { generateRandomColor, generateRandomPosition } from './utils.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

const WORLD_SIZE = 10000;
const FOOD_COUNT_MAX = 300; 
const INITIAL_PLAYER_RADIUS = 40;
const MOVEMENT_SPEED = 5;

const players = new Map();
const food = new Map();

function firstGenerationFood() {
    for (let i = 0; i < FOOD_COUNT_MAX; i++) {
    const foodId = crypto.randomUUID();
    const position = generateRandomPosition( WORLD_SIZE);
    food.set(foodId, {
        id: foodId,
        x: position.x,
        y: position.y,
        color: generateRandomColor(),
    });
    }
}

firstGenerationFood()

function addFood(num){
    for (let i = 0; i < num; i++) {
        const foodId = crypto.randomUUID();
        const position = generateRandomPosition( WORLD_SIZE);
        food.set(foodId, {
            id: foodId,
            x: position.x,
            y: position.y,
            color: generateRandomColor(),
        });
    }
}

function checkCollisionFood(player) {
    food.forEach((f, foodId) => {
        const dx = player.x - f.x;
        const dy = player.y - f.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + 5) {
            food.delete(foodId);
            player.radius += 2;
            io.emit('foodEaten', foodId);
        }
    });

}

function checkCollisionPlayer(player) {
    if(players.size > 1 ){
        players.forEach((p) => {
            const dx = player.x - p.x;
            const dy = player.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            console.log();
        
            if (distance < player.radius && p.radius < player.radius) {
                players.delete(p);
                player.radius += 40;
                io.emit('playerEaten', p.id);
            }
        });
    }
}

// Update game state
function updateGame() {
    if (food.size < FOOD_COUNT_MAX){
        addFood(100)
    }
    players.forEach((player) => {
        if (player.isMoving) {
            player.x += player.direction.x * MOVEMENT_SPEED;
            player.y += player.direction.y * MOVEMENT_SPEED;

            player.x = Math.max(0, Math.min( WORLD_SIZE, player.x));
            player.y = Math.max(0, Math.min( WORLD_SIZE, player.y));

            checkCollisionFood(player);
            //checkCollisionPlayer(player);
        }
    });

    io.emit('gameState', {
        players: Array.from(players.values()),
        food: Array.from(food.values()),
    });
}

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    // Create new player
    const position = generateRandomPosition( WORLD_SIZE);

    const player = {
        id: socket.id,
        x: position.x,
        y: position.y,
        radius: INITIAL_PLAYER_RADIUS,
        color: generateRandomColor(),
        direction: { x: 0, y: 0 },
        isMoving: false,
    };
    players.set(socket.id, player);

    socket.emit('playerId', socket.id);

    io.emit('gameState', {
        players: Array.from(players.values()),
        food: Array.from(food.values()),
    });

    socket.on('updateDirection', ({ direction, isMoving }) => {
        const player = players.get(socket.id);
        if (!player) return;

        player.direction = direction;
        player.isMoving = isMoving;
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        players.delete(socket.id);
        io.emit('playerLeft', socket.id);
    });
});


setInterval(updateGame, 20);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});