
const MOCKAPI_BASE_URL = 'https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1/'; 
const API_URL = `${MOCKAPI_BASE_URL}/users`;


function initializePage() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));

    
    if (!user || user.role !== 'ADMIN') {
        alert('Acceso denegado. Solo administradores pueden ver esta página.');
        
        window.location.href = 'dashboard.html'; 
        return;
    }

   
    loadUsers();

    
    document.getElementById('createUserForm').addEventListener('submit', handleCreateUser);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
    
    
}


async function loadUsers() {
    const usersBody = document.getElementById('usersBody');
    usersBody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando usuarios...</td></tr>';
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar la lista de usuarios.');
        
        const users = await response.json();
        renderUserTable(users);
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        usersBody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Error: ${error.message}</td></tr>`;
    }
}

function renderUserTable(users) {
    const usersBody = document.getElementById('usersBody');
    usersBody.innerHTML = ''; 
    
    if (users.length === 0) {
        usersBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay usuarios registrados.</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = usersBody.insertRow();
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nombre || 'N/A'}</td>
            <td>${user.email}</td>
            <td><span class="badge badge-${user.role === 'ADMIN' ? 'danger' : 'success'}">${user.role}</span></td>
            <td>
                <button class="btn btn-warning btn-sm change-password-btn" data-user-id="${user.id}" data-user-email="${user.email}">
                    <i class="mdi mdi-key"></i> Cambiar Pwd
                </button>
            </td>
        `;
    });

    
    document.querySelectorAll('.change-password-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = e.currentTarget.getAttribute('data-user-id');
            const userEmail = e.currentTarget.getAttribute('data-user-email');
            showChangePasswordModal(userId, userEmail);
        });
    });
}


async function handleCreateUser(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('createUserMessage');
    messageDiv.innerHTML = '<div class="alert alert-info">Creando usuario...</div>';

    const newUser = {
        nombre: document.getElementById('newUserName').value,
        email: document.getElementById('newUserEmail').value,
        password: document.getElementById('newUserPassword').value,
        role: document.getElementById('newUserRole').value,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) throw new Error('Error al crear el usuario.');
        
        document.getElementById('createUserForm').reset();
        messageDiv.innerHTML = '<div class="alert alert-success">Usuario creado exitosamente.</div>';
        loadUsers(); 
    } catch (error) {
        console.error("Error al crear usuario:", error);
        messageDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}


function showChangePasswordModal(userId, userEmail) {
    document.getElementById('modalUserId').value = userId;
    document.getElementById('changePasswordModalLabel').textContent = `Cambiar Contraseña para: ${userEmail}`;
    document.getElementById('changePasswordMessage').innerHTML = '';
    document.getElementById('modalNewPassword').value = ''; 
    
    
    $('#changePasswordModal').modal('show'); 
}

async function handleChangePassword(e) {
    e.preventDefault();
    const userId = document.getElementById('modalUserId').value;
    const newPassword = document.getElementById('modalNewPassword').value;
    const messageDiv = document.getElementById('changePasswordMessage');
    
    messageDiv.innerHTML = '<div class="alert alert-info">Actualizando contraseña...</div>';

    try {
        
        const response = await fetch(`${API_URL}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPassword }) 
        });

        if (!response.ok) throw new Error('Error al cambiar la contraseña.');
        
        messageDiv.innerHTML = '<div class="alert alert-success">Contraseña actualizada exitosamente.</div>';
        
       
        setTimeout(() => {
            $('#changePasswordModal').modal('hide'); 
        }, 1500);

    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        messageDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}


document.addEventListener('DOMContentLoaded', initializePage);