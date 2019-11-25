window.addEventListener("load", carregar);

function carregar() {
  if (recuperarCookie("token") == null) {
    let formulario = document.forms["login"];
    formulario.addEventListener("submit", validarLogin);
  } else {
    window.location.href = "index.html"; //Redirecionar para a principal
  }
}

function redirectRegister() {
  window.location.href = "register.html";
}

function adicionarCookie(nome, valor, dias) {
  let data = new Date();
  data.setDate(data.getDate() + dias);
  document.cookie = nome + "=" + valor + ";expires=" + data.toUTCString();
}

function apagarCookie(nome) {
  let data = new Date("01/01/1970");
  document.cookie = nome = "=" + ";expires=" + data.toUTCString();
}



function recuperarCookie(nome) {
  let cookies = document.cookie;
  let first = cookies.indexOf(nome + "=");
  let str = "";
  if (first >= 0) {
    str = cookies.substring(first, cookies.length);
    let last = str.indexOf(";");
    if (last < 0) {
      last = str.length;
    }
    str = str.substring(0, last).split("=");
    return decodeURI(str[1]);
  } else {
    return null;
  }
}

function validarLogin(event) {
  event.preventDefault();

  let formulario = document.forms["login"];
  let fieldUsername = formulario.username;
  let fieldPassword = formulario.password;
  let username = fieldUsername.value;
  let password = fieldPassword.value;


  let user = {
    "username": username,
    "password": password
  };

  fetch('http://138.197.78.0/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(resultado => {
      console.log("header", resultado.headers)
      console.log("resultado", resultado)
      if (resultado.status = "403") {
        addClassError(fieldUsername);
        addClassError(fieldPassword);
      }
      if (resultado.status == "200") {
        console.log(resultado.headers);
        removeClassError(fieldUsername);
        removeClassError(fieldPassword);
        console.log("Token", resultado.headers.get("Authorization"));
        //window.location.href = "index.html";
      }
      return resultado.json()
    })
    .catch(error => {
      console.log(error);
    })
}

function addClassError(field) {
  field.classList.add('error');
}

function removeClassError(field) {
  field.classList.remove('error');
}