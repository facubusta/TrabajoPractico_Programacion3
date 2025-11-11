import bcrypt from "bcrypt";
import { User } from "../models/User.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ where: { email } });
    if (!u) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    // Guardamos datos mínimos en sesión
    req.session.user = { id: u.id, email: u.email, role: u.role };
    res.json(req.session.user);
  } catch (e) {
    next(e);
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
};