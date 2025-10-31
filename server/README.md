# Backend

Este directorio contiene el servidor de Node.js y a continuación escribiremos su estructura en la medida que lo hagamos

## Implementado hasta ahora

- Servidor Express funcionando sin romper la logica del front.
- CORS habilitado para permitir fetch desde el frontend local.
- Endpoints /api/products y /api/products/:id funcionando con datos mockeados.
- Soporte de paginación, filtros por tipo y estado (activo/inactivo).
- Se Agrego autenticación básica para el panel admin ruta /login /logout.
- Modelo de User, validaciones y manejo de sesión con express-session.
- Semilla para pruebas con usuario admin@automusic.com / admin123

## Proximo a hacer

1. ABM en la API para que el administrador pueda crear, modificar  y eliminar productos
2. Rutas para Comprar un producto y generar un ticket ( asi se puede finalizar una compra en el carrito)
3. Servir archivos ejs para que exista un front para el administrador y haga todo lo anterior
4. Estadisticas de las ventas
5. Exportar excel con un informe