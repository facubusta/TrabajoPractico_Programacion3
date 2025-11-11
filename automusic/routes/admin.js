import { Router } from "express";
import { requireAdminPage } from "../middlewares/auth.js"; // middleware: bloquea si no sos admin

const router = Router();

// GET /admin -> muestra el dashboard del panel
router.get("/", requireAdminPage, (req, res) => {
  const user = req.cookies?.user || null;
  return res.render("admin/index", { user });
});

// GET /admin/productos -> lista productos usando la API de admin
router.get("/productos", requireAdminPage, async (req, res) => {
  try {
    const baseURL = `http://localhost:${process.env.PORT || 3000}`;
    const page = Number(req.query.page) || 1;
    const resp = await fetch(`${baseURL}/api/admin/products?page=${page}`, {
      headers: { cookie: req.headers.cookie || "" }
    });
    if (!resp.ok) throw new Error(`API admin products ${resp.status}`);
    const data = await resp.json();
    const productos = Array.isArray(data) ? data : (data.data || []);
    return res.render("admin/productos", { productos, error: null });
  } catch (err) {
    console.error("Error admin productos:", err);
    return res.render("admin/productos", { productos: [], error: "No se pudieron cargar los productos" });
  }
});


// ---------- NUEVO PRODUCTO ----------

// GET /admin/productos/nuevo -> muestra el formulario de alta
router.get("/productos/nuevo", requireAdminPage, (req, res) => {
  return res.render("admin/productos_nuevo", { error: null, values: {} });
});

// POST /admin/productos/nuevo -> crea un producto nuevo vía API admin
router.post("/productos/nuevo", requireAdminPage, async (req, res) => {
  try {
    const { name, type, price, active } = req.body;

    if (!name || !price) {
      return res.status(400).render("admin/productos_nuevo", {
        error: "Nombre y precio son obligatorios",
        values: { name, type, price, active }
      });
    }

    const payload = {
      name: String(name).trim(),
      type: type ? String(type).trim() : null,
      price: Number(price),
      active: active === "on" || active === true
    };

    const baseURL = `http://localhost:${process.env.PORT || 3000}`;
    const resp = await fetch(`${baseURL}/api/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.cookie || ""
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Alta producto API ADMIN error:", resp.status, text);
      return res.status(400).render("admin/productos_nuevo", {
        error: "No se pudo crear el producto (revisá la API)",
        values: { name, type, price, active }
      });
    }

    return res.redirect("/admin/productos");
  } catch (err) {
    console.error("Error en alta de producto:", err);
    return res.status(500).render("admin/productos_nuevo", {
      error: "Error inesperado en el servidor",
      values: req.body || {}
    });
  }
});


// ---------- EDITAR PRODUCTO ----------

// GET /admin/productos/:id/editar -> carga datos y muestra el form de edición
router.get("/productos/:id/editar", requireAdminPage, async (req, res) => {
  try {
    const { id } = req.params;
    const baseURL = `http://localhost:${process.env.PORT || 3000}`;
    const resp = await fetch(`${baseURL}/api/admin/products/${id}`, {
      headers: { cookie: req.headers.cookie || "" }
    });
    if (!resp.ok) {
      return res.status(404).render("admin/productos", {
        productos: [],
        error: "Producto no encontrado"
      });
    }
    const product = await resp.json();
    return res.render("admin/productos_editar", { product, error: null });
  } catch (err) {
    console.error("GET editar producto:", err);
    return res.status(500).render("admin/productos", {
      productos: [],
      error: "Error cargando producto"
    });
  }
});

// POST /admin/productos/:id/editar -> guarda los cambios del producto vía API admin
router.post("/productos/:id/editar", requireAdminPage, async (req, res) => {
  try {
    const { id } = req.params;

    const payload = {
      name:  (req.body.name   ?? req.body.nombre)?.trim(),
      type:  (req.body.type   ?? req.body.tipo)?.trim() || null,
      price: Number(req.body.price ?? req.body.precio),
      active: (req.body.active === "on") || req.body.active === true || String(req.body.active) === "true"
    };

    if (!payload.name || Number.isNaN(payload.price)) {
      const baseURL = `http://localhost:${process.env.PORT || 3000}`;
      const resp = await fetch(`${baseURL}/api/admin/products/${id}`, {
        headers: { cookie: req.headers.cookie || "" }
      });
      const productOriginal = resp.ok ? await resp.json() : { id };
      return res.status(400).render("admin/productos_editar", {
        product: { ...productOriginal, ...payload },
        error: "Nombre y precio son obligatorios"
      });
    }

    const baseURL = `http://localhost:${process.env.PORT || 3000}`;
    const resp = await fetch(`${baseURL}/api/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.cookie || ""
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error("PUT producto API ADMIN error:", resp.status, txt);
      return res.status(400).render("admin/productos_editar", {
        product: { id, ...payload },
        error: "No se pudo actualizar el producto"
      });
    }

    return res.redirect("/admin/productos");
  } catch (err) {
    console.error("POST editar producto:", err);
    return res.status(500).render("admin/productos_editar", {
      product: { id: req.params.id, ...(req.body || {}) },
      error: "Error inesperado en el servidor"
    });
  }
});


// ---------- ELIMINAR / ACTIVAR / DESACTIVAR ----------

// POST /admin/productos/:id/desactivar -> desactiva (baja lógica) y vuelve al listado
router.post("/productos/:id/desactivar", requireAdminPage, async (req, res) => {
  try {
    const baseURL = `http://localhost:${process.env.PORT || 3000}`;
    const { id } = req.params;

    await fetch(`${baseURL}/api/admin/products/${id}/deactivate`, {
      method: "POST",
      headers: { cookie: req.headers.cookie || "" }
    });

    return res.redirect("/admin/productos");
  } catch (err) {
    console.error("POST desactivar producto:", err);
    return res.redirect("/admin/productos");
  }
});

// POST /admin/productos/:id/activar -> reactiva el producto y vuelve al listado
router.post("/productos/:id/activar", requireAdminPage, async (req, res) => {
  try {
    const baseURL = `http://localhost:${process.env.PORT || 3000}`;
    const { id } = req.params;

    await fetch(`${baseURL}/api/admin/products/${id}/activate`, {
      method: "POST",
      headers: { cookie: req.headers.cookie || "" }
    });

    return res.redirect("/admin/productos");
  } catch (err) {
    console.error("POST activar producto:", err);
    return res.redirect("/admin/productos");
  }
});

// POST /admin/productos/:id/eliminar -> elimina físico y vuelve al listado
router.post("/productos/:id/eliminar", requireAdminPage, async (req, res) => {
  try {
    const baseURL = `http://localhost:${process.env.PORT || 3000}`;
    const { id } = req.params;

    await fetch(`${baseURL}/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { cookie: req.headers.cookie || "" }
    });

    return res.redirect("/admin/productos");
  } catch (err) {
    console.error("POST eliminar producto:", err);
    return res.redirect("/admin/productos");
  }
});

export default router;
