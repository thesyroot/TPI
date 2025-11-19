
const MOCKAPI_ROOMS_URL = 'https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1'; 


const roomsTableBody = document.getElementById('roomsTableBody');
const roomModalElement = document.getElementById('roomModal');
const roomModal = new bootstrap.Modal(roomModalElement);
const roomForm = document.getElementById('roomForm');
const saveRoomBtn = document.getElementById('saveRoomBtn');

async function fetchRooms() {
    try {
        const response = await fetch(MOCKAPI_ROOMS_URL);
        if (!response.ok) throw new Error('Error al cargar las habitaciones.');
        const rooms = await response.json();
        renderRooms(rooms);
    } catch (error) {
        console.error("Error al obtener habitaciones:", error);
        roomsTableBody.innerHTML = `<tr><td colspan="5">Error: No se pudieron cargar los datos de las habitaciones.</td></tr>`;
    }
}

function renderRooms(rooms) {
    roomsTableBody.innerHTML = '';
    if (rooms.length === 0) {
        roomsTableBody.innerHTML = `<tr><td colspan="5">No hay habitaciones registradas.</td></tr>`;
        return;
    }

    rooms.forEach(room => {

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${room.id}</td>
            <td>${room.tipo || 'N/A'}</td> 
            <td>$${(room.precio !== undefined) ? parseFloat(room.precio).toFixed(2) : '0.00'}</td>
            <td>
                <span class="badge ${room.disponible ? 'bg-success' : 'bg-danger'}">
                    ${room.disponible ? 'Sí' : 'No'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editRoom(${room.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRoom(${room.id})">Eliminar</button>
            </td>
        `;
        roomsTableBody.appendChild(row);
    });
}


function resetRoomForm() {
    roomForm.reset();
    document.getElementById('roomId').value = '';
    document.getElementById('roomModalLabel').textContent = 'Crear Nueva Habitación';
    saveRoomBtn.textContent = 'Guardar';
}


async function editRoom(id) {
    try {
        const response = await fetch(`${MOCKAPI_ROOMS_URL}/${id}`);
        if (!response.ok) throw new Error('Habitación no encontrada.');
        const room = await response.json();
        

        document.getElementById('roomId').value = room.id;
        document.getElementById('roomType').value = room.tipo || '';
        document.getElementById('roomPrice').value = room.precio !== undefined ? parseFloat(room.precio) : 0;
        document.getElementById('roomAvailable').checked = room.disponible;
        
        document.getElementById('roomModalLabel').textContent = 'Editar Habitación';
        saveRoomBtn.textContent = 'Actualizar';

        roomModal.show();
    } catch (error) {
        console.error("Error al editar habitación:", error);
        alert('Error al cargar los datos para editar.');
    }
}


async function saveRoom(event) {
    event.preventDefault();

    const id = document.getElementById('roomId').value;
    const tipo = document.getElementById('roomType').value;
    const precio = document.getElementById('roomPrice').value;
    const disponible = document.getElementById('roomAvailable').checked;


    const roomData = { 
        tipo, 
        precio: parseFloat(precio), 
        disponible 
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${MOCKAPI_ROOMS_URL}/${id}` : MOCKAPI_ROOMS_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomData)
        });

        if (!response.ok) throw new Error(`Error al ${id ? 'actualizar' : 'crear'} la habitación.`);

        roomModal.hide();
        fetchRooms();
    } catch (error) {
        console.error("Error al guardar habitación:", error);
        alert(`Error al ${id ? 'actualizar' : 'crear'} la habitación. Intenta de nuevo.`);
    }
}


async function deleteRoom(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta habitación?')) return;

    try {
        const response = await fetch(`${MOCKAPI_ROOMS_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar la habitación.');

        fetchRooms(); 
    } catch (error) {
        console.error("Error al eliminar habitación:", error);
        alert('Error al eliminar la habitación.');
    }
}


window.resetRoomForm = resetRoomForm; 
window.editRoom = editRoom; 
window.deleteRoom = deleteRoom;

document.addEventListener('DOMContentLoaded', () => {

    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!user || user.role !== 'ADMIN') {
        alert('Acceso denegado. Solo para administradores.');

        window.location.href = '../dashboard/dashboard.html'; 
        return;
    }
    
    roomForm.addEventListener('submit', saveRoom);
    fetchRooms();
});