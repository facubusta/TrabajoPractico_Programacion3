import { Router } from "express";
// import { PRODUCTS } from "../mocks/products.js";
import { Product } from "../models/Product.js";
import { isAuth } from "../middlewares/auth.js";


const router = Router();

// Ruta para traer la lista de productos.
router.get("/", async (req, res, next) => {
  try {
    const PAGE_SIZE = 12;
    const page  = Number(req.query.page) || 1;
    const limit = PAGE_SIZE;
    const offset = (page - 1) * limit;

    const typeParam = req.query.type ?? req.query.tipo;

    const where = { active: true }; // 👈 público: SIEMPRE activos
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

// Ruta para traer un solo producto por su id.
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

// Crear producto
router.post("/", isAuth, async (req, res, next) => {
  try {
    // Acepto nombres en español o inglés
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

// Actualizar producto por id
router.put("/:id", isAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
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

// Eliminar producto
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.destroy(); // 🔥 Borrado físico
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// Desactivar (baja lógica): active=false
router.post("/:id/deactivate",isAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.update({ active: false });
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// Activar: active=true
router.post("/:id/activate",isAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.update({ active: true });
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
