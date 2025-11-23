document.addEventListener("DOMContentLoaded", () => {
  const inputNombre = document.getElementById("nombre-cliente");
  const form = document.getElementById("form-bienvenida");
  const mensajeSaludo = document.getElementById("mensaje-saludo");

  // Si ya tenemos un nombre guardado, lo mostramos y lo precargamos
  const nombreGuardado = localStorage.getItem("clienteNombre");
  if (nombreGuardado) {
    if (mensajeSaludo) {
      mensajeSaludo.textContent =
        `Hola de nuevo, ${nombreGuardado}. Cuando quieras, podés continuar con tu compra.`;
    }
    if (inputNombre) {
      inputNombre.value = nombreGuardado;
    }
  }

  if (!form || !inputNombre) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    if (!nombre) {
      alert("Por favor, ingresá tu nombre para continuar.");
      inputNombre.focus();
      return;
    }

    // Guardamos el nombre en localStorage
    localStorage.setItem("clienteNombre", nombre);

    // Redirigimos a la página de productos
    window.location.href = "productos.html";
  });
});
