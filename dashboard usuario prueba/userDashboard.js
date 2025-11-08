// userDashboard.js

// Simulamos que estas reservas vienen del servidor o base de datos
let reservas = [
  { id: 1, hotel: "Hotel Sol", fecha: "2025-11-10" },
  { id: 2, hotel: "Hotel Mar Azul", fecha: "2025-12-05" }
];

// Tomamos elementos del HTML
const listaReservas = document.getElementById("lista-reservas");
const inputHotel = document.getElementById("hotel");
const inputFecha = document.getElementById("fecha");
const btnAgregar = document.getElementById("btn-agregar");

// Función para mostrar las reservas en pantalla
function mostrarReservas() {
  listaReservas.innerHTML = ""; // Limpiamos la lista antes de volver a mostrar
  reservas.forEach(reserva => {
    const li = document.createElement("li");
    li.innerHTML = `
      🏨 <strong>${reserva.hotel}</strong> - 📅 ${reserva.fecha}
      <button onclick="eliminarReserva(${reserva.id})">❌ Cancelar</button>
    `;
    listaReservas.appendChild(li);
  });
}

// Función para agregar una nueva reserva
function agregarReserva() {
  const hotel = inputHotel.value.trim();
  const fecha = inputFecha.value;

  if (hotel === "" || fecha === "") {
    alert("Por favor completa todos los campos antes de agregar.");
    return;
  }

  // Creamos un nuevo objeto de reserva
  const nuevaReserva = {
    id: Date.now(), // genera un id único
    hotel: hotel,
    fecha: fecha
  };

  reservas.push(nuevaReserva); // la agregamos a la lista
  mostrarReservas(); // actualizamos la pantalla

  // Limpiamos los inputs
  inputHotel.value = "";
  inputFecha.value = "";
}

// Función para eliminar una reserva
function eliminarReserva(id) {
  reservas = reservas.filter(r => r.id !== id); // filtramos las que no sean la seleccionada
  mostrarReservas();
}

// Cuando el usuario hace clic en “Agregar reserva”
btnAgregar.addEventListener("click", agregarReserva);

// Mostramos las reservas apenas se carga la página
mostrarReservas();