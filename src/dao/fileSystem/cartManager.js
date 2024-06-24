import fs from 'fs/promises';


class CartManager {
    constructor(filePath) {
        this.fileName = filePath;
        this.cartsIdCounter = 1; 
        this.carts = [];
        this.loadCarts(); 
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.fileName, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                
            } else {
                console.error("Error loading carts from file:", error.message);
            }
        }
    }
    
    async saveCarts() {
        try {
            await fs.writeFile(this.fileName, JSON.stringify(this.carts, null, 2), 'utf-8');
        } catch (error) {
            console.error("Error saving carts to file:", error.message);
        }
    }

    async getCartById(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (cart) {
            return cart;
        } else {
            throw new Error("Cart not found");
        }
    }

    async addProductToCart(cartId, productId) {
        const cartIndex = this.carts.findIndex(cart => cart.id === cartId);
        if (cartIndex !== -1) {
            const productIndex = this.carts[cartIndex].products.findIndex(product => product.id === productId);
            if (productIndex !== -1) {
                this.carts[cartIndex].products[productIndex].quantity++;
            } else {
                this.carts[cartIndex].products.push({ id: productId, quantity: 1 });
            }
            await this.saveCarts();
            return this.carts[cartIndex];
        } else {
            throw new Error("Cart not found");
        }
    }

    async createCart() {
        const cartId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : this.cartsIdCounter;
        const newCart = {
            id: cartId,
            products: []
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }
}

const cartManager = new CartManager('carts.json');
export default cartManager;