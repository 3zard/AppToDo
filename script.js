const inputTask = document.getElementById("inputValue")
const taskList = document.getElementById("taskList")
const addButton = document.getElementById("addButton")

let arrayList = []

function addTask() {
    const taskName = inputTask.value.trim()
    if (taskName !== "") {
        let newTask = {
            id: arrayList.length + 1,
            name: taskName,
            completed: false
        }
        arrayList.push(newTask)
        taskList.innerHTML = ""
        render()
    }
}
function render() {

}
function deleteTask() {

}
function editTask() {

}
function filterTask() {
<<<<<<< HEAD

=======
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
>>>>>>> c7e0e5c (Trình | done function filter)
}
function cancelTask() {

}
function toggleCompleted() {

}
