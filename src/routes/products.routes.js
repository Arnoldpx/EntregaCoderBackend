
import { Router } from 'express';
import fileSystemProductManager from '../dao/fileSystem/productManager.js';
import MongoProductManager from '../dao/mongo/mongoProductManager.js';

const prod = MongoProductManager;

const router = Router();


// Rutas para MongoDB

router.get('/', async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query, availability } = req.query;
        const options = {
            page: Number(page),
            limit: Number(limit),
            lean: true
        };

        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        let filter = {};
        if (query) {
            filter.category = query;
        }
        if (availability) {
            filter.status = availability === 'available' ? true : false;
        }

    const products = await prod.getProducts(filter,options);
    res.json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? products.prevPage : null,
      nextPage: products.hasNextPage ? products.nextPage : null,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage
  });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const products = await prod.getProductById(req.params.id);
    res.send({result: "success", payload: products})
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


router.post('/api/products', async (req, res) => {
  try {
    const newProduct = await prod.addProduct(req.body);
    res.send({result: "success", payload: newProduct})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await prod.updateProduct(req.params.id, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await prod.deleteProduct(req.params.id);
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
