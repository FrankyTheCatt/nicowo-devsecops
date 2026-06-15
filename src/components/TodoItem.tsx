import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const isCompleted = todo.status === "completed";

  return (
    <li
      data-testid="todo-item"
      className={`flex items-center gap-3 rounded-lg border p-4 ${
        isCompleted ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"
      }`}
    >
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={() => onToggle(todo.id)}
        aria-label={`Marcar ${todo.title}`}
        className="h-5 w-5 cursor-pointer"
      />

      <span
        className={`flex-1 text-sm ${
          isCompleted ? "text-gray-400 line-through" : "text-gray-800"
        }`}
      >
        {todo.title}
      </span>

      <span
        className={`rounded-full px-2 py-1 text-xs ${
          isCompleted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {isCompleted ? "Completada" : "Pendiente"}
      </span>

      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Eliminar ${todo.title}`}
        className="text-sm font-medium text-red-400 hover:text-red-600"
      >
        Eliminar
      </button>
    </li>
  );
}
