const apiUserURL = "http://localhost:3000";
async function fetchAPIServer(apiURL, body, subpath) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${apiURL}/${subpath}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    if (subpath === "login") {
      const token = localStorage.getItem("token");
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(`Error: ${xhr.status} - ${xhr.statusText}`);
      }
    };
    xhr.onerror = function () {
      alert(`Network Error`);
    };
    xhr.send(JSON.stringify(body));
  });
}
// login signup
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([]));
}
async function register(event) {
  if (event) {
    console.log(event);
    event.preventDefault();
    event.stopPropagation();
  }
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const repeatPassword = document.getElementById("repeat-password").value;

  if (email !== "" && password !== "" && repeatPassword !== "") {
    if (password !== repeatPassword) {
      alert("Repeat password not match!");
      return;
    }
    const registerUser = {
      username: email,
      password: password,
    };
    try {
      const registerRunner = await fetchAPIServer(
        `${apiUserURL}`,
        registerUser,
        "register"
      );
      alert("Registration successful!");
      if (registerRunner) {
        setTimeout(() => {
          window.location.href = "login.html";
        }, 0);
      }
    } catch (error) {
      alert("Registration failed!");
      console.error(error);
    }
  } else {
    alert("Please fill in both email and password fields.");
    return;
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  if (email !== "" && password !== "") {
    const loginUser = {
      username: email,
      password: password,
    };
    try {
      const userJson = await fetchAPIServer(
        `${apiUserURL}`,
        loginUser,
        "login"
      );
      const parsedUser = JSON.parse(userJson);
      localStorage.setItem("token", parsedUser.token);
      console.log(parsedUser.username);
      alert("Login successful!");
      if (rememberMe) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify(parsedUser.username)
        );
      } else {
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify(parsedUser.username)
        );
      }
      window.location.href = "../index.html";
    } catch (error) {
      alert("Invalid email or password.");
      console.error(error);
    }
  } else {
    alert("Please fill in both email and password fields.");
  }
}

//logout
function logout() {
  localStorage.removeItem("rememberedUser");
  sessionStorage.removeItem("currentUser");
  alert("Logout successful!");
  window.location.href = "./html/login.html";
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
