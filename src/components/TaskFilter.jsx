import React from "react";

export default function TaskFilter({ currentFilter, onChange, counts }) {
  return (
    <div className="task-filter">
      {["All", "Completed", "Pending"].map((filter) => (
        <button
          key={filter}
          className={currentFilter === filter ? "active" : ""}
          onClick={() => onChange(filter)}
        >
          {filter} ({counts[filter.toLowerCase()] || 0})
        </button>
      ))}
    </div>
  );
}
