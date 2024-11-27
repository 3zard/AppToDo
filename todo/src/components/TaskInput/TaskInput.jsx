import React, { useState } from "react";

function TaskInput(props) {
  const [task, setTask] = useState("");
  const { addTask, currentTask, edit, endEdit } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentTask) {
      endEdit();
      if (task) setTask("");
      return;
    }
    addTask(task);
    setTask("");
  };

  const onChangeInput = (e) => {
    if (currentTask) {
      edit(e.target.value);
      return;
    }
    setTask(e.target.value);
  };

  return (
    <div className="task-form">
      <input
        type="text"
        placeholder="enter task name..."
        value={currentTask ? currentTask.task : task}
        onChange={onChangeInput}
      />
      <button type="submit" onClick={handleSubmit}>
        {currentTask ? "✔️" : "➕"}
      </button>
    </div>
  );
}

export default TaskInput;
