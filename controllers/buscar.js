const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = ["categorias", "productos", "roles", "usuarios"];

const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoID = isValidObjectId(termino);

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    const total = await Usuario.count(termino);
    return res.json({ total, data: usuario ? [usuario] : [] });
  }

  const regex = new RegExp(termino, "i");

  const condicionesBusqueda = {
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  };

  const usuarios = await Usuario.find(condicionesBusqueda);
  const total = await Usuario.count(condicionesBusqueda);
  return res.json({ total, data: usuarios });
};
const buscarCategorias = async (termino = "", res = response) => {
  const esMongoID = isValidObjectId(termino);

  if (esMongoID) {
    const categoria = await Categoria.findById(termino);
    const total = await Categoria.count(termino);
    return res.json({ total, data: categoria ? [categoria] : [] });
  }

  const regex = new RegExp(termino, "i");
  const condicionesBusqueda = { nombre: regex, estado: true };

  const categorias = await Categoria.find(condicionesBusqueda);
  const total = await Categoria.count(condicionesBusqueda);

  return res.json({ total, data: categorias });
};

const buscarProductos = async (termino = "", res = response) => {
  if (esMongoID) {
    const productos = await Producto.findById(termino).populate(
      "categoria",
      "nombre"
    );
    const total = await Producto.count(termino);
    return res.json({ total, data: productos ? [productos] : [] });
  }

  const regex = new RegExp(termino, "i");
  const condicionesBusqueda = { nombre: regex, estado: true };

  const productos = await Producto.find(condicionesBusqueda).populate(
    "categoria",
    "nombre"
  );
  const total = await Producto.count(condicionesBusqueda);

  return res.json({ total, data: productos });
};

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "categorias":
      buscarCategorias(termino, res);
      break;
    case "productos":
      buscarProductos(termino, res);
      break;
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    default:
      return res.status(500).json({
        msg: "Busqueda no implementada",
      });
  }
};

module.exports = {
  buscar,
};
