import WebSocket from 'ws';
import { savePlayerData, getAllRoomsData } from '../db/db';

class PlayerController {
  registerPlayer(ws: WebSocket, request: any) {
    const { name, password } = JSON.parse(request.data);

    const user = savePlayerData({
      name,
      password,
    });

    this.sendPersonalResponse(ws, 'reg', {
      name,
      index: user.index,
      error: false,
      errorText: '',
    });

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

  private sendPersonalResponse(ws: WebSocket, type: string, data: any) {
    const response = { type, data };
    // console.log(JSON.stringify(response));

    ws.send(JSON.stringify({ type, data: JSON.stringify(data), id: 0 }));
  }
}

export default PlayerController;
