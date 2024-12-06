export function generateRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
    return colors[Math.floor(Math.random() * colors.length)];
}
  
export function generateRandomPosition(worldSize) {
    return {
        x: Math.random() * worldSize,
        y: Math.random() * worldSize,
    };
}