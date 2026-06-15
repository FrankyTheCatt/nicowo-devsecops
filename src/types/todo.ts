export type TodoStatus = "pending" | "completed";

export interface Todo {
  id: string;
  title: string;
  status: TodoStatus;
  createdAt: string;
}

export interface CreateTodoInput {
  title: string;
}
