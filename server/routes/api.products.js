import { Router } from "express";
import { PRODUCTS } from "../mocks/products.js";

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
router.get("/", (req, res) => {
  const page  = Number(req.query.page)  || 1;
  const limit = Number(req.query.limit) || 12;
  const type  = req.query.type;
  const activeParam = req.query.active;
  const active = activeParam === "false" ? false : (activeParam === "true" ? true : undefined);

  let list = PRODUCTS.slice();
  if (type)   list = list.filter(p => p.type === type);
  if (active !== undefined) list = list.filter(p => p.active === active);

  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data  = list.slice(start, start + limit);

  res.json({ data, total, page, pages });
});

// Ruta para traer un solo producto por su id.
// Ejemplo de uso: /api/products/3
// Devuelve el producto completo si existe.
// Si no encuentra el id, responde con error 404 y un mensaje en JSON.
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = PRODUCTS.find(p => p.id === id);
  if (!found) return res.status(404).json({ error: "Product not found" });
  res.json(found);
});

export default router;
