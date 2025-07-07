import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilter from "./components/TaskFilter";
import { loadFromStorage, saveToStorage } from "./utils/localStorage";
import "./styles/App.css";

const STORAGE_USER_KEY = "taskTrackerUser";
const STORAGE_TASKS_KEY = "taskTrackerTasks";

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Load user and tasks from localStorage on mount
  useEffect(() => {
    const savedUser = loadFromStorage(STORAGE_USER_KEY);
    const savedTasks = loadFromStorage(STORAGE_TASKS_KEY) || [];
    if (savedUser) setUser(savedUser);
    setTasks(savedTasks);
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_TASKS_KEY, tasks);
  }, [tasks]);

  // Save user when it changes
  useEffect(() => {
    if (user) saveToStorage(STORAGE_USER_KEY, user);
    else localStorage.removeItem(STORAGE_USER_KEY);
  }, [user]);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    setFilter("All");
    localStorage.removeItem(STORAGE_TASKS_KEY);
  };

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      title: task.title,
      description: task.description,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
    );
    setTaskToEdit(null);
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (taskToEdit && taskToEdit.id === taskId) {
      setTaskToEdit(null);
    }
  };

  const toggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.completed;
    if (filter === "Pending") return !task.completed;
    return true;
  });

  const counts = {
    all: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <header>
        <h1>Personal Task Tracker</h1>
        <div className="user-info">
          <span>Logged in as: <b>{user}</b></span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main>
        <TaskForm
          onSave={taskToEdit ? updateTask : addTask}
          taskToEdit={taskToEdit}
          onCancel={() => setTaskToEdit(null)}
        />

        <TaskFilter currentFilter={filter} onChange={setFilter} counts={counts} />

        <TaskList
          tasks={filteredTasks}
          onToggleComplete={toggleComplete}
          onEdit={setTaskToEdit}
          onDelete={deleteTask}
        />
      </main>
    </div>
  );
}
