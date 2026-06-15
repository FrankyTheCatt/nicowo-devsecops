import { fireEvent, render, screen } from "@testing-library/react";
import TodoItem from "@/components/TodoItem";
import { Todo } from "@/types/todo";

const mockTodo: Todo = {
  id: "1",
  title: "Tarea de prueba",
  status: "pending",
  createdAt: "",
};

describe("TodoItem", () => {
  it("muestra el titulo", () => {
    render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText("Tarea de prueba")).toBeInTheDocument();
  });

  it("muestra badge Pendiente", () => {
    render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  it("llama onToggle con el id al hacer click en checkbox", () => {
    const onToggle = jest.fn();
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={jest.fn()} />);

    fireEvent.click(screen.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledWith("1");
  });

  it("llama onDelete al hacer click en Eliminar", () => {
    const onDelete = jest.fn();
    render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={onDelete} />);

    fireEvent.click(screen.getByText("Eliminar"));

    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("muestra Completada cuando status es completed", () => {
    const done = { ...mockTodo, status: "completed" as const };
    render(<TodoItem todo={done} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText("Completada")).toBeInTheDocument();
  });
});
