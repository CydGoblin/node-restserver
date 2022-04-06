const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");

const cargarArchivo = async (req, res = response) => {
  console.log(req.files);

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ msg: "No files were uploaded." });
    return;
  }

  try {
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    return res.json({ nombre });
  } catch (msg) {
    res.status(400).json({
      msg,
    });
  }
};

const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;
  res.json({ id, coleccion });
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
};
