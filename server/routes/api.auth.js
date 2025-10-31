import { Router } from "express";
import { body, validationResult } from "express-validator";
import { login, logout} from "../controllers/authController.js";

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Ruta para login
// recibe { email, password } en el body
router.post(
  "/login",
  body("email").isEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 4 }).withMessage("Password muy corta"),
  validate,
  login
);

// Ruta para logout
router.post("/logout", logout);

export default router;
