import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("light");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [theme]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(Array.isArray(savedTasks) ? savedTasks : []);
    
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("theme", theme);
  }, [tasks, theme]);

  const addTask = () => {
    if (input.trim() === "") return;
    const newTask = {
      id: Date.now(),
      text: input,
      completed: false,
        isEditing: false
    };
    setTasks([...tasks, newTask]);
    setInput("");
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

const editTask = (id) => {
  setTasks(tasks.map(task =>
    task.id === id ? { ...task, isEditing: true } : task
  ));
};

const saveTask = (id, newText) => {
  setTasks(tasks.map(task =>
    task.id === id ? { ...task, text: newText, isEditing: false } : task
  ));
};

const filteredTasks = tasks.filter((task) => {
  if (filter === "all") return true;
  if (filter === "completed") return task.completed;
  if (filter === "incomplete") return !task.completed;
});

  return (
    <div className="app-container">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
      
      <div className="todo-box">
        <h1>To Do List</h1>
        <div className="input-group">
          <input
            placeholder="Enter a task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button className="add-btn" onClick={addTask}>Add Task</button>
        </div>
        <div className="filter-buttons">
  <button
    className={filter === "all" ? "active" : ""}
    onClick={() => setFilter("all")}
  >
    All
  </button>
  <button
    className={filter === "completed" ? "active" : ""}
    onClick={() => setFilter("completed")}
  >
    Completed
  </button>
  <button
    className={filter === "incomplete" ? "active" : ""}
    onClick={() => setFilter("incomplete")}
  >
    Incomplete
  </button>
</div>

       <ul>
  {filteredTasks.map((task) => (
    <li key={task.id}>
      {task.isEditing ? (
        <input
          type="text"
          defaultValue={task.text}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveTask(task.id, e.target.value);
          }}
        />
      ) : (
        <span
          className={`task-text ${task.completed ? "completed" : ""}`}
          onClick={() => toggleComplete(task.id)}
        >
          {task.text}
        </span>
      )}
      
      {!task.isEditing && (
        <>
          <button className="edit-btn" onClick={() => editTask(task.id)}>
            Edit
          </button>
          <button className="delete-btn" onClick={(e) => { e.stopPropagation(); removeTask(task.id); }}>
            Delete
          </button>
        </>
      )}
    </li>
  ))}
</ul>

        {tasks.length === 0 && (
          <p className="empty-state">
            No tasks yet. Add your first task! 📝
          </p>
        )}
      </div>
    </div>
  );
}

export default App;