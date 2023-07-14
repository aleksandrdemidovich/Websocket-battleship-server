import { WebSocket } from 'ws';
import { getAllRoomsData, saveRoomData } from '../db/db';
import { connections } from '../http_server/index';
import ShipController from './shipController';

const shipController = new ShipController();
class BotController {
  createBot() {
    return { name: 'Bot', ships: [] };
  }

  addBotToRoom(ws: WebSocket) {
    const bot = this.createBot();
    const roomId = 0;

    const user = Object.keys(connections).find(
      (key) => connections[key] === ws,
    );

    const ships = [
      { position: { x: 4, y: 0 }, direction: true, type: 'huge', length: 4 },
      { position: { x: 8, y: 6 }, direction: true, type: 'large', length: 3 },
      {
        position: { x: 3, y: 6 },
        direction: false,
        type: 'large',
        length: 3,
      },
      {
        position: { x: 8, y: 0 },
        direction: true,
        type: 'medium',
        length: 2,
      },
      {
        position: { x: 3, y: 8 },
        direction: true,
        type: 'medium',
        length: 2,
      },
      {
        position: { x: 0, y: 4 },
        direction: false,
        type: 'medium',
        length: 2,
      },
      {
        position: { x: 0, y: 7 },
        direction: false,
        type: 'small',
        length: 1,
      },
      { position: { x: 2, y: 1 }, direction: true, type: 'small', length: 1 },
      { position: { x: 6, y: 2 }, direction: true, type: 'small', length: 1 },
      {
        position: { x: 8, y: 3 },
        direction: false,
        type: 'small',
        length: 1,
      },
    ];

    saveRoomData(roomId, {
      roomId,
      roomUsers: [
        { name: user!, index: 0, ships: [] },
        { name: bot.name, index: 1, ships: [] },
      ],
    });

    shipController.addShips({
      data: JSON.stringify({ gameId: roomId, ships, indexPlayer: 1 }),
    });

    const allRooms = getAllRoomsData();

    ws.send(
      JSON.stringify({
        type: 'update_room',
        data: JSON.stringify(allRooms),
        id: 0,
      }),
    );

    ws.send(
      JSON.stringify({
        type: 'create_game',
        data: JSON.stringify({
          idGame: roomId,
          idPlayer: 0,
        }),
        id: 0,
      }),
    );
  }
}

export default BotController;
