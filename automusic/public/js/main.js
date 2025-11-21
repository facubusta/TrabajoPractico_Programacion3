// ---------- Estado global ----------
let carrito = [];
let productosOriginales = [];

// ---------- Productos ----------
async function cargarProductos() {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "<p>Cargando productos...</p>";

  try {
    const res = await fetch("http://localhost:3000/api/products");
    if (!res.ok) throw new Error("Error al obtener productos del servidor");

    const data = await res.json();
    const productos = data.data || data;

    productosOriginales = productos;
    mostrarProductos(productos);

  } catch (err) {
    console.error("Error:", err.message);
    contenedor.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  productos.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("producto");

    card.innerHTML = `
      <img src="${prod.imagePath}" alt="${prod.name}" />
      <h3>${prod.name}</h3>
      <p>Precio: $${prod.price.toLocaleString("es-AR")}</p>
      <button class="btn-comprar">Agregar al carrito</button>
    `;

    card.querySelector(".btn-comprar")
      .addEventListener("click", () => agregarAlCarrito(prod));

    contenedor.appendChild(card);
  });
}

function filtrar(tipo) {
  if (tipo === "todo") {
    mostrarProductos(productosOriginales);
    return;
  }

  const filtrados = productosOriginales.filter(p => p.type === tipo);
  mostrarProductos(filtrados);
}

// ---------- Carrito ----------
function agregarAlCarrito(producto) {
  const existente = carrito.find(p => p.id === producto.id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      name: producto.name,
      price: producto.price,
      cantidad: 1
    });
  }

  guardarCarrito();
  renderCarrito();
  actualizarCarritoCount();
  mostrarNotificacion(producto.name + " agregado al carrito");
}

function renderCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalElement = document.getElementById("total");

  if (!lista || !totalElement) return;

  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((p, i) => {
    total += p.price * p.cantidad;

    const li = document.createElement("li");
    li.innerHTML = `
      ${p.name} — $${(p.price * p.cantidad).toLocaleString("es-AR")}
      <button class="menos">−</button>
      <span>${p.cantidad}</span>
      <button class="mas">+</button>
      <button class="eliminar">x</button>
    `;

    li.querySelector(".menos")
      .addEventListener("click", () => cambiarCantidad(i, -1));

    li.querySelector(".mas")
      .addEventListener("click", () => cambiarCantidad(i, 1));

    li.querySelector(".eliminar")
      .addEventListener("click", () => eliminarDelCarrito(i));

    lista.appendChild(li);
  });

  totalElement.textContent =
    "Total: $" + total.toLocaleString("es-AR");
}

function cambiarCantidad(indice, delta) {
  carrito[indice].cantidad += delta;

  if (carrito[indice].cantidad <= 0) {
    carrito.splice(indice, 1);
  }

  guardarCarrito();
  renderCarrito();
  actualizarCarritoCount();
}

function eliminarDelCarrito(indice) {
  carrito.splice(indice, 1);
  guardarCarrito();
  renderCarrito();
  actualizarCarritoCount();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  renderCarrito();
  actualizarCarritoCount();
}

// ---------- Persistencia ----------
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const data = localStorage.getItem("carrito");
  if (data) carrito = JSON.parse(data);
}

// ---------- Ticket ----------
function generarTicket() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let mensaje = "Ticket AutoMusic\n\n";
  let total = 0;

  carrito.forEach(p => {
    mensaje += `${p.name} x${p.cantidad} — $${(p.price * p.cantidad)
      .toLocaleString("es-AR")}\n`;
    total += p.price * p.cantidad;
  });

  mensaje += `\nTotal: $${total.toLocaleString("es-AR")}`;

  alert(mensaje);
}

// ---------- Inicialización ----------
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  actualizarCarritoCount();
  renderCarrito();
  cargarProductos();

  // Abrir carrito
  document.getElementById("btn-carrito")
    .addEventListener("click", () => {
      document.getElementById("carrito-sidebar").classList.add("open");
      document.getElementById("overlay").classList.add("show");
    });

  // Cerrar carrito
  document.getElementById("cerrar-carrito")
    .addEventListener("click", () => {
      document.getElementById("carrito-sidebar").classList.remove("open");
      document.getElementById("overlay").classList.remove("show");
    });

  // Cerrar clic afuera
  document.getElementById("overlay")
    .addEventListener("click", () => {
      document.getElementById("carrito-sidebar").classList.remove("open");
      document.getElementById("overlay").classList.remove("show");
    });
});

// ---------- Buscador ----------
function buscarProductos() {
  const texto = document.getElementById("search").value.toLowerCase();
  const filtrados = productosOriginales.filter(p =>
    p.name.toLowerCase().includes(texto)
  );
  mostrarProductos(filtrados);
}

// ---------- Contador ----------
function actualizarCarritoCount() {
  const count = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  document.getElementById("carrito-count").textContent = count;
}

// ---------- Notificación ----------
function mostrarNotificacion(texto) {
  const notif = document.getElementById("notificacion");
  notif.textContent = texto;

  notif.classList.add("show");
  setTimeout(() => notif.classList.remove("show"), 1500);
}