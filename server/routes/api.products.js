import { Router } from "express";
import { PRODUCTS } from "../mocks/products.js";
import { Product } from "../models/Product.js";

const router = Router();

// Ruta para traer los productos del mock.
// Se puede filtrar por tipo (A o B) y por si están activos o no.
// Ejemplo de uso desde el front:
//   /api/products?type=A&active=true&page=1&limit=6
//   Devuelve un objeto con:
//   data: productos de esa página,
//   total: cantidad total,
//   page: número de página actual,
//   pages: cantidad total de páginas.
router.get("/", async (req, res, next) => {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 12;
    const type  = req.query.type;
    const activeParam = req.query.active;
    const active = activeParam === "false" ? false : (activeParam === "true" ? true : undefined);

    const where = {};
    if (type)   where.type = type;
    if (active !== undefined) where.active = active;

    const offset = (page - 1) * limit;

    const { rows, count } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const total = count;
    const pages = Math.max(1, Math.ceil(total / limit));
    res.json({ data: rows, total, page, pages });
  } catch (e) {
    next(e);
  }
});

// Ruta para traer un solo producto por su id.
// Ejemplo de uso: /api/products/3
// Devuelve el producto completo si existe.
// Si no encuentra el id, responde con error 404 y un mensaje en JSON.
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const found = await Product.findByPk(id);
    if (!found) return res.status(404).json({ error: "Product not found" });
    res.json(found);
  } catch (e) {
    next(e);
  }
});

export default router;
