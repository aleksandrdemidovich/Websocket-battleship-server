import WebSocket from 'ws';
import {
  savePlayerData,
  getAllRoomsData,
  getRoomData,
  getWinners,
  getPlayerData,
} from '../db/db';
import { connections } from '../http_server';

class PlayerController {
  registerPlayer(ws: WebSocket, request: any) {
    const { name, password } = JSON.parse(request.data);

    const user = getPlayerData(name);

    if (user && user.password === password) {
      ws.send(
        JSON.stringify({
          type: 'reg',
          data: JSON.stringify({
            name,
            index: user.index,
            error: false,
            errorText: '',
          }),
        }),
      );
    } else if (user && user.password !== password) {
      ws.send(
        JSON.stringify({
          type: 'reg',
          data: JSON.stringify({
            name,
            index: user!.index,
            error: true,
            errorText: 'Incorrect password',
          }),
        }),
      );
    } else {
      if (user === undefined) {
        const newUser = savePlayerData({
          name,
          password,
        });

        ws.send(
          JSON.stringify({
            type: 'reg',
            data: JSON.stringify({
              name,
              index: newUser.index,
              error: false,
              errorText: '',
            }),
          }),
        );
      }
    }

    const allRooms = getAllRoomsData();

    ws.send(
      JSON.stringify({
        type: 'update_room',
        data: JSON.stringify(allRooms),
        id: 0,
      }),
    );

    return name;
  }

  updateWinners(indexPlayer: number, gameId: number) {
    const room = getRoomData(gameId);
    const winner = room?.roomUsers[indexPlayer];
    const wins = getWinners();
    room?.roomUsers.forEach((user) => {
      const userWS = connections[user.name];
      userWS.send(
        JSON.stringify({
          type: 'update_winners',
          data: JSON.stringify(wins),
          id: 0,
        }),
      );
    });
  }
}

export default PlayerController;
