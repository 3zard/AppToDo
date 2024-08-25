const apiTaskURL = "http://localhost:3000/tasks";
//CRUD, C-addTask, R-filterTask, U-editTask, D-deleteTask
async function fetchTaskList(id) {
  try {
    const token = localStorage.getItem('token');
    const url = id ? `${apiTaskURL}/${id}` : apiTaskURL;
    const response = await fetch(`${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (response.ok) {
      return response.json();
    } 
    else {  
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  }
  catch (error) {
    throw new Error("Network Error");
  }
  
}

function tasks() {
  this.listTask = [];
}

// get task list
tasks.prototype.getTaskList = async function () {
  this.listTask = await fetchTaskList();
  this.render(this.listTask);
}

async function addTaskToServer(task) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${apiTaskURL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(task)
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response;
}

tasks.prototype.addTask = async function () {
  const taskName = document.getElementById("inputValue").value.trim();
  if (taskName !== "") {
    try {
      const filterStatus = document.getElementById("filter").value;
      const newTask = {
        name: taskName,
        completed: filterStatus == "done",
      };
      const response = await addTaskToServer(newTask);
      if (response.ok) {
        this.getTaskList();
        // this.render(this.listTask);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    }
    catch (error) {
      console.log(error);
      alert("Add failed!");
    }
    } else {
      alert("Task name is empty!");
      cancelTask();
    }
};

tasks.prototype.render = function (listArray) {
  console.log(listArray);
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
  console.log(this.listTask);
};

async function deleteTaskToServer(id) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${apiTaskURL}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ id: id })
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response;
}

tasks.prototype.deleteTask = async function (id) {
  try {
    const response = await deleteTaskToServer(id);
    if (response.ok) {
      this.getTaskList();
      // this.render(this.listTask);
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  }
  catch (error) {
    alert("Delete failed!");
  }
};

async function editTaskToServer(body) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${apiTaskURL}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response;
}

tasks.prototype.editTask = async function (id) {
  const newTaskName = prompt("Change your task here");
  if (newTaskName !== null && newTaskName.trim() !== "") {
    try {
      const response = await editTaskToServer({id: id, name: newTaskName.trim()});
      if (response.ok) {
        this.getTaskList();
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
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
    xhr.open("GET", `${apiTaskURL}?status=${status}`, true);
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

async function fetchTaskListForToggling(id, body) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    xhr.open("PATCH", `${apiTaskURL}/${id}`, true);
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
    }
    xhr.send(JSON.stringify(body));
  });
}

tasks.prototype.toggleCompleted = function (id) {
  // this.listTask.forEach((item) =>
  //   item.id === id ? (item.completed = !item.completed) : ""
  // );
  const completedRunner = JSON.parse(fetchTaskList(id));
  try {
    const toggleRunner = fetchTaskListForToggling(id, {completed: !completedRunner.completed});
    alert("Toggle successful!");
    this.sortTask();
    this.filterTask();
  }
  catch (error) {
    alert("Toggle failed!");
  }
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
    ).innerText = `Hello ${rememberedUser}`;
  } else if (currentSessionUser) {
    document.getElementById(
      "greeting"
    ).innerText = `Hello ${currentSessionUser}`;
  } else if (currentPage === "index.html" || currentPage === "" ) {
    window.location.href = "/todoApp/html/login.html";
  }
};
