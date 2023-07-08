import WebSocket from 'ws';
// import { getRoomData, saveRoomData } from '../db/db';

class GameController {
  //   startGame(ws: WebSocket, request: any) {
  //     const { roomId } = request.data;

  //     // Retrieve room data from the data store
  //     const roomData = getRoomData(roomId);

  //     if (roomData) {
  //       // Perform game setup logic (e.g., initializing game state, assigning roles, etc.)

  //       // Save updated room data to the data store
  //       saveRoomData(roomId, roomData);

  //       // Send response for starting the game
  //       this.sendRoomResponse(ws, 'start_game', { roomId, gameInfo: roomData.gameInfo });
  //     } else {
  //       // Send error response if room not found
  //       console.log('Room not found');
  //     }
  //   }

  //   makeMove(ws: WebSocket, request: any) {
  //     const { roomId, playerId, move } = request.data;

  //     // Retrieve room data from the data store
  //     const roomData = getRoomData(roomId);

  //     if (roomData) {
  //       // Perform move validation and game logic

  //       // Update game state and player turn

  //       // Save updated room data to the data store
  //       saveRoomData(roomId, roomData);

  //       // Send response for the move
  //       this.sendRoomResponse(ws, 'move_made', { roomId, gameInfo: roomData.gameInfo });
  //     } else {
  //       // Send error response if room not found
  //       console.log('Room not found');

  //     }
  //   }

  //   endGame(ws: WebSocket, request: any) {
  //     const { roomId, winnerId } = request.data;

  //     // Retrieve room data from the data store
  //     const roomData = getRoomData(roomId);

  //     if (roomData) {
  //       // Perform end game logic (e.g., declaring winner, updating scores, etc.)

  //       // Save updated room data to the data store
  //       saveRoomData(roomId, roomData);

  //       // Send response for ending the game
  //       this.sendRoomResponse(ws, 'game_ended', { roomId, winnerId, scores: roomData.scores });
  //     } else {
  //       // Send error response if room not found
  //       console.log('Room not found');

  //     }
  //   }

  //   // Other game controller methods

  //   private sendRoomResponse(ws: WebSocket, type: string, data: any) {
  //     const response = { type, data };
  //     ws.send(JSON.stringify(response));
  //   }

  startGame(ws: WebSocket, request: any) {
    // Logic for starting the game
  }

  // Handle player's attack request
  attack(ws: WebSocket, request: any) {
    // Logic for player's attack
  }

  // Handle random attack request
  randomAttack(ws: WebSocket, request: any) {
    // Logic for random attack
  }

  // Handle changing player's turn request
  changeTurn(ws: WebSocket, request: any) {
    // Logic for changing player's turn
  }

  // Handle finishing the game request
  finishGame(ws: WebSocket, request: any) {
    // Logic for finishing the game
  }
}

export default GameController;
