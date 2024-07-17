const inputTask = document.getElementById("inputValue");
const taskList = document.getElementById("taskList");
const addButton = document.getElementById("addButton");
addButton.addEventListener("click", addTask);

const cancelButton = document.getElementById("cancelButton");
cancelButton.addEventListener("click", cancelTask);

const filter = document.getElementById("filter");
filter.addEventListener("change", filterTask);

let arrayList = [];
let id = 0;
function addTask() {
  const taskName = inputTask.value.trim();
  if (taskName !== "") {
    if (arrayList.filter((task) => taskName === task.name).length === 0) {
      const filterStatus = document.getElementById("filter").value;
      let newTask = {
        id: id++,
        name: taskName,
        completed: filterStatus == "done",
      };
      arrayList.push(newTask);
      cancelTask();
      taskList.innerHTML = "";
      sortTask()
      filterTask()
    } else {
      alert("already have this task");
      cancelTask();
    }
  }
}
function render(listRender) {
  taskList.innerHTML = "";
  listRender.forEach((value) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = value.completed;
    checkbox.onchange = () => {
      toggleCompleted(value.id);
    };

    const taskName = document.createElement("span");
    taskName.textContent = value.name;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "button";
    editButton.onclick = () => {
      editTask(value.id);
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "button";
    deleteButton.onclick = () => {
      deleteTask(value.id);
    };

    li.appendChild(checkbox);
    li.appendChild(taskName);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}
function filterTask() {
  const filterStatus = document.getElementById("filter").value;
  taskList.innerHTML = "";
  let arrayFilter = [];
  if (filterStatus === "done") {
    for (task of arrayList) {
      if (task.completed === true) {
        arrayFilter.push(task);
      }
    }
    render(arrayFilter);
  } else if (filterStatus === "undone") {
    for (task of arrayList) {
      if (task.completed === false) {
        arrayFilter.push(task);
      }
    }
    render(arrayFilter);
  } else {
    render(arrayList);
  }
}
function cancelTask() {
  inputTask.value = "";
}

function toggleCompleted(id) {
  arrayList.map((task) => {
    if (id === task.id) {
      task.completed = !task.completed;
    }
  });
  sortTask();
  render(arrayList);
}
function sortTask() {
  arrayList.sort(function (task1, task2) {
    if (task1.completed != task2.completed) {
      return task1.completed - task2.completed;
    }
    return !isNaN(task1.name) || !isNaN(task2.name) ? task1.name - task2.name : task1.name.localeCompare(task2.name);
  });
}

function deleteTask(id) {
  for (let i = 0; i < arrayList.length; i++) {
    if (arrayList[i].id === id) {
      arrayList.splice(i, 1);
      break;
    }
  }
  filterTask();
}

function editTask(id) {
  const task = arrayList.find((task) => task.id === id);
  const newTaskName = prompt("Change your task here", task.name);
  if (newTaskName !== null && newTaskName.trim() !== "") {
    const isTaskExist = arrayList.find(
      (task) => task.name === newTaskName.trim()
    );
    if (isTaskExist) {
      alert("Already have this task !");
    } else {
      task.name = newTaskName.trim();
      filterTask();
    }
  }
}
