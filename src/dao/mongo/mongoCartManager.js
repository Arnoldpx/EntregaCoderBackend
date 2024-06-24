import CartsModel from '../model/carts.model.js';
import Product from '../model/products.model.js'; // Importa el modelo de productos adecuadamente

class MongoCartsManager {
  
    async addProductToCart(cartId, productId, cantidad) {
        try {
            const cart = await CartsModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += parseInt(cantidad) || 1;
            } else {
                cart.products.push({ product: productId, quantity: parseInt(cantidad) || 1 });
            }

            await cart.save();
            return { status: 'success', message: 'Producto agregado al carrito' };
        } catch (err) {
            console.error('Error al agregar el producto al carrito:', err.message);
            throw new Error('Error al agregar el producto al carrito');
        }
    }

    async createCart(products = []) {
        try {
            const existingCart = await CartsModel.findOne().lean();
            if (existingCart) {
                return existingCart;
            }
            const cart = await CartsModel.create({ products });
            return cart;
        } catch (err) {
            console.error('Error al crear o buscar el carrito:', err.message);
            throw new Error('Error al crear o buscar el carrito');
        }
    }

    async getCarts() {
        try {
            console.log('Intentando obtener todos los carritos.');
            const carts = await CartsModel.find().populate('products.product').lean();
            console.log('Carritos obtenidos exitosamente:', carts);
            return carts;
        } catch (err) {
            console.error('Error al obtener los carritos:', err.message);
            throw new Error('Error al obtener los carritos');
        }
    };

    async getCartById(cartId) {
        try {
            const cart = await CartsModel.findById(cartId).populate('products.product').lean();
            return cart;
        } catch (err) {
            console.error('Error al obtener el carrito por ID:', err.message);
            throw new Error('Error al obtener el carrito por ID');
        }
    }

    async updateOneProduct(cartId, productId, quantity) {
        try {
            const cart = await CartsModel.findOneAndUpdate(
                { _id: cartId, "products.product": productId },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            ).populate('products.product');
            return cart;
        } catch (err) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', err.message);
            throw new Error('Error al actualizar la cantidad del producto en el carrito');
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await CartsModel.findOneAndUpdate(
                { _id: cartId },
                { $pull: { products: { product: productId } } },
                { new: true }
            ).populate('products.product');
            return cart;
        } catch (err) {
            console.error('Error al eliminar el producto del carrito:', err.message);
            throw new Error('Error al eliminar el producto del carrito');
        }
    }

    async deleteAllProductsInCart(cartId) {
        try {
            const cart = await CartsModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = [];

            await cart.save();
            return cart;
        } catch (err) {
            console.error('Error al eliminar todos los productos del carrito:', err.message);
            throw new Error('Error al eliminar todos los productos del carrito');
        }
    }
}

export default new MongoCartsManager();
