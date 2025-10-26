import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import productsApi from "./routes/api.products.js";
import cors from "cors";
import { sequelize } from "./models/index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: true,           
  credentials: false
}));

const PORT = process.env.PORT || 3000;

app.use(express.json()); // para parsear JSON en el body

// API de productos
app.use("/api/products", productsApi);

// archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../frontend/public")));

// catch-all (para redirigir rutas no manejadas al index.html del frontend)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
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