const inputTask = document.getElementById("inputValue")
const taskList = document.getElementById("taskList")
const addButton = document.getElementById("addButton")
addButton.addEventListener("click", addTask)

let arrayList = []
let id = 0;
function addTask() {
    const taskName = inputTask.value.trim()
    if (taskName !== "") {
        let newTask = {
            id: id++,
            name: taskName,
            completed: false
        }
        arrayList.push(newTask)
        cancelTask()
        taskList.innerHTML = ""
        render(arrayList)
    }
}
function render(listRender) {
    taskList.innerHTML = ""
    listRender.forEach((value) => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = value.completed;
        checkbox.onchange = () => {
            toggleCompleted(value.id);
        };

        const taskName = document.createElement('span');
        taskName.textContent = value.name;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = "button"
        editButton.onclick = () => {
            editTask(value.id);
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = "button"
        deleteButton.onclick = () => {
            deleteTask(value.id);
        };

        li.appendChild(checkbox);
        li.appendChild(taskName);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    })


}
function filterTask() {
    const filterStatus = document.getElementById("filter").value
    taskList.innerHTML = ""
    let arrayFilter = []
    if (filterStatus === "done") {
        for (task of arrayList) {
            if (task.completed === true) {
                arrayFilter.push(task)
            }
        }
        render(arrayFilter)
    }
    else if (filterStatus === "undone") {
        for (task of arrayList) {
            if (task.completed === false) {
                arrayFilter.push(task)
            }
        }
        render(arrayFilter)   
    }
    else {
        render(arrayList)
    }
}
function cancelTask() {
    inputTask.value = ""
}
function deleteTask(id) {

}
function editTask(id) {

}
function toggleCompleted(id) {

}