// ------------------------------
// VARIABLES GLOBALES
// ------------------------------
let productos = [];
let carrito = [];

// ------------------------------
// FUNCIÓN: Cargar productos
// Descripción: Simula obtener los productos (por ahora local, luego con fetch al backend).
// ------------------------------
function cargarProductos() {
  productos = [
    { id: 1, nombre: "Guitarra Fender", precio: 250000 },
    { id: 2, nombre: "Batería Yamaha", precio: 420000 },
    { id: 3, nombre: "Cable Jack 3m", precio: 8000 },
    { id: 4, nombre: "Micrófono Shure", precio: 95000 }
  ];
  mostrarProductos();
}

// ------------------------------
// FUNCIÓN: Mostrar productos
// Descripción: Genera dinámicamente las tarjetas de producto en el catálogo.
// ------------------------------
function mostrarProductos() {
  const catalogo = document.querySelector("#catalogo");
  catalogo.innerHTML = "";

  productos.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("producto");
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>Precio: $${p.precio}</p>
      <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
    `;
    catalogo.appendChild(card);
  });
}

// ------------------------------
// FUNCIÓN: Agregar al carrito
// Descripción: Busca un producto por ID y lo agrega al array carrito.
// ------------------------------
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (producto) {
    carrito.push(producto);
    mostrarCarrito();
  }
}

// ------------------------------
// FUNCIÓN: Mostrar carrito
// Descripción: Renderiza los productos agregados en el <aside>.
// ------------------------------
function mostrarCarrito() {
  const lista = document.querySelector("#lista-carrito");
  const total = document.querySelector("#total");
  lista.innerHTML = "";

  carrito.forEach(p => {
    const item = document.createElement("li");
    item.textContent = `${p.nombre} - $${p.precio}`;
    lista.appendChild(item);
  });

  const totalCompra = carrito.reduce((acc, p) => acc + p.precio, 0);
  total.textContent = `Total: $${totalCompra}`;
}

// ------------------------------
// FUNCIÓN: Generar ticket
// Descripción: Muestra el resumen del carrito (total y fecha).
// ------------------------------
function generarTicket() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);
  const fecha = new Date().toLocaleString();

  const ticket = `
🧾 AUTO MUSIC - Ticket
Fecha: ${fecha}
Total: $${total}
----------------------------
Gracias por tu compra!
  `;

  alert(ticket);
}

// ------------------------------
// EVENTO: Botón "Generar Ticket"
// ------------------------------
document.querySelector("#btn-ticket").addEventListener("click", generarTicket);

// ------------------------------
// EJECUCIÓN INICIAL
// ------------------------------
cargarProductos();
