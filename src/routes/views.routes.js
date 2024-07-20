import express from 'express';
import MongoProductManager from '../dao/mongo/mongoProductManager.js';
import MongoCartsManager from '../dao/mongo/mongoCartManager.js';
import User from '../dao/model/user.model.js';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const router = express.Router();
const prod = MongoProductManager;

let cart = []

router.get('/', async (req, res) => {
    try {
        let { limit, page, sort, category } = req.query
        const options = {
            page: Number(page) || 2,
            limit: Number(limit) || 6,
            sort: { price: Number(sort) },
            lean: true
        }
        if (!(options.sort.price === -1 || options.sort.price === 1)) {
            delete options.sort
        }
        const links = (products) => {
            let prevLink;
            let nextLink;
            if (req.originalUrl.includes('page')) {
                prevLink = products.hasPrevPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
                return { prevLink, nextLink }
            }
            if (!req.originalUrl.includes('?')) {
                prevLink = products.hasPrevPage ? req.originalUrl.concat(`?page=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? req.originalUrl.concat(`?page=${products.nextPage}`) : null;
                return { prevLink, nextLink }
            }
            prevLink = products.hasPrevPage ? req.originalUrl.concat(`&page=${products.prevPage}`) : null;
            nextLink = products.hasNextPage ? req.originalUrl.concat(`&page=${products.nextPage}`) : null;
            return { prevLink, nextLink }

        }
        const categories = await MongoProductManager.categories()
        const result = categories.some(categ => categ === category)
        if (result) {
            const products = await MongoProductManager.getProducts({ category }, options);
            const { prevLink, nextLink } = links(products);
            const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs, page } = products
            if (page > totalPages) return res.render('notFound', { pageNotFound: '/products' })
            return res.render('products', {  products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page, cart: cart.length });
        }
        const products = await MongoProductManager.getProducts({}, options);
        const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
        const { prevLink, nextLink } = links(products);
        if (page > totalPages) return res.render('notFound', { pageNotFound: '/products' })
        return res.render('products', {  products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page, cart: cart.length });
    } catch (error) {
        console.log(error);
    }
})



router.get('/home', async (req, res) => {
    try {
        const products = await MongoProductManager.getProducts();  
        res.render('home', { products }); 
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await prod.getProducts();  
        res.render('realTimeProducts', { products });  
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});
router.get('/products', isAuthenticated, async (req, res) => {
    try {
        const products = await prod.getProducts();
        console.log(products); 
        res.render('products', { products: products.docs, user: req.session.user });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).send('Error fetching products');
    }
});

router.get('/products/:productId', async (req, res) => {
    try {
        const product = await prod.getProductById(req.params.productId);
        if (product) {
            res.render('details', { product: { ...product.toObject() } });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (err) {
        res.status(500).send('Error al obtener el producto');
    }
})


router.get('/carts/:cartId', async (req, res) => {
    const cartId = req.params.cartId;
    try {
        const cart = await MongoCartsManager.getCartById(cartId); 
    
        if (!cart) {
        
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.render('carts', { cart }); 
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});



router.get('/chat', (req, res) => {
    res.render('chat', {});  
});

// register u login 

router.get('/login', isNotAuthenticated, (req, res) => {
    try {
      res.render('login');
    } catch (error) {
      console.error('Error al cargar la vista de login:', error);
      res.status(500).send('Error al cargar la vista de login');
    }
  });
  
  
  router.get('/register', isNotAuthenticated, (req, res) => {
    try {
      res.render('register');
    } catch (error) {
      console.error('Error al cargar la vista de registro:', error);
      res.status(500).send('Error al cargar la vista de registro');
    }
  });
  
  
  router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            console.error('Usuario no autenticado');
            return res.status(401).send('Usuario no autenticado');
        }

        const user = await User.findById(req.session.user._id).select('-password');
        if (!user) {
            console.error('Usuario no encontrado');
            return res.status(404).send('Usuario no encontrado');
        }

        res.render('profile', { user: user.toObject() });
    } catch (error) {
        console.error('Error al cargar la vista de perfil:', error);
        res.status(500).send('Error al cargar la vista de perfil');
    }
});
  







export default router;
