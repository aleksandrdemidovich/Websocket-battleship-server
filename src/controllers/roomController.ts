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

  addPlayerToRoom(ws: WebSocket, request: any, userName: string) {
    const { indexRoom } = JSON.parse(request.data);

    addUserToRoom(userName, indexRoom);
    const room = getRoomData(indexRoom);

    room?.roomUsers.forEach((user) => {
      const ws2 = connections[user.name];
      this.sendRoomResponse(ws2, 'create_game', {
        idGame: room?.roomId,
        idPlayer: user.index,
      });
    });

  }

  createGame(ws: WebSocket) {
    // this.sendRoomResponse(ws, 'create_game', { idGame: 0, idPlayer: 1 });
  }

  updateRoomState(ws: WebSocket, request: any) {
    // Logic for updating room state
  }

  private sendRoomResponse(ws: WebSocket, type: string, data: any) {
    const validData = JSON.stringify(data);
    ws.send(JSON.stringify({ type, data: validData, id: 0 }));
  }
}

export default RoomController;
