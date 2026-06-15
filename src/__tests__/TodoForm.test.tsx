import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TodoForm from "@/components/TodoForm";

describe("TodoForm", () => {
  it("renderiza input y boton", () => {
    render(<TodoForm onAdd={jest.fn()} />);

    expect(screen.getByPlaceholderText(/nueva tarea/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /agregar/i })).toBeInTheDocument();
  });

  it("muestra error si se envia formulario vacio", async () => {
    render(<TodoForm onAdd={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /agregar/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/vacio/i));
  });

  it("muestra error si supera 200 caracteres", async () => {
    render(<TodoForm onAdd={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/nueva tarea/i), {
      target: { value: "a".repeat(201) },
    });
    fireEvent.click(screen.getByRole("button", { name: /agregar/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/200/));
  });

  it("llama onAdd con el titulo ingresado", async () => {
    const onAdd = jest.fn().mockResolvedValue(undefined);
    render(<TodoForm onAdd={onAdd} />);

    fireEvent.change(screen.getByPlaceholderText(/nueva tarea/i), {
      target: { value: "Nueva tarea CI/CD" },
    });
    fireEvent.click(screen.getByRole("button", { name: /agregar/i }));

    await waitFor(() => expect(onAdd).toHaveBeenCalledWith("Nueva tarea CI/CD"));
  });

  it("limpia el input tras exito", async () => {
    const onAdd = jest.fn().mockResolvedValue(undefined);
    render(<TodoForm onAdd={onAdd} />);

    const input = screen.getByPlaceholderText(/nueva tarea/i);
    fireEvent.change(input, { target: { value: "Temporal" } });
    fireEvent.click(screen.getByRole("button", { name: /agregar/i }));

    await waitFor(() => expect(input).toHaveValue(""));
  });

  it("muestra error si onAdd falla", async () => {
    const onAdd = jest.fn().mockRejectedValue(new Error("fallo"));
    render(<TodoForm onAdd={onAdd} />);

    fireEvent.change(screen.getByPlaceholderText(/nueva tarea/i), {
      target: { value: "Falla esperada" },
    });
    fireEvent.click(screen.getByRole("button", { name: /agregar/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/error al agregar/i),
    );
  });
});
