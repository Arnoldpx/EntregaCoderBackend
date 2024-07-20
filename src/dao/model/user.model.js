import mongoose from 'mongoose';

const userCollection = " Usuarios"

const userSchema = new mongoose.Schema({
 first_name: { type: String},
  last_name: { type: String },
  email: { type: String, unique: true },
  age: { type: Number },
  password: { type: String},
  role: {type: String, default: 'user'}, 
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' } 
});
const User =mongoose.model(userCollection,userSchema)
export  default User;