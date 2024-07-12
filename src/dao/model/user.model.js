import mongoose from 'mongoose';

const userCollection = " Usuarios"

const userSchema = new mongoose.Schema({
 first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
});
const User =mongoose.model(userCollection,userSchema)
export  default User;