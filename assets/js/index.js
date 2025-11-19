function getCookie(nombre) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(nombre + "="))
    ?.split("=")[1] || null;
}

document.addEventListener("DOMContentLoaded", () =>{
    const email = getCookie("email");
    const user = getCookie("username");
    const hashedPassword = getCookie("hashedPassword");
    const role = getCookie("role");

    if (email && user && hashedPassword && role) {
        if(role == "1"){
            window.location.replace("pages/dashboards/admin/dashboard.html");
        }else if(role == "2"){
            window.location.replace("pages/dashboards/client/dashboard.html");
        }else{
            window.location.replace("pages/login/login.html");
        }
    }else{
        window.location.replace("pages/login/login.html");
    }
});