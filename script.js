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

}
function cancelTask() {

}
function toggleCompleted() {

}
