import MessageManager from '../mongo/MessageManager.js';



const chatSocket = (io) => {
    const mensaje =  MessageManager;
    io.on('connection', async (socket) => {
      console.log("Nuevo cliente conectado");
  
      const messages = await mensaje.getAllMessages();
      socket.emit("messageLogs", messages);
  
      socket.on("message", async (data) => {
        try {
          const saved = await mensaje.createMessage(data);
          const updatedMessages = await mensaje.getAllMessages();
          io.emit("messageLogs", updatedMessages);
        } catch (error) {
          console.error("Error al guardar mensaje:", error);
        }
      });
  
      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });
    });
  };
  
  export default chatSocket;