// Frontend Principal - Carrito mejorado
let carrito = [];

// 🧭 Cargar productos desde el backend
async function cargarProductos() {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "<p>Cargando productos...</p>";

  try {
    const res = await fetch("http://localhost:3000/api/products");
    if (!res.ok) throw new Error("Error al obtener productos del servidor");

    const data = await res.json();
    const productos = data.data || data;
    mostrarProductos(productos);
  } catch (err) {
    console.error("Error:", err.message);
    contenedor.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// 🧩 Renderizar los productos
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

    card.querySelector(".btn-comprar").addEventListener("click", () => agregarAlCarrito(prod));
    contenedor.appendChild(card);
  });
}

// 🛒 Agregar al carrito
function agregarAlCarrito(producto) {
  const existente = carrito.find(p => p.id === producto.id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ id: producto.id, name: producto.name, price: producto.price, cantidad: 1 });
  }
  guardarCarrito();
  renderCarrito();
}

// 🧾 Renderizar carrito
function renderCarrito() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((p, i) => {
    total += p.price * p.cantidad;

    const li = document.createElement("li");
    li.innerHTML = `
      ${p.name} — $${(p.price * p.cantidad).toLocaleString("es-AR")}  
      <button class="menos">➖</button>
      <span>${p.cantidad}</span>
      <button class="mas">➕</button>
      <button class="eliminar">❌</button>
    `;

    // Eventos individuales
    li.querySelector(".menos").addEventListener("click", () => cambiarCantidad(i, -1));
    li.querySelector(".mas").addEventListener("click", () => cambiarCantidad(i, 1));
    li.querySelector(".eliminar").addEventListener("click", () => eliminarDelCarrito(i));

    lista.appendChild(li);
  });

  document.getElementById("total").textContent = `Total: $${total.toLocaleString("es-AR")}`;
}

// ➕➖ Cambiar cantidad
function cambiarCantidad(indice, delta) {
  carrito[indice].cantidad += delta;
  if (carrito[indice].cantidad <= 0) carrito.splice(indice, 1);
  guardarCarrito();
  renderCarrito();
}

// ❌ Eliminar un producto
function eliminarDelCarrito(indice) {
  carrito.splice(indice, 1);
  guardarCarrito();
  renderCarrito();
}

// 🧹 Vaciar carrito completo
function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  renderCarrito();
}

// 💾 Persistencia
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const data = localStorage.getItem("carrito");
  if (data) carrito = JSON.parse(data);
}

// 🎟️ Ticket
function generarTicket() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let mensaje = "🧾 Ticket AutoMusic\n\n";
  let total = 0;

  carrito.forEach(p => {
    mensaje += `${p.name} x${p.cantidad} — $${(p.price * p.cantidad).toLocaleString("es-AR")}\n`;
    total += p.price * p.cantidad;
  });
  mensaje += `\nTotal: $${total.toLocaleString("es-AR")}`;
  alert(mensaje);
}

// 🚀 Inicialización
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  renderCarrito();
  cargarProductos();

  document.getElementById("btn-ticket").addEventListener("click", generarTicket);

  // Botón para vaciar carrito
  const btnVaciar = document.createElement("button");
  btnVaciar.textContent = "Vaciar carrito";
  btnVaciar.style.marginTop = "10px";
  btnVaciar.addEventListener("click", vaciarCarrito);
  document.getElementById("carrito").appendChild(btnVaciar);
});
