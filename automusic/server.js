import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import productsApi from "./routes/api.products.js";
import apiSalesRouter from "./routes/api.sales.js";
import cors from "cors";
import session from "express-session";
import { sequelize } from "./models/index.js";
//  import authApi from "./routes/api.auth.js";
import adminRouter from "./routes/admin.js";
import adminProductsApi from "./routes/api.products.admin.js";
import apiAdminSalesRouter from "./routes/api.sales.admin.js";




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares base
app.use(cors({
  origin: true,
  credentials: true // Para cookies si desp usamos sesiones
}));

const PORT = process.env.PORT || 3000;

app.use(express.json()); // para parsear JSON en el body
app.use(express.urlencoded({ extended: true }));

app.use("/css", express.static(path.join(__dirname, "views/admin/css")));
  
// Configuración de EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Sesión (se guarda en las cookies)
app.use(session({
  secret: process.env.SESSION_SECRET || "secreto-de-prueba",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000*60*60 } // dura 1 hora
}));

// API de autenticación para usuarios.
// app.use("/api/auth", authApi);

// Ruta de auth nueva
import authRouter from "./routes/auth.js";
app.use(authRouter);

// API de productos para usuario admin
app.use("/api/admin/products", adminProductsApi); 

// API de productos para usuario final
app.use("/api/products", productsApi);

// Rutas del panel de administración
app.use("/admin", adminRouter);

// API de ventas
app.use("/api/ventas", apiSalesRouter);

// API de ventas para admin
app.use("/api/admin/ventas", apiAdminSalesRouter);

// archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "./public")));

// catch-all (para redirigir rutas no manejadas al index.html del frontend)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Ahora sincronizo con la base de datos y luego levanto el servvidor.
(async () => {
  try {
    await sequelize.sync(); // en dev: crea/actualiza tablas. En prod: migraciones.
    app.listen(PORT, () => console.log(`Servidor levantado en http://localhost:${PORT}`));
  } catch (err) {
    console.error("No se pudo inicializar la DB:", err);
    process.exit(1);
  }
})();