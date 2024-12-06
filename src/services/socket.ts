import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';
import { Player, Food, Vector } from '../types/game';

class SocketService {
    private socket: Socket | null = null;

    connect() {
        this.socket = io('http://localhost:3000');

        this.socket.on('connect', () => {
            console.log('Connected to server');
        });

        this.socket.on('playerId', (id: string) => {
            useGameStore.getState().setPlayerId(id);
        });

        this.socket.on('gameState', ({ players, food }: { players: Player[]; food: Food[] }) => {
            const store = useGameStore.getState();
            players.forEach((player) => store.updatePlayer(player));
            food.forEach((f) => store.addFood(f));
        });

        this.socket.on('playerLeft', (id: string) => {
            useGameStore.getState().removePlayer(id);
        });

        this.socket.on('foodEaten', (id: string) => {
            useGameStore.getState().removeFood(id);
        });
    }

    updateDirection(direction: Vector, isMoving: boolean) {
        this.socket?.emit('updateDirection', { direction, isMoving });
    }

    disconnect() {
        this.socket?.disconnect();
        useGameStore.getState().reset();
    }
}

export const socketService = new SocketService();