import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import WebSocket from 'ws';
import PlayerController from '../controllers/playerController';
import RoomController from '../controllers/roomController';

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

wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection established');

  ws.on('message', (message: string) => {
    const request = JSON.parse(message);

    switch (request.type) {
      case 'reg':
        playerController.registerPlayer(ws, request);
        break;
      case 'create_room':
        roomController.createRoom(ws);
        break;
      case 'add_player_to_room':
        roomController.addPlayerToRoom(ws, request);
        break;
      default:
        console.log('Unknown request type:', request.type);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});
