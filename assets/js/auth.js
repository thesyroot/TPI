    const MOCKAPI_URL = 'https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1'; 

    function handleLogout() {
        sessionStorage.removeItem('currentUser');
        window.location.href = '../samples/login.html'; 
    }

    function displayUserMenu(user) {
        const sidebarMenu = document.getElementById('sidebar-menu-list'); 
        
        if (!sidebarMenu) return; 

        if (user.role === 'ADMIN') {
            const adminLinks = `
                <li class="nav-item">
                    <a class="nav-link" href="../admin/admin_habitaciones.html">
                        <i class="menu-icon typcn typcn-th-list"></i>
                        <span class="menu-title">Gestión de Habitaciones</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="../admin/admin_reservas.html">
                        <i class="menu-icon typcn typcn-calendar"></i>
                        <span class="menu-title">Gestión de Reservas</span>
                    </a>
                </li>
            `;
            sidebarMenu.innerHTML += adminLinks;
        }
        
        if (user.role === 'USUARIO') {
            sidebarMenu.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link" href="../reservas/mis_reservas.html">
                        <i class="menu-icon typcn typcn-calendar-outline"></i>
                        <span class="menu-title">Mis Reservas</span>
                    </a>
                </li>
            `;
        }
    }

    function checkSession() {
        const userString = sessionStorage.getItem('currentUser');
        const user = userString ? JSON.parse(userString) : null;
        const path = window.location.pathname;

        if (!user && !path.includes('login.html') && !path.includes('register.html') && !path.includes('index.html')) {
            window.location.href = '../samples/login.html';
            return;
        }
        
        if (user) {
            document.querySelectorAll('.username-tag').forEach(span => {
                span.textContent = user.nombre || 'Usuario';
            });
            document.querySelectorAll('.email-tag').forEach(p => {
                p.textContent = user.email;
            });
            
            displayUserMenu(user);
        }
        
        if (user && path.includes('login.html')) {
            window.location.href = '../dashboard/dashboard.html'; 
        }
    }

    document.addEventListener('DOMContentLoaded', checkSession);

    document.addEventListener('DOMContentLoaded', () => {
        const logoutBtn = document.getElementById('sign-out');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    });