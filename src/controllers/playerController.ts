import WebSocket from 'ws';
import { savePlayerData } from '../db/db';

class PlayerController {
  registerPlayer(ws: WebSocket, request: any) {
    const { name, password } = request.data;

    console.log(request.data);

    savePlayerData(name, { name, password });

    this.sendPersonalResponse(ws, 'reg', {
      name,
      index: 1,
      error: false,
      errorText: '',
    });
  }

  private sendPersonalResponse(ws: WebSocket, type: string, data: any) {
    const response = { type, data };
    console.log(JSON.stringify(response));

    ws.send(JSON.stringify({ type, data: JSON.stringify(data), id: 0 }));
  }
}

export default PlayerController;
