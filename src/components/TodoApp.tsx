"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTodos(data.tasks))
      .catch(() => setError("Error al cargar las tareas"))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(title: string) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error("Error al crear tarea");
    }

    const newTodo: Todo = await res.json();
    setTodos((prev) => [...prev, newTodo]);
  }

  function handleToggle(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status: todo.status === "pending" ? "completed" : "pending",
            }
          : todo,
      ),
    );
  }

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  if (loading) {
    return <p className="py-8 text-center">Cargando...</p>;
  }

  if (error) {
    return <p className="py-8 text-center text-red-600">{error}</p>;
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-2 text-3xl font-bold text-gray-800">Mi Lista de Tareas</h1>
      <p className="mb-6 text-gray-500">Proyecto DEVSecOps - UCN</p>
      <TodoForm onAdd={handleAdd} />
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
    </main>
  );
}
