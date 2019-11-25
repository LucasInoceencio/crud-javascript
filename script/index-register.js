window.addEventListener("load", carregar);

function carregar() {
  let form = document.forms['register'];
  form.addEventListener('submit', validationForm, false);
  form.cpf.addEventListener('blur', validationCPF, false);
  form.email.addEventListener('blur', validationEmail, false);
  // if (recuperarCookie("token") == null) {
  //   let formulario = document.forms["register"];
  //   formulario.addEventListener("submit", validarRegister);
  // } else {
  //   window.location.href = "index.html"; //Redirecionar para a principal
  // }
  if (recuperarCookie("token") != null) {
    window.location.href = "index.html"; //Redirecionar para a principal
  }
}

function redirectLogin() {
  window.location.href = "login.html";
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

function validarRegister(event) {
  event.preventDefault();

  let formulario = document.forms["register"];
  let fieldFullname = formulario.fullname;
  let fieldCpf = formulario.cpf;
  let fildEmail = formulario.email;
  let fieldUsername = formulario.username;
  let fieldPassword = formulario.password;
  let fullname = fieldFullname.value;
  let cpf = fieldCpf.value;
  let email = fildEmail.value;
  let username = fieldUsername.value;
  let password = fieldPassword.value;


  let user = {
    "username": username,
    "password": password,
    "cpf": cpf,
    "email": email,
    "fullname": fullname
  };

  fetch('http://138.197.78.0/sign-up', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(resultado => {
      if (resultado.status == "400") {
        fieldUsername.addClassError;
        alert("Usuário já existente");
      }
      window.location.href = "login.html";
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

function validateEmail(email) {
  // Primeiro caracter é letra
  // Após primeiro caracter, aceitar letras, números, - _ .
  // Após o @, ter somente letras
  // Após o ponto 3 letras e opcionalmente outro ponto e duas letras
  let regex = /^[a-zA-Z][a-zA-Z0-9\_\-\.]+@[a-zA-Z]{3,}\.[a-zA-Z]{3}(\.[a-zA-Z]{2})?$/;
  return regex.test(email);
}

function validationEmail() {
  let field = document.forms['register'].email;
  let inputEmail = field.value;

  if(inputEmail == null || inputEmail == '' || validateEmail(inputEmail) == false) {
    console.log("add class erro input email");
    addClassError(field);
    return false;
  }
  removeClassError(field);
  return true;
}

function validateCPF(cpf) {
  // (000.444.566-66)
  let regex = /^\d{3}\d{3}\d{3}\d{2}$/;
  return regex.test(cpf);
}

function validationCPF() {
  let field = document.forms['register'].cpf;
  let inputCPF = field.value;

  if(inputCPF == null || inputCPF == '' || validateCPF(inputCPF) == false) {
    console.log("add class erro input cpf");
    addClassError(field);
    return false;
  }
  removeClassError(field);
  return true;
}

function validationForm(event) {
  console.log("validationForm");

  validationCPF();;
  validationEmail();

  event.preventDefault();
}