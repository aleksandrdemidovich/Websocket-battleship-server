import WebSocket from 'ws';
import { RoomData, toggleTurn, getRoomData, Ship, checkAttack } from '../db/db';
import { connections } from '../http_server/index';
import ShipController from './shipController';

class GameController {
  startGame(ws: WebSocket, room: RoomData) {
    this.changeTurn(ws, room.roomId);
    room.roomUsers.forEach((user) => {
      const userWS = connections[user.name];
      userWS.send(
        JSON.stringify({
          type: 'start_game',
          data: JSON.stringify({ ships: user.ships, id: user.index }),
          id: 0,
        }),
      );
    });
  }

  // Handle player's attack request
  attack(ws: WebSocket, request: any) {
    const { x, y, gameId, indexPlayer } = JSON.parse(request.data);

    const room = getRoomData(gameId);
    const userIdForAttack = indexPlayer === 0 ? 1 : 0;

    const status = checkAttack(
      room?.roomUsers[userIdForAttack].ships!,
      {
        x,
        y,
      },
      gameId,
      userIdForAttack,
    );
    this.feedbackAttack(ws, x, y, status!, indexPlayer);
    this.changeTurn(ws, gameId);
  }

  feedbackAttack(
    ws: WebSocket,
    x: number,
    y: number,
    status: string,
    currentPlayer: number,
  ) {
    const position = {
      x: x,
      y: y,
    };
    console.log(status);

    ws.send(
      JSON.stringify({
        type: 'attack',
        data: JSON.stringify({ position, status, currentPlayer }),
        id: 0,
      }),
    );
  }

  // Handle random attack request
  randomAttack(ws: WebSocket, request: any) {
    const { gameId, indexPlayer } = JSON.parse(request.data);

    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    const data = {
      data: JSON.stringify({
        x,
        y,
        gameId,
        indexPlayer,
      }),
    };
    this.attack(ws, data);
  }

  // Handle changing player's turn request
  changeTurn(ws: WebSocket, roomId: number) {
    const room = getRoomData(roomId);
    room?.roomUsers.forEach((user) => {
      const userWS = connections[user.name];
      userWS.send(
        JSON.stringify({
          type: 'turn',
          data: JSON.stringify({ currentPlayer: room.turn === true ? 0 : 1 }),
          id: 0,
        }),
      );
    });
    toggleTurn(roomId);
  }

  // Handle finishing the game request
  finishGame(ws: WebSocket, request: any) {
    // Logic for finishing the game
  }
}

export default GameController;
