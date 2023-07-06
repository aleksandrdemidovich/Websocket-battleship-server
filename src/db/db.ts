interface PlayerData {
  name: string;
  password: string;
}

const playerDataStore: { [key: string]: PlayerData } = {};

export const savePlayerData = (name: string, data: PlayerData) => {
  playerDataStore[name] = data;
};

export const getPlayerData = (name: string): PlayerData | undefined => {
  return playerDataStore[name];
};
