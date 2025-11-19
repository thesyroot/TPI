    const MOCKAPI_URL = 'https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1'; 

    function handleLogout() {
        // sessionStorage.removeItem('currentUser');
        window.location.href = '../../../index.html'; 
    }

    function displayUserMenu(user) {
        const sidebarMenu = document.getElementById('sidebar-menu-list'); 
        
        if (!sidebarMenu) return; 

        if (user.role == 1) {
            const adminLinks = `
                <li class="nav-item"  style="margin-left:0px!important;">
                    <a class="nav-link" href="../../admin/admin_reservations.html">
                        <i class="menu-icon typcn typcn-calendar"></i>
                        <span class="menu-title">Listas de Reservas</span>
                    </a>
                </li>
                <li class="nav-item"  style="margin-left:0px!important;">
                    <a class="nav-link" href="../../admin/admin_rev.html">
                        <i class="menu-icon typcn typcn-th-list"></i>
                        <span class="menu-title">Gestión de Reservas</span>
                    </a>
                </li>
                <li class="nav-item"  style="margin-left:0px!important;">
                    <a class="nav-link" href="../../admin/admin_rooms.html">
                        <i class="menu-icon typcn typcn-th-list"></i>
                        <span class="menu-title">Gestión de habitaciones</span>
                    </a>
                </li>
                <li class="nav-item"  style="margin-left:0px!important;">
                    <a class="nav-link" href="../../admin/admin_users.html">
                        <i class="menu-icon typcn typcn-th-list"></i>
                        <span class="menu-title">Gestión de usuarios</span>
                    </a>
                </li>
            `;
            sidebarMenu.innerHTML += adminLinks;

            // console.log("hola");
        }
        
        if (user.role == 2) {
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
        // const userString = sessionStorage.getItem('currentUser');
        const user = {
            nombre: getCookie("username"),
            email: getCookie("email"),
            role: getCookie("role")
        };
        const path = window.location.pathname;

        // if (!user && !path.includes('login.html') && !path.includes('register.html') && !path.includes('index.html')) {
        //     window.location.href = '../../../index.html';
        //     return;
        // }
        
        if (user) {
            document.querySelectorAll('.username-tag').forEach(span => {
                span.textContent = user.name || 'Usuario';
            });
            document.querySelectorAll('.email-tag').forEach(p => {
                p.textContent = user.email;
            });
            
            displayUserMenu(user);
        }
        
        // if (user && path.includes('login.html')) {
        //     window.location.href = '../dashboard/dashboard.html'; 
        // }
    }

    document.addEventListener('DOMContentLoaded', checkSession);

    document.addEventListener('DOMContentLoaded', () => {
        const logoutBtn = document.getElementById('sign-out');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    });

function getCookie(nombre) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(nombre + "="))
    ?.split("=")[1] || null;
}