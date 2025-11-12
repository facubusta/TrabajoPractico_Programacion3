// Frontend Principal

let carrito = [];

// Cargar productos desde el backend
async function cargarProductos() {
  const contenedor = document.getElementById("productos");
  if (!contenedor) return;
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

// Renderizar los productos
function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos");
  if (!contenedor) return;
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

// --- CARRITO ---

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

function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
  renderCarrito();
}

function vaciarCarrito() {
  if (carrito.length === 0) return;
  if (!confirm("¿Seguro que querés vaciar el carrito?")) return;
  carrito = [];
  guardarCarrito();
  renderCarrito();
}

function renderCarrito() {
  const lista = document.getElementById("lista-carrito");
  if (!lista) return;
  lista.innerHTML = "";

  let total = 0;
  if (carrito.length === 0) {
    lista.innerHTML = "<li>Carrito vacío</li>";
    document.getElementById("total").textContent = "Total: $0";
    return;
  }

  carrito.forEach(p => {
    total += p.price * p.cantidad;
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.name} x${p.cantidad} — $${(p.price * p.cantidad).toLocaleString("es-AR")}
      <button class="btn-eliminar" title="Eliminar del carrito">✖</button>
    `;
    li.querySelector(".btn-eliminar").addEventListener("click", () => eliminarDelCarrito(p.id));
    lista.appendChild(li);
  });

  document.getElementById("total").textContent = `Total: $${total.toLocaleString("es-AR")}`;
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const data = localStorage.getItem("carrito");
  if (data) carrito = JSON.parse(data);
}

// Ticket (resumen simple)
function generarTicket() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
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

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  renderCarrito();
  cargarProductos();

  const btnTicket = document.getElementById("btn-ticket");
  if (btnTicket) btnTicket.addEventListener("click", generarTicket);

  // ✅ Botón “Vaciar carrito” si querés agregarlo en el HTML
  const btnVaciar = document.getElementById("btn-vaciar");
  if (btnVaciar) btnVaciar.addEventListener("click", vaciarCarrito);
});
