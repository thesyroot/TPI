var btn = document.getElementById("sing-in");
btn.addEventListener("click", async () => {
    let email = document.getElementById("exampleInputEmail1").value;
    let password = document.getElementById("exampleInputPassword1").value;

    let hashedPassword = await hashSHA256(password);

    let res = await (await fetch("https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })).json();

    let user = res.find(user => ( user.email === email || user.name === email ) && user.password === hashedPassword);
    if (!user) {
      alert("Correo/Usuario o contraseña incorrectos.");
      return;
    }

    let checkbox = document.getElementById("exampleCheck1").checked;
    if (checkbox) {
      setCookie("username", user.name);
      setCookie("hashedPassword", hashedPassword);
      setCookie("email", user.email);
      setCookie("role", user.role);
    }else {
      setCookie("username", user.name, 0.1);
      setCookie("hashedPassword", hashedPassword, 0.1);
      setCookie("email", user.email, 0.1);
      setCookie("role", user.role, 0.1);
  }

    window.location.replace("../../index.html");
});

async function hashSHA256(texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

function setCookie(nombre, valor, dias = 7) {
  const expira = new Date(Date.now() + dias * 864e5).toUTCString();
  document.cookie = `${nombre}=${valor}; expires=${expira}; path=/`;
}