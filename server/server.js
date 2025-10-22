import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Servir contenido estático del frontend, lo tomamos desde la carpeta public, carga por defecto index.html
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Si no le pega a una ruta válida por ahora devolvemos igual index.html para 
// que el frontend maneje el enrutamiento de a que pantalla llevarlo, por ejemplo una de 404.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

// Server escuchando en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`);
});
