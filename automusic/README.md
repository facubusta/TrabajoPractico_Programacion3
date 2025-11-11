# Automusic — Backend (TP Integrador Para Prog III)

Backend en **Node.js + Express + Sequelize (SQLite)** con **sesiones** y **rutas protegidas**.  
Expone una **API pública** de productos y una **API de administración** separada, protegida por sesión.

---

## Tecnologías

- Node.js 18+  
- npm 9+
- (Sin DB externa) SQLite se crea como archivo local llamado database-sqlite

---

## Instalación y ejecución

```bash
npm install
npm run dev      # nodemon (desarrollo)
# o
npm start        # node server.js (producción)
```

---
## Estructura del proyecto (Faltan agregar cosas)

automusic/
├─ models/
│  └─ Product.js
├─ routes/
│  ├─ api.products.js          # API pública
│  ├─ api.products.admin.js    # API admin (protegida)
│  ├─ admin.js                 # Rutas para traerse las vistas del admin 
│  └─ auth.js                  # Login/logout (sesión)
├─ middlewares/
│  ├─ auth.js                  # isAuth / requireAdminPage
├─ views/                      # EJS del panel/login
├─ public/                     # Front público (si aplica)
├─ server.js                   # App Express archivo principal


## Proximo a hacer (Backend)

1. ABM de las ventas de productos.
3. Crear front para el administrador para visualizar las ventas
4. Estadisticas de las ventas
5. Exportar excel con un informe
6. Validación de rutas completa (revisar todo por las dudas)