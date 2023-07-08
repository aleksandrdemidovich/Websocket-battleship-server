interface PlayerData {
  name: string;
  password: string;
  index?: number;
}

interface RoomData {
  roomId: number;
  roomUsers: { name: string; index: number }[];
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
    room?.roomUsers.push({ name: user.name, index: user.index! });
    return room;
  }
};

export const getAllRoomsData = (): RoomData[] => {
  return Object.values(roomDataStore);
};
