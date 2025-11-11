import { Router } from "express";
import { Product } from "../models/Product.js";
import { isAuth } from "../middlewares/auth.js";

const router = Router();

// Todas las rutas de este router requieren admin (sesión)
router.use(isAuth);

// ADMIN: lista todos con paginación fija
router.get("/", async (req, res, next) => {
  try {
    const PAGE_SIZE = 12;
    const page  = Number(req.query.page) || 1;
    const limit = PAGE_SIZE;
    const offset = (page - 1) * limit;

    const typeParam = req.query.type ?? req.query.tipo;

    const where = {}; // admin: sin filtro de active
    if (typeParam) where.type = typeParam;

    const { rows, count } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    const total = count;
    const pages = Math.max(1, Math.ceil(total / limit));
    res.json({ data: rows, total, page, pages });
  } catch (e) {
    next(e);
  }
});

// ADMIN: obtener por id (incluye inactivos)
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (e) {
    next(e);
  }
});

// ADMIN: crear producto
router.post("/", async (req, res, next) => {
  try {
    const name   = req.body.name   ?? req.body.nombre;
    const type   = req.body.type   ?? req.body.tipo ?? null;
    const price  = req.body.price  ?? req.body.precio;
    const activeRaw = req.body.active ?? req.body.activo;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "name y price son obligatorios" });
    }

    const active =
      activeRaw === true ||
      activeRaw === "on" ||
      String(activeRaw) === "true";

    const created = await Product.create({
      name: String(name).trim(),
      type: type ? String(type).trim() : null,
      price: Number(price),
      active
    });

    return res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// ADMIN: actualizar producto
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const name     = req.body.name   ?? req.body.nombre;
    const type     = req.body.type   ?? req.body.tipo;
    const price    = req.body.price  ?? req.body.precio;
    const activeRaw= req.body.active ?? req.body.activo;

    const updates = {};
    if (name !== undefined)   updates.name = String(name).trim();
    if (type !== undefined)   updates.type = type ? String(type).trim() : null;
    if (price !== undefined)  updates.price = Number(price);
    if (activeRaw !== undefined) {
      updates.active =
        activeRaw === true ||
        activeRaw === "on" ||
        String(activeRaw) === "true";
    }

    await product.update(updates);
    return res.json(product);
  } catch (e) {
    next(e);
  }
});

// ADMIN: borrar producto (físico)
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.destroy();
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ADMIN: desactivar (baja lógica) -active=false
router.post("/:id/deactivate", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.update({ active: false });
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ADMIN: activar -active=true
router.post("/:id/activate", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.update({ active: true });
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;