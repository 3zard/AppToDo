// const apiURL = "http://localhost:3001/users";
async function fetchAPIServer(apiURL, body) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem("token");
    xhr.open('POST', `${apiURL}/register`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.status);
      } else {
        reject(`Error: ${xhr.status} - ${xhr.statusText}`);
      }
    };
    xhr.onerror = function() {
      alert(`Network Error`);
    }
    xhr.send(JSON.stringify(body));
  })
}
// login signup
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([]));
}
function register() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const repassword = document.getElementById("repassword").value;

  if (email !== "" && password !== "" && repassword !== "") {
    if (password !== repassword) {
      alert("Repassword not match!");
      return;
    }
    const registerUser = {
      "username": email,
      "password": password
    }
    const exitcode = fetchAPIServer("http://localhost:3001/users/signup", registerUser)
    if (exitcode === 201) {
      alert("Registration successful!");
      window.location.href = "login.html";
    }
    if (exitcode >= 400) {
      alert("Email is already registered!");
    }
  } else {
    alert("Please fill in both email and password fields.");
    return;
  }
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  if (email !== "" && password !== "") {
    const loginUser = {
      "username": email,
      "password": password
    }
    const exitcode = fetchAPIServer("http://localhost:3001/users/login")

    
    if (exitcode === 200) {
      alert("Login successful!");
      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify(user));
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
      }
      window.location.href = "../index.html";
    }
    if (exitcode >= 400) {
      alert("Invalid email or password.");
    }
  } else {
    alert("Please fill in both email and password fields.");
  }
}

window.onload = function () {
  const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));
  const currentSessionUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const currentPage = window.location.pathname.split("/").pop();

  if (rememberedUser) {
    if (currentPage === "login.html" || currentPage === "signup.html") {
      window.location.href = "../index.html";
    }
  } else if (currentSessionUser) {
    if (currentPage === "login.html" || currentPage === "signup.html") {
      window.location.href = "../index.html";
    }
  } else if (currentPage === "./index.html") {
    window.location.href = "./todoApp/html/login.html";
  }
};
