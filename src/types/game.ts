export type Vector = {
    x: number;
    y: number;
}
  
export type Player = {
    id: string;
    x: number;
    y: number;
    radius: number;
    color: string;
    direction: Vector;
    isMoving: boolean;
}

export type Food = {
    id: string;
    x: number;
    y: number;
    color: string;
}

export type GameState = {
    players: Map<string, Player>;
    food: Map<string, Food>;
    playerId: string | null;
}