

const MOCKAPI_BASE_URL = 'https://69125d1d52a60f10c8216e15.mockapi.io/api/v1'; 
const reservationsTableBody = document.getElementById('reservationsTableBody');


async function fetchData() {
    try {
        const [reservationsRes, usersRes, roomsRes] = await Promise.all([
            fetch(`${MOCKAPI_BASE_URL}/reservations`),
            fetch(`https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1/users`),
            fetch(`https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1/rooms`)
        ]);

        if (!reservationsRes.ok || !usersRes.ok || !roomsRes.ok) {
            throw new Error('Error al cargar uno o más recursos de MockAPI.');
        }

        const reservations = await reservationsRes.json();
        const users = await usersRes.json();
        const rooms = await roomsRes.json();

        renderReservations(reservations, users, rooms);

    } catch (error) {
        console.error("Error al obtener datos:", error);
        reservationsTableBody.innerHTML = `<tr><td colspan="7">Error: ${error.message}</td></tr>`;
    }
}

function renderReservations(reservations, users, rooms) {
    reservationsTableBody.innerHTML = '';
    if (reservations.length === 0) {
        reservationsTableBody.innerHTML = `<tr><td colspan="7">No hay reservas registradas.</td></tr>`;
        return;
    }

    const userMap = new Map(users.map(user => [parseInt(user.id), user]));
    const roomMap = new Map(rooms.map(room => [parseInt(room.id), room]));

    reservations.forEach(reservation => {
        const user = userMap.get(reservation.userId) || { nombre: 'Usuario Eliminado' };
        const room = roomMap.get(reservation.roomId) || { tipo: 'Habitación Desconocida' };
        
        const statusClass = {
            2: 'bg-warning',
            1: 'bg-success',
            3: 'bg-danger'
        }[reservation.estado] || 'bg-secondary';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reservation.id}</td>
            <td>${user.name}</td>
            <td>${room.tipo}</td>
            <td>${reservation.checkIn}</td>
            <td>${reservation.checkOut}</td>
            <td>
                <span class="badge ${statusClass}">${reservation.estado}</span>
            </td>
            <td>
                <select class="form-select form-select-sm" onchange="updateReservationStatus(${reservation.id}, this.value)">
                    <option value="Pendiente" ${reservation.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="Confirmada" ${reservation.estado === 'Confirmada' ? 'selected' : ''}>Confirmada</option>
                    <option value="Cancelada" ${reservation.estado === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
                </select>
            </td>
        `;
        reservationsTableBody.appendChild(row);
    });
}


async function updateReservationStatus(id, newStatus) {
    if (!confirm(`¿Estás seguro de cambiar el estado de la reserva ${id} a ${newStatus}?`)) return;

    try {
        const response = await fetch(`${MOCKAPI_BASE_URL}/reservations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: newStatus })
        });

        if (!response.ok) throw new Error('Error al actualizar el estado.');

        alert('Estado de reserva actualizado con éxito.');
        fetchData(); 
    } catch (error) {
        console.error("Error al actualizar reserva:", error);
        alert('Error al actualizar el estado de la reserva.');
    }
}


window.updateReservationStatus = updateReservationStatus; 

document.addEventListener('DOMContentLoaded', () => {
    
    const user = {
            nombre: getCookie("username"),
            email: getCookie("email"),
            role: getCookie("role")
        };

    if (!user || user.role != 1) {
        alert('Acceso denegado. Solo para administradores.');
        window.location.href = '../dashboard/dashboard.html'; 
        return;
    }
    
    fetchData(); 
});

function getCookie(nombre) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(nombre + "="))
    ?.split("=")[1] || null;
}