import { Router } from "express";
import { Sale } from "../models/Sale.js";
import { SaleItem } from "../models/SaleItem.js";
import { Product } from "../models/Product.js";
import { isAuth } from "../middlewares/auth.js";

const router = Router();

// Todas las rutas de este router requieren admin (sesión)
router.use(isAuth);

// GET /api/admin/ventas -> lista con paginación
router.get("/", async (req, res, next) => {
  try {
    const PAGE_SIZE = 20;
    const page  = Number(req.query.page) || 1;
    const limit = PAGE_SIZE;
    const offset = (page - 1) * limit;

    const { rows, count } = await Sale.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: SaleItem,
          as: "items",
          include: [ Product ]
        }
      ]
    });

    const total = count;
    const pages = Math.max(1, Math.ceil(total / limit));

    res.json({ data: rows, total, page, pages });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/ventas/:id -> detalle de una venta
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const venta = await Sale.findByPk(id, {
      include: [
        {
          model: SaleItem,
          as: "items",
          include: [ Product ]
        }
      ]
    });

    if (!venta) return res.status(404).json({ error: "Sale not found" });

    res.json(venta);
  } catch (e) {
    next(e);
  }
});

export default router;
