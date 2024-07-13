const taskList = document.getElementById("taskList")
let arrayList = [];
function deleteTask(e) {
    const parentElement = e.target.parentElement
    taskList.removeChild(parentElement)
    arrayList.splice(array.indexOf(parentElement),1)
}