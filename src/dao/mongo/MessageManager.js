import Message from '../model/message.Model.js';

class MessageManager {
    // Crear un nuevo mensaje
    async createMessage(data) {
        try {
            const message = new Message(data);
            return await message.save();
        } catch (error) {
            console.error('Error creating message:', error);
            throw error;
        }
    }

    // Obtener todos los mensajes
    async getAllMessages() {
        try {
            return await Message.find();
        } catch (error) {
            console.error('Error retrieving messages:', error);
            throw error;
        }
    }

    // Obtener mensajes por usuario
    async getMessagesByUser(user) {
        try {
            return await Message.find({ user });
        } catch (error) {
            console.error('Error retrieving messages by user:', error);
            throw error;
        }
    }

    // Eliminar un mensaje por ID
    async deleteMessageById(id) {
        try {
            return await Message.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error deleting message by ID:', error);
            throw error;
        }
    }

    // Actualizar un mensaje por ID
    async updateMessageById(id, data) {
        try {
            return await Message.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error('Error updating message by ID:', error);
            throw error;
        }
    }
}
export default new MessageManager();



