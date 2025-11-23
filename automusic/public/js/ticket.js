// js/ticket.js

document.addEventListener("DOMContentLoaded", () => {
  const spanCliente = document.getElementById("ticket-cliente");
  const spanFecha   = document.getElementById("ticket-fecha");
  const tbodyItems  = document.getElementById("ticket-items");
  const spanTotal   = document.getElementById("ticket-total");
  const btnPDF      = document.getElementById("btn-descargar-pdf");
  const btnInicio   = document.getElementById("btn-volver-inicio");
  const msg         = document.getElementById("ticket-mensaje");

  // 1) Nombre del cliente
  const nombre = localStorage.getItem("clienteNombre");
  if (!nombre) {
    spanCliente.textContent = "(sin nombre)";
  } else {
    spanCliente.textContent = nombre;
  }

  // 2) Fecha actual
  const ahora = new Date();
  const fechaFormateada = ahora.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  spanFecha.textContent = fechaFormateada;

  // 3) Cargar carrito desde localStorage
  const dataCarrito = localStorage.getItem("carrito");
  let carrito = [];
  if (dataCarrito) {
    carrito = JSON.parse(dataCarrito);
  }

  if (!carrito.length) {
    tbodyItems.innerHTML = `
      <tr><td colspan="4">No hay productos en el carrito.</td></tr>
    `;
    spanTotal.textContent = "$0";
  } else {
    let total = 0;

    carrito.forEach(item => {
      const subtotal = item.price * item.cantidad;
      total += subtotal;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.cantidad}</td>
        <td>$${item.price.toLocaleString("es-AR")}</td>
        <td>$${subtotal.toLocaleString("es-AR")}</td>
      `;
      tbodyItems.appendChild(tr);
    });

    spanTotal.textContent = "$" + total.toLocaleString("es-AR");
  }

  // 4) Botón Descargar PDF (por ahora: usar imprimir, que permite guardar como PDF)
  if (btnPDF) {
    btnPDF.addEventListener("click", () => {
      msg.textContent = "Usá la opción 'Guardar como PDF' en el diálogo de impresión.";
      window.print();
    });
  }

  // 5) Volver a inicio: limpiar carrito y nombre, y volver a la bienvenida
  if (btnInicio) {
    btnInicio.addEventListener("click", () => {
      localStorage.removeItem("carrito");
      localStorage.removeItem("clienteNombre");
      window.location.href = "index.html";
    });
  }
});
