const apiUserURL = "http://localhost:3000/users";
async function fetchAPIServer(apiURL, body) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem("token");
    xhr.open('POST', `${apiURL}/register`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
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
    try {
      const registerRunner = fetchAPIServer(`${apiUserURL}/register`, registerUser)
      alert("Registration successful!");
      window.location.href = "login.html";
    } 
    catch (error) {
      alert("Registration failed!");
      console.error(error);
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
    try {
      const loginRunner = fetchAPIServer(`${apiUserURL}/login`, loginUser);
      localStorage.setItem("token", JSON.parse(loginRunner.token));
      alert("Login successful!");
      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify(user));
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
      }
      window.location.href = "../index.html";
    }
    catch (error) {
      alert("Invalid email or password.");
      console.error(error);
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
