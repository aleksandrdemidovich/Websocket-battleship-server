import WebSocket from 'ws';
import { addShipsToUser } from '../db/db';
import GameController from './gameController';

const gameController = new GameController();
class ShipController {
  addShips(ws: WebSocket, request: any) {
    const { gameId, ships, indexPlayer } = JSON.parse(request.data);
    const room = addShipsToUser(indexPlayer, gameId, ships);

    const result = this.checkShips(room?.roomUsers);
    if (result) {
      gameController.startGame(ws, room!);
    }
  }
  checkShips(roomUsers: any) {
    if (roomUsers.length < 2) return;
    const user1 = roomUsers[0];
    const user2 = roomUsers[1];
    return user1.ships && user2.ships ? true : false;
  }
}

export default ShipController;
