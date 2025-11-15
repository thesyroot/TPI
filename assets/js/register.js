var btn = document.getElementById("register");
btn.addEventListener("click", async () => {
  let checkBox = document.getElementById("exampleCheck1");
  if (!checkBox.checked) {
    alert("Debes estar de acuerdo con los terminos y condiciones.");
    return;
  }
    
  let username = document.getElementById("exampleInputUsername1").value;
  let email = document.getElementById("exampleInputEmail1").value;
  let password = document.getElementById("exampleInputPassword1").value;
  let roleSelect = document.getElementById("exampleFormControlSelect2");
  let role = roleSelect.selectedIndex;
  let hashedPassword = await hashSHA256(password);

  let res = await (await fetch("https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })).json();

  let exists = res.find(user => user.email === email);
  if (exists) {
    alert("El correo ya está registrado.");
    return;
  }

  await fetch("https://690ea5a4bd0fefc30a0501c6.mockapi.io/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: username,
      email: email,
      password: hashedPassword,
      role: role,
    }),
  });

  setCookie("username", username);
  setCookie("hashedPassword", hashedPassword);
  setCookie("email", email);
  setCookie("role", role);

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