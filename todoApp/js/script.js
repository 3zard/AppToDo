const apiURL = "http://localhost:3001";


async function fetchTaskList() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    xhr.open("POST", `${apiURL}/read`, true);
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

tasks.prototype.addTask = function () {
  const taskName = document.getElementById("inputValue").value.trim();
  if (taskName !== "") {
    const filterStatus = document.getElementById("filter").value;
    const newTask = {
      name: taskName,
      completed: filterStatus == "done",
    };
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    xhr.open('POST', `${apiURL}`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.responseType = 'json';
    xhr.send(JSON.stringify(newTask));
    xhr.onload = function() {
      if (xhr.status === 201) {
        console.log("123");
        const data = xhr.response;
        
        this.cancelTask();
        this.sortTask();
        this.filterTask();
      }
    }
    xhr.onerror = function() {
      alert(`Network Error`);
    }
    // if (this.listTask.filter((task) => taskName === task.name).length === 0) {
      
    //   let newTask = {
    //     id: ++this.idCounter,
    //     name: taskName,
    //     completed: filterStatus == "done",
    //   };
      // this.listTask.push(newTask);
      // this.cancelTask();
      // this.sortTask();
      // this.filterTask();
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
  console.log(this.listTask)
};

tasks.prototype.deleteTask = function (id) {
  
  this.listTask.filter((item, index) =>
    item.id === id ? this.listTask.splice(index, 1) : ""
  );
  this.render(this.listTask);
};

tasks.prototype.editTask = function (id) {
  const task = this.listTask.find((task) => task.id === id);
  const newTaskName = prompt("Change your task here", task.name);
  if (newTaskName !== null && newTaskName.trim() !== "") {
    const isTaskExist = this.listTask.find(
      (task) => task.name === newTaskName.trim()
    );
    if (isTaskExist) {
      alert("Already have this task !");
    } else {
      task.name = newTaskName.trim();
      this.render();
    }
  }
};


// fetchTaskList();

tasks.prototype.filterTask = function () {
  const filterStatus = document.getElementById("filter").value;
  const taskList = document.getElementById("taskList");
  const xhr = new XMLHttpRequest();
  // const token = localStorage.getItem('token');
  xhr.open("POST", "http://localhost:3001/read", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  // xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(JSON.stringify({
    "collection": "task"
}));
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log("OK");
    }
    else {
      console.log("blabla");
    }
  }
  xhr.onerror = function() {
    console.log("Lỗi cmn");
  }

  

  // if (filterStatus === "done") {
  //   this.render(
  //     this.listTask.filter(function (value) {
  //       if (value.completed === true) {
  //         return value;
  //       }
  //     }, [])
  //   );
  // } else if (filterStatus === "undone") {
  //   this.render(
  //     this.listTask.filter(function (value) {
  //       if (value.completed === false) {
  //         return value;
  //       }
  //     }, [])
  //   );
  // } else {
  //   this.render(this.listTask);
  // }
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
