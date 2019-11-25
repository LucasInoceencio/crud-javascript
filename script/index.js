window.addEventListener("load", carregar);

function carregar() {
  if (recuperarCookie("token") == null) {
    window.location.href = "login.html"; //Redirecionar para o login
  } else {
    loadData();
  }
}

function loadData() {
  let token = recuperarCookie("token");
  fetch('http://138.197.78.0/users', {
    method: 'GET',
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Authentication": token
    }
  })
    .then(resultado => {
      console.log("header", resultado.headers)
      console.log("resultado", resultado)
      if (resultado.status == "403") {
        alert("Acesso negado!");
        window.location.href = "login.html";
      }
      if (resultado.status == "200") {
        return resultado.json()
      }
    })
    .catch(error => {
      console.log(error);
    })
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

function apagarCookie(nome) {
  document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function singOut() {
  event.preventDefault();
  apagarCookie("token");
  if (recuperarCookie("token") == null) {
    window.location.href = "login.html"; //Redirecionar para o login
  }
}