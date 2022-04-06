const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { response } = require("express");

const cargarArchivo = (req, res = response) => {
  console.log(req.files);

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ msg: "No files were uploaded." });
    return;
  }

  const { archivo } = req.files;
  const nombreCortado = archivo.name.split(".");
  const extension = nombreCortado[nombreCortado.length - 1];

  // Calidar extensiones
  const extensionesValidas = ["png", "jpg", "jpeg", "gif", "webp"];
  if (!extensionesValidas.includes(extension)) {
    return res.status(400).json({
      msg: `La extensión ${extension} no está permitida, ${extensionesValidas}`,
    });
  }

  const nombreTemp = uuidv4() + "." + extension;

  const uploadPath = path.join(__dirname, "../uploads/", nombreTemp);

  archivo.mv(uploadPath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ err });
    }

    return res.json({ msg: "File uploaded to " + uploadPath });
  });
};

module.exports = {
  cargarArchivo,
};
