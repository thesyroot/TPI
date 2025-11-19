
const MOCKAPI_BASE_URL = 'https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1/'; 
const API_URL = `${MOCKAPI_BASE_URL}/rooms`; 

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

    
    loadRooms();

    document.getElementById('createRoomForm').addEventListener('submit', handleCreateRoom);
    document.getElementById('editRoomForm').addEventListener('submit', handleEditRoom);

    
}

async function loadRooms() {
    const roomsBody = document.getElementById('roomsBody');
    roomsBody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando habitaciones...</td></tr>';
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar la lista de habitaciones.');
        
        const rooms = await response.json();
        renderRoomsTable(rooms);
    } catch (error) {
        console.error("Error al cargar habitaciones:", error);
        roomsBody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Error: ${error.message}</td></tr>`;
    }
}

function renderRoomsTable(rooms) {
    const roomsBody = document.getElementById('roomsBody');
    roomsBody.innerHTML = ''; 
    
    if (rooms.length === 0) {
        roomsBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay habitaciones registradas.</td></tr>';
        return;
    }

    rooms.forEach(room => {
        const row = roomsBody.insertRow();
        row.innerHTML = `
            <td>${room.id}</td>
            <td>${room.tipo || 'N/A'}</td>
            <td>$${parseFloat(room.precio).toFixed(2) || 'N/A'}</td>
            <td>${room.descripcion || 'Sin descripción'}</td>
            <td>
                <button class="btn btn-warning btn-sm edit-room-btn" 
                        data-room='${JSON.stringify(room).replace(/'/g, "&apos;")}'
                >
                    <i class="mdi mdi-pencil"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm delete-room-btn" data-room-id="${room.id}">
                    <i class="mdi mdi-delete"></i> Eliminar
                </button>
            </td>
        `;
    });

    
    document.querySelectorAll('.edit-room-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            
            const roomData = JSON.parse(e.currentTarget.getAttribute('data-room'));
            showEditRoomModal(roomData);
        });
    });

    
    document.querySelectorAll('.delete-room-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const roomId = e.currentTarget.getAttribute('data-room-id');
            handleDeleteRoom(roomId);
        });
    });
}


async function handleCreateRoom(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('createRoomMessage');
    messageDiv.innerHTML = '<div class="alert alert-info">Creando habitación...</div>';

    const newRoom = {
        tipo: document.getElementById('newRoomType').value,
        precio: parseFloat(document.getElementById('newRoomPrice').value),
        descripcion: document.getElementById('newRoomDescription').value,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRoom)
        });

        if (!response.ok) throw new Error('Error al crear la habitación.');
        
        document.getElementById('createRoomForm').reset();
        messageDiv.innerHTML = '<div class="alert alert-success">Habitación creada exitosamente.</div>';
        loadRooms(); // Recargar la lista
    } catch (error) {
        console.error("Error al crear habitación:", error);
        messageDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}


function showEditRoomModal(room) {
    document.getElementById('modalRoomId').value = room.id;
    document.getElementById('modalRoomType').value = room.tipo;
    document.getElementById('modalRoomPrice').value = room.precio;
    document.getElementById('modalRoomDescription').value = room.descripcion;
    document.getElementById('editRoomModalLabel').textContent = `Editar Habitación ID: ${room.id}`;
    document.getElementById('editRoomMessage').innerHTML = '';
    
   
    $('#editRoomModal').modal('show'); 
}

async function handleEditRoom(e) {
    e.preventDefault();
    const roomId = document.getElementById('modalRoomId').value;
    const messageDiv = document.getElementById('editRoomMessage');
    
    messageDiv.innerHTML = '<div class="alert alert-info">Actualizando habitación...</div>';

    const updatedRoomData = {
        tipo: document.getElementById('modalRoomType').value,
        precio: parseFloat(document.getElementById('modalRoomPrice').value),
        descripcion: document.getElementById('modalRoomDescription').value,
    };
    
    try {
        const response = await fetch(`${API_URL}/${roomId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRoomData) 
        });

        if (!response.ok) throw new Error('Error al actualizar la habitación.');
        
        messageDiv.innerHTML = '<div class="alert alert-success">Habitación actualizada exitosamente.</div>';
        loadRooms(); 

        setTimeout(() => {
            $('#editRoomModal').modal('hide'); 
        }, 1500);

    } catch (error) {
        console.error("Error al editar habitación:", error);
        messageDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}



async function handleDeleteRoom(roomId) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la habitación con ID ${roomId}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${roomId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error al eliminar la habitación.');
        
        alert('Habitación eliminada exitosamente.');
        loadRooms(); 
    } catch (error) {
        console.error("Error al eliminar habitación:", error);
        alert(`Error al eliminar: ${error.message}`);
    }
}


document.addEventListener('DOMContentLoaded', initializePage);

function getCookie(nombre) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(nombre + "="))
    ?.split("=")[1] || null;
}