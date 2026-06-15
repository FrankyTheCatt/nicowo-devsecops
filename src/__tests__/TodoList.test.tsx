import { render, screen, within } from "@testing-library/react";
import TodoList from "@/components/TodoList";
import { Todo } from "@/types/todo";

const mockTodos: Todo[] = [
  { id: "1", title: "Primera tarea", status: "pending", createdAt: "" },
  { id: "2", title: "Segunda tarea", status: "completed", createdAt: "" },
];

describe("TodoList", () => {
  it("muestra mensaje cuando no hay tareas", () => {
    render(<TodoList todos={[]} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("renderiza todas las tareas recibidas", () => {
    render(<TodoList todos={mockTodos} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getAllByTestId("todo-item")).toHaveLength(2);
  });

  it("muestra los contadores correctos", () => {
    render(<TodoList todos={mockTodos} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("Pendientes:")).toBeInTheDocument();
    expect(screen.getByText("Completadas:")).toBeInTheDocument();
    expect(within(screen.getByText("Total:")).getByText("2")).toBeInTheDocument();
  });
});
