import MessageManager from '../dao/mongo/MessageManager.js'; 
import { Router } from 'express';

const router = Router();

router.post('/messages', async (req, res) => {
    try {
        const newMessage = await MessageManager.createMessage(req.body);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/messages', async (req, res) => {
    try {
        const messages = await MessageManager.getAllMessages();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/messages/user/:user', async (req, res) => {
    try {
        const messages = await MessageManager.getMessagesByUser(req.params.user);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/messages/:id', async (req, res) => {
    try {
        const deletedMessage = await MessageManager.deleteMessageById(req.params.id);
        res.status(200).json(deletedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/messages/:id', async (req, res) => {
    try {
        const updatedMessage = await MessageManager.updateMessageById(req.params.id, req.body);
        res.status(200).json(updatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
