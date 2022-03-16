const { response } = require("express");

const esAdmin = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar el rol sin validar token",
    });
  }

  const { rol, nombre } = req.usuario;

  if (rol !== "ADMIN") {
    return res.status(401).json({
      msg: `${nombre} no es ADMIN`,
    });
  }

  next();
};

const tieneRol = (...roles) => {
  return (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar el rol sin validar token",
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(401).json({
        msg: `El servicio require uno de los siguientes roles: ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  esAdmin,
  tieneRol,
};
