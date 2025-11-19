
const MOCKAPI_BASE_URL = 'https://69125d1d52a60f10c8216e15.mockapi.io/api/v1/'; 
const API_URL = `${MOCKAPI_BASE_URL}/reservations`; 
const ROOMS_URL = `https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1/rooms`;     
const USERS_URL = `https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1/users`;     


let roomsCache = {};
let usersCache = {};


function initializePage() {
    const user = {
            nombre: getCookie("username"),
            email: getCookie("email"),
            role: getCookie("role")
        };

    
    if (!user || user.role != 1) {
        alert('Acceso denegado. Solo administradores pueden ver esta página.');
        // window.location.href = '../dashboard.html';
        return;
    }

    
    loadDataAndReservations();
}


async function loadDataAndReservations() {
    const messageDiv = document.getElementById('reservationsMessage');
    messageDiv.innerHTML = '<div class="alert alert-info">Cargando datos (habitaciones y usuarios)...</div>';
    
    try {
        
        const roomsResponse = await fetch(ROOMS_URL);
        const rooms = await roomsResponse.json();
        [...rooms].forEach(r => roomsCache[r.id] = r);
        
        
        const usersResponse = await fetch(USERS_URL);
        const users = await usersResponse.json();
        console.log(users);
        [...users].forEach(u => usersCache[u.id] = u);

        messageDiv.innerHTML = '';
        loadReservations(); 
    } catch (error) {
        console.error("Error al cargar datos auxiliares:", error);
        messageDiv.innerHTML = `<div class="alert alert-danger">Error al cargar datos auxiliares: ${error.message}</div>`;
    }
}

function getEstadoTexto(estado) {
  const n = Number(estado);
  if (n === 0) return "pendiente";
  if (n === 1) return "confirmada";
  if (n === 2) return "cancelada";
  return "desconocido";
}


async function loadReservations() {
    const reservationsBody = document.getElementById('allReservationsBody');
    reservationsBody.innerHTML = '<tr><td colspan="7" class="text-center">Cargando reservas...</td></tr>';
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar la lista de reservas.');
        
        const reservations = await response.json();
        
        
        reservations.sort((a, b) => b.id - a.id); 
        
        renderReservationsTable(reservations);
    } catch (error) {
        console.error("Error al cargar reservas:", error);
        reservationsBody.innerHTML = `<tr><td colspan="7" class="text-danger text-center">Error: ${error.message}</td></tr>`;
    }
}

function renderReservationsTable(reservations) {
    const reservationsBody = document.getElementById('allReservationsBody');
    reservationsBody.innerHTML = ''; 
    
    if (reservations.length === 0) {
        reservationsBody.innerHTML = '<tr><td colspan="7" class="text-center">No hay reservas registradas.</td></tr>';
        return;
    }

    reservations.forEach(reservation => {
        const room = roomsCache[reservation.roomId] || { tipo: 'Desconocida', id: reservation.roomId };
        const user = usersCache[reservation.userId] || { nombre: 'Desconocido', email: 'N/A' };
        const statusClass = getStatusClass(reservation.estado);
        // console.log(reservation);

        const row = reservationsBody.insertRow();
        row.innerHTML = `
            <td>${reservation.id}</td>
            <td>${user.name} (${user.email})</td>
            <td>${room.tipo} (${reservation.roomId})</td>
            <td>${reservation.checkIn}</td>
            <td>${reservation.checkOut}</td>
            <td><span class="badge ${statusClass}">${getEstadoTexto(reservation.estado)}</span></td>
            <td>
                ${getEstadoTexto(reservation.estado) == 'pendiente' ? `
                    <button class="btn btn-success btn-sm action-btn" data-id="${reservation.id}" data-action="CONFIRMADA">
                        <i class="mdi mdi-check"></i> Confirmar
                    </button>
                    <button class="btn btn-danger btn-sm action-btn" data-id="${reservation.id}" data-action="CANCELADA">
                        <i class="mdi mdi-close"></i> Cancelar
                    </button>
                ` : `
                    <span class="text-muted">Finalizada</span>
                `}
            </td>
        `;
    });

    
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const action = e.currentTarget.getAttribute('data-action');
            updateReservationStatus(id, action);
        });
    });
}

function getStatusClass(status) {
    switch (status) {
        case 1: return 'badge-success';
        case 2: return 'badge-danger';
        case 3: return 'badge-warning';
        default: return 'badge-secondary';
    }
}


async function updateReservationStatus(reservationId, newStatus) {
    const messageDiv = document.getElementById('reservationsMessage');
    
    if (!confirm(`¿Estás seguro de cambiar el estado de la reserva ${reservationId} a ${newStatus}?`)) {
        return;
    }

    messageDiv.innerHTML = `<div class="alert alert-info">Actualizando reserva ${reservationId} a ${newStatus}...</div>`;
    
    try {
        const response = await fetch(`${API_URL}/${reservationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: newStatus }) 
        });

        if (!response.ok) throw new Error('Error al actualizar el estado de la reserva.');
        
        messageDiv.innerHTML = `<div class="alert alert-success">Reserva ${reservationId} actualizada a ${newStatus} exitosamente.</div>`;
        loadReservations();

    } catch (error) {
        console.error("Error al actualizar reserva:", error);
        messageDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}



document.addEventListener('DOMContentLoaded', initializePage);

function getCookie(nombre) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(nombre + "="))
    ?.split("=")[1] || null;
}