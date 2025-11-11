export const isAuth = (req, res, next) => {
  if (req.session?.user?.role === "admin") return next();
  return res.status(401).json({ error: "No autorizado" });
};

// Middleware para que si le pega a una ruta de administrador y no es admin lo mande al /login
export const requireAdminPage = (req, res, next) => {
  if (req.session?.user?.role === "admin") return next();
  return res.redirect("/login");
};

