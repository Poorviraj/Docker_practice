import { useEffect, useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/todos`)
      .then(res => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    setTodos([...todos, data]);
    setText("");
  };

  return (
    <div>
      <h2>Todo App</h2>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(t => <li key={t._id}>{t.text}</li>)}
      </ul>
    </div>
  );
}

export default App;
