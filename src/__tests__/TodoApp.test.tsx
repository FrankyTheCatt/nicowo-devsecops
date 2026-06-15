import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TodoApp from "@/components/TodoApp";
import { Todo } from "@/types/todo";

const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Desde API",
    status: "pending",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

function jsonResponse(data: unknown, init: Partial<Response> = {}) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
    ...init,
  } as Response;
}

describe("TodoApp", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("carga y muestra tareas desde la API", async () => {
    jest.mocked(fetch).mockResolvedValueOnce(jsonResponse({ tasks: initialTodos }));

    render(<TodoApp />);

    expect(screen.getByText("Cargando...")).toBeInTheDocument();
    expect(await screen.findByText("Desde API")).toBeInTheDocument();
  });

  it("agrega una tarea nueva", async () => {
    const newTodo: Todo = {
      id: "2",
      title: "Nueva desde UI",
      status: "pending",
      createdAt: "2026-01-02T00:00:00.000Z",
    };

    jest
      .mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ tasks: initialTodos }))
      .mockResolvedValueOnce(jsonResponse(newTodo, { status: 201 }));

    render(<TodoApp />);

    fireEvent.change(await screen.findByLabelText("Nueva tarea"), {
      target: { value: "Nueva desde UI" },
    });
    fireEvent.click(screen.getByRole("button", { name: /agregar/i }));

    expect(await screen.findByText("Nueva desde UI")).toBeInTheDocument();
    expect(fetch).toHaveBeenLastCalledWith(
      "/api/tasks",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ title: "Nueva desde UI" }),
      }),
    );
  });

  it("muestra error si falla la carga inicial", async () => {
    jest.mocked(fetch).mockRejectedValueOnce(new Error("network"));

    render(<TodoApp />);

    expect(await screen.findByText("Error al cargar las tareas")).toBeInTheDocument();
  });

  it("permite completar y eliminar una tarea", async () => {
    jest.mocked(fetch).mockResolvedValueOnce(jsonResponse({ tasks: initialTodos }));

    render(<TodoApp />);

    fireEvent.click(await screen.findByLabelText("Marcar Desde API"));
    expect(screen.getByText("Completada")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Eliminar Desde API"));

    await waitFor(() => expect(screen.queryByText("Desde API")).not.toBeInTheDocument());
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("muestra error cuando la API rechaza una nueva tarea", async () => {
    jest
      .mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ tasks: initialTodos }))
      .mockResolvedValueOnce(jsonResponse({ error: "bad" }, { ok: false, status: 400 }));

    render(<TodoApp />);

    fireEvent.change(await screen.findByLabelText("Nueva tarea"), {
      target: { value: "Entrada mala" },
    });
    fireEvent.click(screen.getByRole("button", { name: /agregar/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/error al agregar/i);
  });
});
