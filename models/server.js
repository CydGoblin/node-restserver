const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      authPath: "/api/auth",
      buscarPath: "/api/buscar",
      categoriasPath: "/api/categorias",
      productosPath: "/api/productos",
      uploadsPath: "/api/uploads",
      usuariosPath: "/api/usuarios",
    };

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio Público
    this.app.use(express.static("public"));

    // Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.authPath, require("../routes/auth"));
    this.app.use(this.paths.buscarPath, require("../routes/buscar"));
    this.app.use(this.paths.categoriasPath, require("../routes/categorias"));
    this.app.use(this.paths.productosPath, require("../routes/productos"));
    this.app.use(this.paths.uploadsPath, require("../routes/uploads"));
    this.app.use(this.paths.usuariosPath, require("../routes/usuarios"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
