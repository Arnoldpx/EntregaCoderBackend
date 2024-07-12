// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Conectado a la base de datos");
    })
    .catch((error) => console.error("Error en la conexión a la base de datos: ", error));
