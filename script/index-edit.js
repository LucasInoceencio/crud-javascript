window.addEventListener("load", carregar);

function carregar() {
  let form = document.forms['edit-user'];
  form.addEventListener('submit', validationForm, false);
  form.cpf.addEventListener('blur', validationCPF, false);
  form.email.addEventListener('blur', validationEmail, false);
  if (recuperarCookie("token") == null) {
    window.location.href = "login.html"; //Redirecionar para o login
  } else {
    form.addEventListener("submit", editRegister)
    loadData();
  }
}

function redirectIndex() {
  window.location.href = "index.html";
}

function apagarCookie(nome) {
  let data = new Date("01/01/1970");
  document.cookie = nome + "=" + ";expires=" + data.toUTCString();
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

function showData(objeto) {
  let formulario = document.forms["edit-user"];
  let fieldFullname = formulario.fullname;
  let fieldCpf = formulario.cpf;
  let fieldEmail = formulario.email;

  fieldFullname.value = objeto.fullname;
  fieldCpf.value = objeto.cpf;
  fieldEmail.value = objeto.email;
}

function loadData() {
  let token = recuperarCookie("token");
  let idUser = recuperarCookie("deleteUserById");
  fetch(`http://138.197.78.0/users/${idUser}`, {
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

function editRegister(event) {
  event.preventDefault();

  let formulario = document.forms["edit-user"];
  let fieldFullname = formulario.fullname;
  let fieldCpf = formulario.cpf;
  let fildEmail = formulario.email;
  let fullname = fieldFullname.value;
  let cpf = fieldCpf.value;
  let email = fildEmail.value;


  let user = {
    "cpf": cpf,
    "email": email,
    "fullname": fullname
  };

  let token = recuperarCookie("token");
  let idUser = recuperarCookie("deleteUserById");
  fetch(`http://138.197.78.0/users/${idUser}`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": token
      }
    })
    .then(resultado => {
      if (resultado.status == "403") {
        alert("Acesso não autorizado!");
        window.location.href = "login.html";
      }
      if (resultado.status == "404") {
        alert("Usuário não encontrado!");
        window.location.href = "index.html";
      }
      if (resultado.status == "200") {
        alert("Usuário alterado!");
        window.location.href = "index.html";
      }
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

function validateEmail(email) {
  let regex = /^[a-zA-Z][a-zA-Z0-9\_\-\.]+@[a-zA-Z]{3,}\.[a-zA-Z]{3}(\.[a-zA-Z]{2})?$/;
  return regex.test(email);
}

function validationEmail() {
  let field = document.forms['register'].email;
  let inputEmail = field.value;

  if (inputEmail == null || inputEmail == '' || validateEmail(inputEmail) == false) {
    console.log("add class erro input email");
    addClassError(field);
    return false;
  }
  removeClassError(field);
  return true;
}

function validateCPF(cpf) {
  let regex = /^\d{3}\d{3}\d{3}\d{2}$/;
  return regex.test(cpf);
}

function validationCPF() {
  let field = document.forms['register'].cpf;
  let inputCPF = field.value;

  if (inputCPF == null || inputCPF == '' || validateCPF(inputCPF) == false) {
    console.log("add class erro input cpf");
    addClassError(field);
    return false;
  }
  removeClassError(field);
  return true;
}

function validationForm(event) {
  console.log("validationForm");

  validationCPF();
  validationEmail();

  event.preventDefault();
}

function singOut() {
  event.preventDefault();
  apagarCookie("token");
  if (recuperarCookie("token") == null) {
    window.location.href = "login.html"; //Redirecionar para o login
  }
}