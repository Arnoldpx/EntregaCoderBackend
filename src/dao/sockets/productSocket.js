import MongoProductManager from '../mongo/mongoProductManager.js';

const productSocket = (io) => {
    io.on('connection', async (socket) => {
        console.log("Nuevo cliente conectado");

        try {
            const products = await MongoProductManager.getProducts();
            socket.emit("productList", products);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }

        socket.on('createProduct', async (product) => {
            try {
                await MongoProductManager.addProduct(product);
                const updatedProducts = await MongoProductManager.getProducts();
                io.emit('updateProducts', updatedProducts);
            } catch (error) {
                console.error("Error al crear producto:", error);
            }
        });
        socket.on("deleteProduct",async(productId)=>{
            await MongoProductManager.deleteProduct(productId);
            const updatedProducts = await MongoProductManager.getProducts();
            io.emit('updateProducts', updatedProducts);
            })

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });
};

export default productSocket;