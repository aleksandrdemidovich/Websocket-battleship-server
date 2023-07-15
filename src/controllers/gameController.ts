import WebSocket from 'ws';
import {
  RoomData,
  toggleTurn,
  getRoomData,
  checkAttack,
  checkWin,
  updateWinners,
  clearRoomData,
  getAllRoomsData,
} from '../db/db';
import { connections } from '../http_server/index';
import PlayerController from './playerController';

const playerController = new PlayerController();
class GameController {
  startGame(room: RoomData) {
    room.roomUsers.forEach((user) => {
      const userWS = connections[user.name];
      if (userWS) {
        userWS.send(
          JSON.stringify({
            type: 'start_game',
            data: JSON.stringify({ ships: user.ships, id: user.index }),
            id: 0,
          }),
        );
      }
    });
    this.changeTurn(room.roomId);
  }

  attack(ws: WebSocket, request: any) {
    const { x, y, gameId, indexPlayer } = JSON.parse(request.data);

    const room = getRoomData(gameId);

    if (
      (room?.turn === false && indexPlayer % 2 === 1) ||
      (room?.turn === true && indexPlayer % 2 === 0)
    )
      return;

    const userIndexForAttack = room.roomUsers.findIndex(
      (user: any) => user.index !== indexPlayer,
    );
    const userIdForAttack = userIndexForAttack;

    const status = checkAttack(
      room?.roomUsers[userIdForAttack]?.ships!,
      {
        x,
        y,
      },
      gameId,
      userIdForAttack,
    );
    if (status === 'killed' || status === 'shot') {
      this.changeTurn(gameId);
      this.changeTurn(gameId);
    } else {
      this.changeTurn(gameId);
    }

    this.feedbackAttack(x, y, status!, indexPlayer, gameId);

    if (checkWin(gameId)) {
      this.finishGame(ws, indexPlayer, gameId);
      return;
    }
    const bot = room.roomUsers.find((user: any) => user.name === 'Bot');

    if (bot) {
      this.randomAttack(ws, {
        data: JSON.stringify({ gameId: gameId, indexPlayer: bot.index }),
      });
    }
  }

  feedbackAttack(
    x: number,
    y: number,
    status: string,
    currentPlayer: number,
    gameId: number,
  ) {
    const position = {
      x: x,
      y: y,
    };

    const room = getRoomData(gameId);
    room?.roomUsers.forEach((user: any) => {
      const userWS = connections[user.name];
      if (userWS) {
        userWS.send(
          JSON.stringify({
            type: 'attack',
            data: JSON.stringify({ position, status, currentPlayer }),
            id: 0,
          }),
        );
      }
    });
  }

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

  changeTurn(roomId: number) {
    const room = getRoomData(roomId);

    room?.roomUsers.forEach((user: any) => {
      const userWS = connections[user.name];
      if (userWS) {
        userWS.send(
          JSON.stringify({
            type: 'turn',
            data: JSON.stringify({
              currentPlayer:
                room.turn === true
                  ? room.roomUsers[0].index
                  : room.roomUsers[1].index,
            }),
            id: 0,
          }),
        );
      }
    });
    toggleTurn(roomId);
  }

  finishGame(ws: WebSocket, indexPlayer: number, gameId: number) {
    const room = getRoomData(gameId);
    room?.roomUsers.forEach((user: any) => {
      const userWS = connections[user.name];
      if (userWS) {
        userWS.send(
          JSON.stringify({
            type: 'finish',
            data: JSON.stringify({ winPlayer: indexPlayer }),
            id: 0,
          }),
        );
      }
    });

    const bot = room.roomUsers.find((user: any) => user.name === 'Bot');
    if (bot) {
      clearRoomData(gameId);
      const allRooms = getAllRoomsData();

      ws.send(
        JSON.stringify({
          type: 'update_room',
          data: JSON.stringify(allRooms),
          id: 0,
        }),
      );
      return;
    }

    const winner = room?.roomUsers.find(
      (user: any) => user.index === indexPlayer,
    );
    updateWinners(winner?.name!);
    playerController.updateWinners(gameId);
  }
}

export default GameController;
