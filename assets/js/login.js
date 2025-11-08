var btn = document.getElementById("sing-in");
btn.addEventListener("click", async () => {
    let email = document.getElementById("exampleInputEmail1").value;
    let password = document.getElementById("exampleInputPassword1").value;

    let hashedPassword = await hashSHA256(password);

    let checkbox = document.getElementById("exampleCheck1").checked;
    if (checkbox) {
        // se obtienen de la base de datos los datos faltantes para las cookies
        let username = "mockUsername"; // reemplazar con consulta a la base de datos
        let role = 1; // reemplazar con consulta a la base de datos

        setCookie("username", username);
        setCookie("hashedPassword", hashedPassword);
        setCookie("email", email);
        setCookie("role", role);
    }else {
      // se obtienen de la base de datos los datos faltantes para las cookies
      let username = "mockUsername"; // reemplazar con consulta a la base de datos
      let role = 1; // reemplazar con consulta a la base de datos

      setCookie("username", username, 0.1);
      setCookie("hashedPassword", hashedPassword, 0.1);
      setCookie("email", email, 0.1);
      setCookie("role", role, 0.1);
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