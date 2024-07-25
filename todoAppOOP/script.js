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

tasks.prototype.render = function () {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""
  taskList.innerHTML = this.listTask
    .map((item) => {
      return ` <li><input type="checkbox" ${item.completed ? checked : ""}>
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

task.prototype.deleteTask = function () {
  arrayList.map(() => arrayList[i].id === id);
    arrayList.splice(i, 1); 
    task.prototype.filterTask();
}

tasks.prototype.editTask = function () {};

tasks.prototype.filterTask = function () {};

tasks.prototype.toggleCompleted = function () {};

tasks.prototype.sortTask = function () {};

let newTaskList = new tasks();
let id = 0;
// DOM
document.getElementById("addButton").addEventListener("click", function () {
  newTaskList.addTask();
});

document.getElementById("cancelButton").addEventListener("click", function () {
  newTaskList.cancelTask();
});
