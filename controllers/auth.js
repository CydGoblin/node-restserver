const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const login = (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar que el correo exista
    const usuario = Usuario.findOne({ correo });
    // console.log(usuario);
    if (!usuario) {
      return res.status(400).json({
        msg: "El usuario o contraseña son incorrectos _ correo",
      });
    }
    // Verificar que el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "El usuario o contraseña son incorrectos _ estado",
      });
    }

    // Verificar contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "El usuario o contraseña son incorrectos _ password",
      });
    }

    // Generar JWT

    res.json({
      msng: "Login ok",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Algo salio mal.",
    });
  }
};

module.exports = {
  login,
};
