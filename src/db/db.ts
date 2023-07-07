interface PlayerData {
  name: string;
  password: string;
}

interface RoomData {
  roomId: number;
  roomUsers: { name: string; index: number }[];
}

const playerDataStore: { [key: string]: PlayerData } = {};
const roomDataStore: { [key: number]: RoomData } = {};

export const savePlayerData = (name: string, data: PlayerData) => {
  playerDataStore[name] = data;
};

export const getPlayerData = (name: string): PlayerData | undefined => {
  return playerDataStore[name];
};

export const saveRoomData = (roomId: number, data: RoomData) => {
  roomDataStore[roomId] = data;
};

export const getRoomData = (roomId: number): RoomData | undefined => {
  return roomDataStore[roomId];
};
