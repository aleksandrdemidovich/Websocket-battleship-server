import {
  RoomData,
  toggleTurn,
  getRoomData,
  checkAttack,
  checkWin,
  updateWinners,
} from '../db/db';
import { connections } from '../http_server/index';
import PlayerController from './playerController';

const playerController = new PlayerController();
class GameController {
  startGame(room: RoomData) {
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
    this.changeTurn(room.roomId);
  }

  attack(request: any) {
    const { x, y, gameId, indexPlayer } = JSON.parse(request.data);

    const room = getRoomData(gameId);

    if (
      (room?.turn === false && indexPlayer === 1) ||
      (room?.turn === true && indexPlayer === 0)
    )
      return;

    const userIdForAttack = indexPlayer === 0 ? 1 : 0;

    const status = checkAttack(
      room?.roomUsers[userIdForAttack]?.ships!,
      {
        x,
        y,
      },
      gameId,
      userIdForAttack,
    );
    this.feedbackAttack(x, y, status!, indexPlayer, gameId);

    if (checkWin(gameId)) {
      this.finishGame(indexPlayer, gameId);
    }

    this.changeTurn(gameId);
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
      userWS.send(
        JSON.stringify({
          type: 'attack',
          data: JSON.stringify({ position, status, currentPlayer }),
          id: 0,
        }),
      );
    });
  }

  randomAttack(request: any) {
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
    this.attack(data);
  }

  changeTurn(roomId: number) {
    const room = getRoomData(roomId);
    room?.roomUsers.forEach((user: any) => {
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

  finishGame(indexPlayer: number, gameId: number) {
    const room = getRoomData(gameId);
    room?.roomUsers.forEach((user: any) => {
      const userWS = connections[user.name];
      userWS.send(
        JSON.stringify({
          type: 'finish',
          data: JSON.stringify({ winPlayer: indexPlayer }),
          id: 0,
        }),
      );
    });
    const winner = room?.roomUsers[indexPlayer];
    updateWinners(winner?.name!);
    playerController.updateWinners(gameId);
  }
}

export default GameController;
