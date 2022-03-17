const { Producto } = require("../models");

const { response } = require("express");

const obtenerProductos = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    productos,
  });
};

const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");
  res.json(producto);
};

const crearProducto = async (req, res = response) => {
  const nombre = req.body.nombre;
  const categoria = req.body.categoria;

  const productoDb = await Producto.findOne({ nombre });

  if (productoDb) {
    return res.status(400).json({
      msg: `La producto ${nombre} ya existe`,
    });
  }

  const data = {
    nombre,
    usuario: req.usuario._id,
    categoria,
  };

  const producto = await new Producto(data);

  try {
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    console.log(error);
  }
};

// No repetir nombre
const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre;
  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json(producto);
};

// marcado
const borrarProducto = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(producto);
};

module.exports = {
  obtenerProductos,
  crearProducto,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};
