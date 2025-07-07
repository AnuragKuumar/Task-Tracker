import React, { useState } from "react";

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(false);
    onDelete(task.id);
  };

  return (
    <div className={`task-item ${task.completed ? "completed" : "pending"}`}>
      <div className="task-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          aria-label={`Mark task "${task.title}" complete`}
        />
        <div className="task-info" onDoubleClick={() => onEdit(task)}>
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
          <small>
            Created: {new Date(task.createdAt).toLocaleString()}
          </small>
        </div>
      </div>
      <div className="task-actions">
        <button onClick={() => onEdit(task)} aria-label="Edit task">✏️</button>
        <button onClick={() => setShowConfirm(true)} aria-label="Delete task">🗑️</button>
      </div>

      {showConfirm && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete this task?</p>
          <button onClick={handleDelete} className="confirm-btn">Yes</button>
          <button onClick={() => setShowConfirm(false)} className="cancel-btn">No</button>
        </div>
      )}
    </div>
  );
}
