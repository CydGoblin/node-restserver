const { response, json } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar que el correo exista
    const usuario = await Usuario.findOne({ correo });
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
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Algo salio mal.",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      // Crealo
      const data = {
        nombre,
        correo,
        password: "usuarioGoogle",
        img,
        google: true,
        rol: "USER",
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    // Si el usuario en BD tiene estado false
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Usuario bloqueado, hable con el admin",
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
