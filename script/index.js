window.addEventListener("load", carregar);

function carregar() {
  if (recuperarCookie("token") == null) {
    window.location.href = "login.html"; //Redirecionar para o login
  } else {
    loadData();
  }
}

function showData(result) {
  result.forEach(element => {
    return createUser(element);
  });
}

function createUser(objeto) {
  let tbody = document.querySelector("table");
  let fragment = document.createDocumentFragment();
  let tr = document.createElement("tr");
  let tdId = document.createElement("td");
  let tdName = document.createElement("td");
  let tdEmail = document.createElement("td");
  let tdEdit = document.createElement("td");
  let tdDelete = document.createElement("td");
  let buttonEdit = document.createElement("button");
  let buttonDelete = document.createElement("button");

  tdId.textContent = objeto.id;
  tdName.textContent = objeto.fullname;
  tdEmail.textContent = objeto.email;
  buttonEdit.textContent = "Editar";
  buttonDelete.textContent = "Deletar";

  tdEdit.appendChild(buttonEdit);
  tdDelete.appendChild(buttonDelete);

  tr.appendChild(tdId);
  tr.appendChild(tdName);
  tr.appendChild(tdEmail);
  tr.appendChild(tdEdit);
  tr.appendChild(tdDelete);

  return tbody.appendChild(tr);
}

function loadData() {
  let token = recuperarCookie("token");
  fetch('http://138.197.78.0/users', {
    method: 'GET',
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": token
    }
  })
    .then(resultado => {
      if (resultado.status == "403") {
        alert("Acesso negado!");
        window.location.href = "login.html";
      }
      if (resultado.status == "200") {
        return resultado.json();
      }
    })
    .then(data => {
      console.log(data);
      showData(data);
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