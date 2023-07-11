interface PlayerData {
  name: string;
  password: string;
  index?: number;
}

export interface RoomData {
  roomId: number;
  roomUsers: { name: string; index: number; ships?: Ship[] }[];
  turn?: boolean;
}

export interface Ship {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
  hits?: boolean[];
}

const playerDataStore: PlayerData[] = [];
const roomDataStore: RoomData[] = [];

export const savePlayerData = (data: PlayerData) => {
  playerDataStore.push(data);
  return { ...data, index: playerDataStore.length - 1 };
};

export const getPlayerData = (name: string): PlayerData | undefined => {
  const index = playerDataStore.findIndex((player) => player.name === name);
  return { ...playerDataStore[index], index: index };
};

export const saveRoomData = (roomId: number, data: RoomData) => {
  roomDataStore.push({ ...data, roomId });
  return { ...data, index: roomDataStore.length - 1, roomId };
};

export const getRoomData = (roomId: number): RoomData | undefined => {
  const index = roomDataStore.findIndex((room) => room.roomId === roomId);
  return { ...roomDataStore[index], roomId: index };
};

export const addUserToRoom = (username: string, roomId: number) => {
  const user = getPlayerData(username);
  if (user) {
    const room = roomDataStore.find((room, index) => index === roomId);
    if (room?.roomUsers.filter((user) => user.name === username).length) return;
    room?.roomUsers.push({ name: user.name, index: user.index! });
    return room;
  }
};

export const getAllRoomsData = (): RoomData[] => {
  return Object.values(roomDataStore);
};

export const addShipsToUser = (
  indexPlayer: number,
  roomId: number,
  ships: any,
) => {
  const room = getRoomData(roomId);
  if (room) {
    room.roomUsers[indexPlayer] = { ...room.roomUsers[indexPlayer], ships };
    return room;
  }
};

export const toggleTurn = (roomId: number) => {
  const room = getRoomData(roomId);
  if (room) {
    roomDataStore[roomId] = { ...room, turn: !room.turn };
  }
};

export const checkAttack = (
  battleshipArray: Ship[],
  attackPosition: { x: number; y: number },
  gameId: number,
  userId: number,
) => {
  if (!roomDataStore[gameId].roomUsers[userId].ships) return;

  for (const ship of battleshipArray) {
    const { position, direction, length } = ship;

    if (direction) {
      for (let i = position.y; i < position.y + length; i++) {
        if (position.x === attackPosition.x && i === attackPosition.y) {
          ship.length--;
          console.log(ship.length);
          if (ship.length === 0) {
            return 'killed';
          }

          return 'shot';
        }
      }
    } else {
      for (let i = position.x; i < position.x + length; i++) {
        if (i === attackPosition.x && position.y === attackPosition.y) {
          ship.length--;

          if (ship.length === 0) {
            return 'killed';
          }

          return 'shot';
        }
      }
    }
  }

  return 'miss';
};
