// Socket service stub - to be implemented with a React Native compatible library
// socket.io-client has issues with Metro bundler

// Stub socket object
export const socket = {
  connected: false,
  auth: {},
  
  connect: () => {
    console.log("Socket: connect called (stub)");
  },
  
  disconnect: () => {
    console.log("Socket: disconnect called (stub)");
  },
  
  emit: (event: string, data: any) => {
    console.log(`Socket: emit ${event}`, data);
  },
  
  on: (event: string, callback: any) => {
    console.log(`Socket: on ${event} (stub)`);
  },
  
  off: (event: string) => {
    console.log(`Socket: off ${event} (stub)`);
  },
};

export const connectSocket = (token: string) => {
  console.log("Socket: connectSocket called with token (stub)", token);
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  console.log("Socket: disconnectSocket called (stub)");
  socket.disconnect();
};

export const emitTyping = (receiverId: string) => {
  console.log("Socket: emitTyping called (stub)", receiverId);
  socket.emit("typing", { receiverId });
};

export const emitStopTyping = (receiverId: string) => {
  console.log("Socket: emitStopTyping called (stub)", receiverId);
  socket.emit("stopTyping", { receiverId });
};

export const sendMessage = (receiverId: string, message: string) => {
  console.log("Socket: sendMessage called (stub)", receiverId, message);
  socket.emit("sendMessage", { receiverId, message });
};

export default socket;
