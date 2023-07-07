import WebSocket from 'ws';
import { saveRoomData, getRoomData } from '../db/db';

class RoomController {
  createRoom(ws: WebSocket) {
    const roomId = 0;

    saveRoomData(roomId, { roomId, roomUsers: [] });

    this.sendRoomResponse(ws, 'create_game', { idGame: roomId, idPlayer: 1 });
  }

  addPlayerToRoom(ws: WebSocket, request: any) {
    const { indexRoom } = request.data;

    const roomData = getRoomData(indexRoom);

    if (roomData) {

      const player = { name: 'Player2', index: 2 };
      roomData.roomUsers.push(player);

      saveRoomData(indexRoom, roomData);

      this.sendRoomResponse(ws, 'add_player_to_room', {
        roomId: indexRoom,
      });
    } else {
      console.log('Room not found');
    }
  }

  private sendRoomResponse(ws: WebSocket, type: string, data: any) {
    const response = { type, data };
    console.log(JSON.stringify(response));

    ws.send(JSON.stringify({ type, data: JSON.stringify(data), id: 0 }));
  }
}

export default RoomController;
