import WebSocket from 'ws';
import { RoomData } from '../db/db';
import { connections } from '../http_server/index';

class GameController {
  startGame(ws: WebSocket, room: RoomData) {
    console.log(room);
    const ships = room.roomUsers[0].ships;
    room.roomUsers.forEach((user) => {
      const ws2 = connections[user.name];
      ws2.send(
        JSON.stringify({
          type: 'start_game',
          data: JSON.stringify({ ships: user.ships, id: user.index }),
          id: 0,
        }),
      );
      console.log(user.name, user.ships);
    });
  }

  // Handle player's attack request
  attack(ws: WebSocket, request: any) {
    // Logic for player's attack
  }

  // Handle random attack request
  randomAttack(ws: WebSocket, request: any) {
    // Logic for random attack
  }

  // Handle changing player's turn request
  changeTurn(ws: WebSocket, request: any) {
    // Logic for changing player's turn
  }

  // Handle finishing the game request
  finishGame(ws: WebSocket, request: any) {
    // Logic for finishing the game
  }
}

export default GameController;
