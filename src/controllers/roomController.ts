import WebSocket from 'ws';
import {
  saveRoomData,
  getRoomData,
  getPlayerData,
  getAllRoomsData,
  addUserToRoom,
} from '../db/db';
import { connections } from '../http_server/index';

class RoomController {
  createRoom(ws: WebSocket, name: string) {
    const roomId = 0;

    const user = getPlayerData(name);

    if (user) {
      saveRoomData(roomId, {
        roomId,
        roomUsers: [{ name: user.name, index: user.index! }],
      });
    }

    const allRooms = getAllRoomsData();

    ws.send(
      JSON.stringify({
        type: 'update_room',
        data: JSON.stringify(allRooms),
        id: 0,
      }),
    );
  }

  addPlayerToRoom(request: any, userName: string) {
    const { indexRoom } = JSON.parse(request.data);

    addUserToRoom(userName, indexRoom);
    const room = getRoomData(indexRoom);

    room?.roomUsers.forEach((user: any) => {
      const userWS = connections[user.name];

      userWS.send(
        JSON.stringify({
          type: 'create_game',
          data: JSON.stringify({
            idGame: room?.roomId,
            idPlayer: user.index,
          }),
          id: 0,
        }),
      );
    });
  }
}

export default RoomController;
