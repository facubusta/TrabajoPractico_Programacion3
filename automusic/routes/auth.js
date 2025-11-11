import { Router } from "express";
import { User } from "../models/User.js"; // Asegurate que exista el modelo User (email, role, password o passwordHash)

const router = Router();

// GET /login - muestra el formulario
router.get("/login", (req, res) => {
  if (req.session?.user?.role === "admin") {
    return res.redirect("/admin");
  }
  return res.render("admin/login", { error: null });
});

// POST /login - procesa credenciales y crea la sesión desde BD
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).render("admin/login", { error: "Completá email y password" });
    }

    // Busco usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user || user.role !== "admin") {
      return res.status(401).render("admin/login", { error: "Credenciales inválidas" });
    }

    // Comparo password: soporta passwordHash (bcrypt) o password plano
    let ok = false;

    if (user.passwordHash) {
      try {
        const bcrypt = await import("bcrypt");
        ok = await bcrypt.compare(password, user.passwordHash);
      } catch (e) {
        // Si bcrypt no está disponible y el seed usa hash, no podremos validar
        return res.status(500).render("admin/login", { error: "No se pudo validar la contraseña (bcrypt no disponible)" });
      }
    } else if (user.password) {
      ok = password === user.password; // solo si el seed guarda texto plano
    }

    if (!ok) {
      return res.status(401).render("admin/login", { error: "Credenciales inválidas" });
    }

    req.session.user = {
      id: user.id,
      name: user.name || user.nombre || "Admin",
      email: user.email,
      role: user.role
    };

    return res.redirect("/admin");
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).render("admin/login", { error: "Error interno al iniciar sesión" });
  }
});

// GET /logout - destruye sesión y limpia cookie
router.get("/logout", (req, res) => {
  req.session?.destroy(() => {
    res.clearCookie("connect.sid");
    return res.redirect("/login");
  });
});

export default router;
