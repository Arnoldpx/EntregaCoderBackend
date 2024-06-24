import fs from 'fs/promises'


class ProductManager {
    constructor(filePath) {
        this.fileName = filePath;
        this.products = [];
    }

    async init() {
        try {
            const data = await fs.readFile(this.fileName, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.fileName, '[]', 'utf-8');
                this.products = [];
            } else {
                throw new Error("Error al cargar productos desde el archivo: " + error.message);
            }
        }
    }

    async saveToFile() {
        try {
            await fs.writeFile(this.fileName, JSON.stringify(this.products, null, 2), 'utf-8');
        } catch (error) {
            throw new Error("Error al guardar productos en el archivo: " + error.message);
        }
    }

    async addProduct(product) {
        try {
            await this.init();
            if (!this.isProductValid(product)) {
                throw new Error("El producto no es válido");
            }

            if (this.isCodeDuplicate(product.code)) {
                throw new Error("El código del producto ya está en uso");
            }

            const lastId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
            product.id = lastId + 1;
            this.products.push(product);
            await this.saveToFile();
        } catch (error) {
            throw new Error("Error al añadir producto: " + error.message);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            await this.init();
            const productIndex = this.products.findIndex((p) => p.id === id);
            if (productIndex !== -1) {
                if (updatedFields.id || updatedFields.code && this.isCodeDuplicate(updatedFields.code)) {
                    throw new Error("El código del producto ya está en uso");
                }
                this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
                await this.saveToFile();
            } else {
                throw new Error("Producto no encontrado");
            }
        } catch (error) {
            throw new Error("Error al actualizar producto: " + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            await this.init();
            const productIndex = this.products.findIndex((p) => p.id === id);
            if (productIndex !== -1) {
                this.products.splice(productIndex, 1);
                await this.saveToFile();
            } else {
                throw new Error("Producto no encontrado");
            }
        } catch (error) {
            throw new Error("Error al eliminar producto: " + error.message);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        if (product) {
            return product;
        } else {
            throw new Error("Producto no encontrado");
        }
    }

    isProductValid(product) {
        return (
            product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock !== undefined
        );
    }

    isCodeDuplicate(code) {
        return this.products.some((p) => p.code === code);
    }
}

const productManager = new ProductManager('productos.json');
export default productManager;