import { create } from 'zustand';
import { GameState, Player, Food } from '../types/game';

interface GameStore extends GameState {
    setPlayerId: (id: string) => void;
    updatePlayer: (player: Player) => void;
    removePlayer: (id: string) => void;
    addFood: (food: Food) => void;
    removeFood: (id: string) => void;
    reset: () => void;
}

const initialState: GameState = {
    players: new Map(),
    food: new Map(),
    playerId: null,
};

export const useGameStore = create<GameStore>((set) => ({
    ...initialState,
    setPlayerId: (id) => set({ playerId: id }),
    updatePlayer: (player) =>
        set((state) => ({
            players: new Map(state.players).set(player.id, player),
    })),
    removePlayer: (id) =>
        set((state) => {
            const players = new Map(state.players);
            players.delete(id);
            return { players };
    }),
    addFood: (food) =>
        set((state) => ({
            food: new Map(state.food).set(food.id, food),
    })),
    removeFood: (id) =>
        set((state) => {
            const food = new Map(state.food);
            food.delete(id);
            return { food };
    }),
    reset: () => set(initialState),
}));