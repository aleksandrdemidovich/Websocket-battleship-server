class Room {
    roomId: number;
    roomUsers: { name: string; index: number }[];
  
    constructor(roomId: number, roomUsers: { name: string; index: number }[]) {
      this.roomId = roomId;
      this.roomUsers = roomUsers;
    }
  }
  
  export default Room;