import { Router } from "express";
import { Sale } from "../models/Sale.js";
import { SaleItem } from "../models/SaleItem.js";

const router = Router();

// POST /api/ventas -> Crear una venta desde el front público
router.post("/", async (req, res, next) => {
  try {
    const { cliente, total, items } = req.body || {};

    if (!cliente || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "cliente e items son obligatorios" });
    }

    // Validar algo de los items
    const parsedItems = items.map((it) => ({
      productId: Number(it.id),
      cantidad: Number(it.cantidad),
      price: Number(it.price)
    }));

    if (parsedItems.some(it => !it.productId || !it.cantidad || it.cantidad <= 0 || Number.isNaN(it.price))) {
      return res.status(400).json({ error: "items inválidos" });
    }

    // Recalcular el total en el backend
    let totalCalculado = 0;
    parsedItems.forEach(it => {
      totalCalculado += it.price * it.cantidad;
    });


    // Crear la venta + items en una transacción
    const sale = await Sale.sequelize.transaction(async (t) => {
      const nuevaVenta = await Sale.create(
        {
          cliente: String(cliente).trim(),
          total: totalCalculado
        },
        { transaction: t }
      );

      const itemsToCreate = parsedItems.map(it => ({
        saleId: nuevaVenta.id,
        productId: it.productId,
        cantidad: it.cantidad,
        price: it.price
      }));

      await SaleItem.bulkCreate(itemsToCreate, { transaction: t });

      return nuevaVenta;
    });

    // Podemos devolver la venta con items (si queremos)
    const ventaConItems = await Sale.findByPk(sale.id, {
      include: [{ model: SaleItem, as: "items" }]
    });

    return res.status(201).json(ventaConItems);
  } catch (e) {
    next(e);
  }
});

export default router;
