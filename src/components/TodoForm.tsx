"use client";

import { FormEvent, useState } from "react";

interface TodoFormProps {
  onAdd: (title: string) => Promise<void>;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const trimmed = title.trim();

    if (!trimmed) {
      setError("El titulo no puede estar vacio");
      return;
    }

    if (trimmed.length > 200) {
      setError("Maximo 200 caracteres");
      return;
    }

    setLoading(true);

    try {
      await onAdd(trimmed);
      setTitle("");
    } catch {
      setError("Error al agregar la tarea. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Escribe una nueva tarea..."
          disabled={loading}
          aria-label="Nueva tarea"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Agregando..." : "Agregar"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
