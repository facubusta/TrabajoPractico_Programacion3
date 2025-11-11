// Función principal que carga los productos desde el backend
async function cargarProductos() {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "<p>Cargando productos...</p>";

  try {
    const res = await fetch("http://localhost:3000/api/products");
    if (!res.ok) throw new Error("Error al obtener productos del servidor");

    const data = await res.json();
    const productos = data.data || data; // soporte tanto para mock como para respuesta real
    mostrarProductos(productos);
  } catch (err) {
    console.error("Error:", err.message);
    contenedor.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// Función que muestra los productos en el DOM
function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = ""; // Limpia antes de renderizar

  productos.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("producto");

    card.innerHTML = `
      <img src="${prod.imagePath}" alt="${prod.name}" />
      <h3>${prod.name}</h3>
      <p>Precio: $${prod.price.toLocaleString("es-AR")}</p>
      <button class="btn-comprar">Agregar al carrito</button>
    `;

    contenedor.appendChild(card);
  });
}

// Inicializa la carga al abrir la página
cargarProductos();
