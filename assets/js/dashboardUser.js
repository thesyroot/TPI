const API_USERS_ROOMS  = "https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1";
const API_RESERVATIONS = "https://69125d1d52a60f10c8216e15.mockapi.io/api/v1";

function getCookie(nombre) {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(nombre + "="))
      ?.split("=")[1] || null
  );
}

function deleteCookie(nombre) {
  document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// 0 = pendiente, 1 = confirmada, 2 = cancelada
function getEstadoTexto(estado) {
  const n = Number(estado);
  if (n === 0) return "pendiente";
  if (n === 1) return "confirmada";
  if (n === 2) return "cancelada";
  return "desconocido";
}

function getEstadoBadgeClass(estado) {
  const n = Number(estado);
  if (n === 0) return "badge-warning";
  if (n === 1) return "badge-success";
  if (n === 2) return "badge-danger";
  return "badge-secondary";
}

// Inicio del dashboard
document.addEventListener("DOMContentLoaded", () => {
  const role     = getCookie("role");
  const userId   = getCookie("userId");
  const username = decodeURIComponent(getCookie("username") || "");
  const email    = decodeURIComponent(getCookie("email") || "");

  // Control de acceso: solo rol 2 (USUARIo)
  if (!role || role !== "2" || !userId) {
    window.location.replace("../../login/login.html");
    return;
  }

  // Mostrar datos del usuario
  document.getElementById("userNameSpan").textContent  = username;
  document.getElementById("userEmailSpan").textContent = email;

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    deleteCookie("userId");
    deleteCookie("username");
    deleteCookie("hashedPassword");
    deleteCookie("email");
    deleteCookie("role");
    window.location.replace("../../login/login.html");
  });

  // Carga inicial
  loadRooms();
  loadReservations();

  // Crear reserva
  document
    .getElementById("reservationForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      createReservation(userId);
    });

  // Cancelar reserva (delegación de eventos en la tabla)
  document
    .getElementById("reservationsBody")
    .addEventListener("click", (event) => {
      const btn = event.target.closest(".btn-cancel-reservation");
      if (btn) {
        const id = btn.dataset.id;
        cancelReservation(id);
      }
    });
});

// =============================
// Cargar habitaciones
// =============================
async function loadRooms() {
  const roomsBody  = document.getElementById("roomsBody");
  const roomSelect = document.getElementById("roomSelect");

  roomsBody.innerHTML  = "";
  roomSelect.innerHTML = "";

  try {
    const res   = await fetch(`${API_USERS_ROOMS}/rooms`);
    const rooms = await res.json();

    if (!rooms.length) {
      roomsBody.innerHTML = `
        <tr><td colspan="3">No hay habitaciones cargadas.</td></tr>
      `;
      return;
    }

    rooms.forEach((room) => {
      const disponible = room.disponible === true || room.disponible === "true";

      // Tabla
      roomsBody.innerHTML += `
        <tr>
          <td>${room.tipo}</td>
          <td>$${room.precio}</td>
          <td>
            <span class="badge ${disponible ? "badge-success" : "badge-danger"}">
              ${disponible ? "Sí" : "No"}
            </span>
          </td>
        </tr>
      `;

      // Select solo con las disponibles
      if (disponible) {
        roomSelect.innerHTML += `
          <option value="${room.id}">
            ${room.tipo} - $${room.precio}
          </option>
        `;
      }
    });
  } catch (error) {
    console.error("Error cargando habitaciones:", error);
    alert("Hubo un problema al cargar las habitaciones.");
  }
}

// =============================
// Crear nueva reserva
// =============================
async function createReservation(userIdCookie) {
  const roomId   = document.getElementById("roomSelect").value;
  const checkIn  = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;

  if (!roomId || !checkIn || !checkOut) {
    alert("Completá todos los campos.");
    return;
  }

  if (checkOut <= checkIn) {
    alert("La fecha de salida debe ser posterior a la de entrada.");
    return;
  }

  const nuevaReserva = {
    userId: Number(userIdCookie),  // en MockAPI es Number
    roomId: Number(roomId),        // en MockAPI es Number
    checkIn,
    checkOut,
    estado: 0,                     // 0 = pendiente
  };

  try {
    const res = await fetch(`${API_RESERVATIONS}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaReserva),
    });

    if (!res.ok) throw new Error("Error en la creación de la reserva");

    alert("Reserva creada correctamente.");
    document.getElementById("reservationForm").reset();
    loadReservations();
  } catch (error) {
    console.error("Error creando reserva:", error);
    alert("Hubo un problema al crear la reserva.");
  }
}

// =============================
// Cargar reservas del usuario
// =============================
async function loadReservations() {
  const userId = getCookie("userId");
  if (!userId) return;

  const tbody = document.getElementById("reservationsBody");
  tbody.innerHTML = "";

  try {
    // Reservas del usuario
    const resRes = await fetch(
      `${API_RESERVATIONS}/reservations?userId=${userId}`
    );
    const reservations = await resRes.json();

    if (!reservations.length) {
      tbody.innerHTML = `
        <tr><td colspan="5">No tenés reservas.</td></tr>
      `;
      return;
    }

    // Todas las habitaciones para mapear el nombre
    const resRooms = await fetch(`${API_USERS_ROOMS}/rooms`);
    const rooms    = await resRooms.json();

    reservations.forEach((reserva) => {
      const room = rooms.find((r) => Number(r.id) === Number(reserva.roomId));
      const nombreHabitacion = room ? room.tipo : `Hab. ${reserva.roomId}`;

      const textoEstado  = getEstadoTexto(reserva.estado);
      const claseEstado  = getEstadoBadgeClass(reserva.estado);
      const esCancelada  = Number(reserva.estado) === 2;

      tbody.innerHTML += `
        <tr>
          <td>${nombreHabitacion}</td>
          <td>${reserva.checkIn}</td>
          <td>${reserva.checkOut}</td>
          <td>
            <span class="badge ${claseEstado}">
              ${textoEstado}
            </span>
          </td>
          <td>
            ${
              esCancelada
                ? "-"
                : `<button
                     class="btn btn-sm btn-outline-danger btn-cancel-reservation"
                     data-id="${reserva.id}"
                   >
                     Cancelar
                   </button>`
            }
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Error cargando reservas:", error);
    alert("Hubo un problema al cargar tus reservas.");
  }
}

// =============================
// Cancelar reserva (estado → 2)
// =============================
async function cancelReservation(id) {
  const confirmar = confirm("¿Seguro que querés cancelar esta reserva?");
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_RESERVATIONS}/reservations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: 2 }), // 2 = cancelada
    });

    if (!res.ok) throw new Error("Error al cancelar reserva");

    alert("Reserva cancelada correctamente.");
    loadReservations();
  } catch (error) {
    console.error("Error cancelando reserva:", error);
    alert("Hubo un problema al cancelar la reserva.");
  }
}
