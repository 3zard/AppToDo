import React, { useEffect, useState } from "react";
import TaskInput from "../TaskInput/TaskInput";
import TaskList from "../TaskList/TaskList";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const doneTask = tasks.filter((task) => task.completed);
  const notDoneTask = tasks.filter((task) => !task.completed);

  const startEdit = (id) => {};

  const edit = (name) => {};

  const endEdit = async () => {};

  const handleComplete = async (id, completed) => {};

  const addTask = async (task) => {
    const newTask = {
      id: Date.now(),
      task: task,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = async (id) => {};

  return (
    <div className="todo-container">
      <h1 className="todo-title">To Do App</h1>
      <TaskInput
        endEdit={endEdit}
        edit={edit}
        addTask={addTask}
        currentTask={currentTask}
      />
    </div>
  );
}

export default TodoList;
