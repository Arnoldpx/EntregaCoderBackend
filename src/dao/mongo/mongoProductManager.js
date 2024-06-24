import Productos from '../model/products.model.js'; 

class MongoProductManager {


  async categories () {
    try {
        const categories = await productsModel.aggregate([
            {
                $group: {
                    _id: null,
                    categories: { $addToSet: "$category" }
                }
            }
        ]);
        return categories[0].categories;
    } catch (err) {
        console.log(err);
        return err;
    }
  }
  
   async getProductsView () {
    try {
        return await productsModel.find().lean();
    } catch (err) {
        return err;
    }
  }
  


  async addProduct(product) {
    try {
      if (!this.isProductValid(product)) {
        throw new Error("El producto no es válido");
      }

      const newProduct = new Productos(product);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error("Error al añadir producto: " + error.message);
    }
  }

  async updateProduct(productId, updatedFields) {
    try {
      const updatedProduct = await Productos.findByIdAndUpdate(productId, updatedFields, { new: true });
      if (!updatedProduct) {
        throw new Error("Producto no encontrado");
      }
      return updatedProduct;
    } catch (error) {
      throw new Error("Error al actualizar producto: " + error.message);
    }
  }
  async categories() {
    try {
        // Obtiene todas las categorías únicas de los productos
        const categories = await Productos.distinct('category');
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

  async deleteProduct(productId) {


    try {
      const deletedProduct = await Productos.findByIdAndDelete(productId);
      if (!deletedProduct) {
        throw new Error("Producto no encontrado");
      }
      return deletedProduct;
    } catch (error) {
      throw new Error("Error al eliminar producto: " + error.message);
    }
  }

  async getProductById(productId) {
    try {
      const product = await Productos.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      throw new Error("Error al obtener producto: " + error.message);
    }
  }

  async getProducts  (filter = {}, options = {})  {
    try {
        const { page = 1, limit = 3, sort, lean = true } = options;
        const queryOptions = {
            page,
            limit,
            sort,
            lean
        };
        return await Productos.paginate(filter, queryOptions);
    } catch (err) {
        return err;
    }
  }

  isProductValid(product) {
    return (
      product.title &&
      product.description &&
      product.category &&
      product.price &&
      product.thumbnail &&
      product.code &&
      product.stock !== undefined
    );
  }
}

export default new MongoProductManager();



