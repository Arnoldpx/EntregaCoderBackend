import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = "Products";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: Boolean, default: true }
});

productSchema.plugin(mongoosePaginate)
const Productos = mongoose.model(productsCollection, productSchema);

export default Productos;




