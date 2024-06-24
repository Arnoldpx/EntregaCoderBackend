
import mongoose from 'mongoose';

const messagecollection = "messages"

const messageSchema = new mongoose.Schema({
  user: { 
    type: String, 
    required: true },
  message: { 
    type: String, 
    required: true },
  timestamp: { 
    type: Date, 
    default: Date.now },
});

const messageModel = mongoose.model(messagecollection, messageSchema);
export default messageModel;