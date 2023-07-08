import WebSocket from 'ws';
import { savePlayerData, getAllRoomsData } from '../db/db';

class PlayerController {
  registerPlayer(ws: WebSocket, request: any) {
    const { name, password } = JSON.parse(request.data);

    const user = savePlayerData({
      name,
      password,
    });

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

  updateWinners(ws: WebSocket, request: any) {
    // Logic for updating winners
  }
}

export default PlayerController;
