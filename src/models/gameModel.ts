import Ship from "./shipModel";

class Game {
    ships: Ship[];
    currentPlayerIndex: number;
  
    constructor(ships: Ship[], currentPlayerIndex: number) {
      this.ships = ships;
      this.currentPlayerIndex = currentPlayerIndex;
    }
  }
  
  export default Game;