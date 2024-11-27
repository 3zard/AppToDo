import React from "react";

function TaskList(props) {
  const { doneTask, list, deleteTask, handleComplete, startEdit } = props;

  const onChangeCheckbox = (id) => (e) => {
    handleComplete(id, e.target.checked);
  };

  return (
    <div className="task-container">
            <h2 className="task-container-title">{doneTask ? "Done" : "Todo"}</h2>
      <div className="tasks">
        {list.map((task) => (
          <div className="task" key={task.id}>
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.completed}
              onChange={onChangeCheckbox(task.id)}
            />
            <span
              className={`task-name ${task.completed ? "task-name-done" : ""}`}
            >
              {task.task}
            </span>
            <div className="task-actions">
              <button onClick={() => deleteTask(task.id)}>🗑️</button>
              <button onClick={() => startEdit(task.id)}>✒️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
