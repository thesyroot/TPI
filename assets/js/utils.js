var btn = document.getElementById('sign-out');
btn.addEventListener('click', function() {
    deleteCookie("email");
    deleteCookie("username");
    deleteCookie("hashedPassword");
    deleteCookie("role");
    deleteCookie("userId");
    
    window.location.replace("../../login/login.html");
});

function deleteCookie(nombre) {
  document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

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
      if(role == "1" && !window.location.pathname.endsWith("admin/dashboard.html")){
        console.log("redirecting to admin dashboard");
        window.location.replace("../admin/dashboard.html");
      }else if(role == "2" && !window.location.pathname.endsWith("client/dashboard.html")){
        window.location.replace("../client/dashboard.html");
      }else if(role != "1" && role != "2"){
        window.location.replace("../../login/login.html");
      }
    }else{
      window.location.replace("../../login/login.html");
    }
});

var username_tags = document.getElementsByClassName("username-tag");
[...username_tags].forEach(tag => {
  tag.innerText = getCookie("username");
});

var username_tags = document.getElementsByClassName("email-tag");
[...username_tags].forEach(tag => {
  tag.innerText = getCookie("email");
});