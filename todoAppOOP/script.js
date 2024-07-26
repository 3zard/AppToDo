function tasks() {
  this.listTask = [];
  this.idCounter = 0;
}

tasks.prototype.addTask = function () {
  const taskName = document.getElementById("inputValue").value.trim();
  if (taskName !== "") {
    if (this.listTask.filter((task) => taskName === task.name).length === 0) {
      //   const filterStatus = document.getElementById("filter").value;
      let newTask = {
        id: ++this.idCounter,
        name: taskName,
        // completed: filterStatus == "done",
        completed: false,
      };
      this.listTask.push(newTask);
      this.cancelTask();
      this.render();
      //   this.sortTask();
      //   this.filterTask();
    } else {
      alert("already have this task");
      cancelTask();
    }
  }
};

tasks.prototype.render = function (listArray) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""
  listArray.innerHTML = this.listTask
    .map((item) => {
      return ` <li><input onchange="newTaskList.toggleCompleted(${item.id})" type="checkbox" ${item.completed ? checked : ""}>
        <span>${item.name}</span>
        <button class="button" onclick="newTaskList.editTask(${item.id})">Edit</button>
        <button class="button" onclick="newTaskList.deleteTask(${item.id})">Delete</button>
        </li>`;
    })
    .join("");
};

tasks.prototype.cancelTask = function () {
  document.getElementById("inputValue").value = "";
};

tasks.prototype.deleteTask = function (id) {
  this.listTask.filter((item, index) => item.id === id ? this.listTask.splice(index, 1):"");
    console.log(this.listTask)
    this.render();
}

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

tasks.prototype.filterTask = function () {};

tasks.prototype.toggleCompleted = function (id) {
  this.listTask.forEach((item) => item.id === id ? item.completed = !item.completed:'')
  console.log(this.listTask); 
};

tasks.prototype.sortTask = function () {};

let newTaskList = new tasks();

// DOM
document.getElementById("addButton").addEventListener("click", function () {
  newTaskList.addTask();
});

document.getElementById("cancelButton").addEventListener("click", function () {
  newTaskList.cancelTask();
});
