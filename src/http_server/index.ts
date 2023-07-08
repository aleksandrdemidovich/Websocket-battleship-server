import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import WebSocket from 'ws';
import PlayerController from '../controllers/playerController';
import RoomController from '../controllers/roomController';
import ShipController from '../controllers/shipController';
// import GameController from '../controllers/gameController';

export const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(''));
  const file_path =
    __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const wss = new WebSocket.Server({ server: httpServer });

const playerController = new PlayerController();
const roomController = new RoomController();
const shipController = new ShipController();

export const connections: any = {};

wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection established');

  let userName: string;

  ws.on('message', (message: string) => {
    const request = JSON.parse(message);


    switch (request.type) {
      case 'reg':
        userName = playerController.registerPlayer(ws, request);
        connections[userName] = ws;
        break;
      case 'create_room':
        roomController.createRoom(ws, userName);
        break;
      case 'add_user_to_room':
        roomController.addPlayerToRoom(ws, request, userName);
        break;
      case 'create_room':
        roomController.createGame(ws);
        break;
      case 'add_ships':
        shipController.addShips(ws, request);

        break;
      default:
        console.log('Unknown request type:', request.type);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});
