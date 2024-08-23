const apiURL = "http://localhost:3001/tasks";
//CRUD, C-addTask, R-filterTask, U-editTask, D-deleteTask
async function fetchTaskList() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    // xhr.open("POST", `${apiURL}`, true);
    xhr.open("POST", "http://localhost:3001/read", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(`Error: ${xhr.status} - ${xhr.statusText}`);
      }
    };
    xhr.onerror = function() {
      reject("Lỗi cmn: Network Error");
    };

    xhr.send(JSON.stringify({
      "collection": "task"
    }));
  });
}

function tasks() {
  this.listTask = [];
  // this.idCounter = 0;
}

// get task list
tasks.prototype.getTaskList = async function () {
  this.listTask = await fetchTaskList();
}

async function fetchTaskListForAdding(body) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    xhr.open("POST", `${apiURL}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(JSON.stringify(body));
    xhr.onload = function() {
      if (xhr.status === 201) {
        resolve(xhr.response);
      } else {
        reject(`Error: ${xhr.status} - ${xhr.statusText}`);
      }
    };
    xhr.onerror = function() {
      reject("Lỗi cmn: Network Error");
    };
  });
}

tasks.prototype.addTask = function () {
  const taskName = document.getElementById("inputValue").value.trim();
  if (taskName !== "") {
    const filterStatus = document.getElementById("filter").value;
    const newTask = {
      name: taskName,
      completed: filterStatus == "done",
    };
    try {
      const addRunner = fetchTaskListForAdding(newTask);
      alert("Add successful!");
      this.getTaskList();
      this.cancelTask();
      this.sortTask();
      this.filterTask();
    }
    catch (error) {
      alert("Add failed!");
    }
    } else {
      alert("already have this task");
      cancelTask();
    }
  // }
};

tasks.prototype.render = function (listArray) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  taskList.innerHTML = listArray.map((item) => {
      return ` <li><input onchange="newTaskList.toggleCompleted(${item.id})" type="checkbox" ${item.completed ? "checked" : ""}>
              <span>${item.name}</span>
              <button class="button" onclick="newTaskList.editTask(${item.id})">Edit</button>
              <button class="button" onclick="newTaskList.deleteTask(${item.id})">Delete</button>
              </li>`;
    }).join("");
};

tasks.prototype.cancelTask = function () {
  document.getElementById("inputValue").value = "";
};

async function fetchTaskListForDeleting(id) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    xhr.open("DELETE", `${apiURL}/${id}`, true);
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
      reject("Lỗi cmn: Network Error");
    };

    xhr.send();
  });
}

tasks.prototype.deleteTask = async function (id) {
  try {
    const deleteRunner = await fetchTaskListForDeleting(id);
    alert("Delete successful!");
    this.getTaskList();
    this.render(this.listTask);
  }
  catch (error) {
    alert("Delete failed!");
  }
};

async function fetchTaskListForEditing(id, body) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    xhr.open("PATCH", `${apiURL}/${id}`, true);
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
      reject("Lỗi cmn: Network Error");
    };

    xhr.send(JSON.stringify(body));
  });
}

tasks.prototype.editTask = async function (id) {
  const newTaskName = prompt("Change your task here", task.name);
  if (newTaskName !== null && newTaskName.trim() !== "") {
    try {
      const editRunner = await fetchTaskListForEditing(id, newTaskName.trim());
      alert("Edit successful!");
      this.getTaskList();
      this.render(this.listTask);
    }
    catch (error) {
      alert("Already have this task !");
    }
  }
  else {
    alert("Edit failed!");
  }
};


async function fetchTaskListForFiltering(status) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    xhr.open("GET", `${apiURL}?status=${status}`, true);
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
      reject("Lỗi cmn: Network Error");
    };
    xhr.send();
  });
}

tasks.prototype.filterTask = async function () {
  const filterStatus = document.getElementById("filter").value;
  try {
    const data = await fetchTaskListForFiltering(filterStatus);
    this.render(JSON.parse(data));
  }
  catch (error) {
    console.log(error);
  }
};

tasks.prototype.toggleCompleted = function (id) {
  this.listTask.forEach((item) =>
    item.id === id ? (item.completed = !item.completed) : ""
  );
  this.sortTask();
  this.filterTask();
};

tasks.prototype.sortTask = function () {
  this.listTask.sort(function (task1, task2) {
    if (task1.completed != task2.completed) {
      return task1.completed - task2.completed;
    }
    return !isNaN(task1.name) && !isNaN(task2.name)
      ? task1.name - task2.name
      : task1.name.localeCompare(task2.name);
  });
};

const newTaskList = new tasks();
// get task list
newTaskList.getTaskList();

// DOM
document.getElementById("addButton").addEventListener("click", function () {
  newTaskList.addTask();
});

document.getElementById("cancelButton").addEventListener("click", function () {
  newTaskList.cancelTask();
});

document.getElementById("filter").addEventListener("change", function () {
  newTaskList.filterTask();
});

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
    document.getElementById(
      "greeting"
    ).innerText = `Hello ${rememberedUser.email}`;
  } else if (currentSessionUser) {
    document.getElementById(
      "greeting"
    ).innerText = `Hello ${currentSessionUser.email}`;
  } else if (currentPage === "index.html" || currentPage === "" ) {
    window.location.href = "/todoApp/html/login.html";
  }
};
