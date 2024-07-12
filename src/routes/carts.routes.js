import { Router } from 'express';
import MongoCartsManager from '../dao/mongo/mongoCartManager.js'; 
const router = Router();
const cartManager = MongoCartsManager;

// Ruta para agregar un producto al carrito
router.post('/carts/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body; // Asegúrate de que la cantidad se reciba desde el cuerpo de la solicitud

    try {
        const cart = await cartManager.addProductToCart(cartId, productId, quantity);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding product to cart:', error.message);
        res.status(500).json({ error: 'Error adding product to cart' });
    }
});

// Ruta para crear un nuevo carrito
router.post('/carts', async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error creating cart:', error.message);
        res.status(500).json({ error: 'Error creating cart' });
    }
});

// Ruta para obtener un carrito por su ID
router.get('/carts/:id', async (req, res) => {
    try {
        const cartId = req.params.id;
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart by ID:', error.message);
        res.status(500).json({ error: 'Error fetching cart by ID' });
    }
});

router.delete('/cart/:cartId/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

       
        await cartManager.deleteProductFromCart(cartId, productId);

        res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.delete('/cart/:cartId/', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        await cartManager.deleteAllProductsInCart(cartId);

        res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Ruta para obtener todos los carritos
router.get('/carts', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        console.log(carts)
        res.status(200).json(carts);
    } catch (error) {
        console.error('Error fetching all carts:', error.message);
        res.status(500).json({ error: 'Error fetching all carts' });
    }
});

export default router;
