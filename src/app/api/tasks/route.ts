import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { CreateTodoInput, Todo } from "@/types/todo";

const tasks: Todo[] = [
  {
    id: "1",
    title: "Instalar Node.js 20",
    status: "completed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Crear proyecto Next.js",
    status: "completed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Configurar pipeline CI/CD",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({ tasks, total: tasks.length });
}

export async function POST(request: NextRequest) {
  const body: CreateTodoInput = await request.json();

  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json(
      { error: "El campo title es obligatorio" },
      { status: 400 },
    );
  }

  const trimmed = body.title.trim();

  if (trimmed.length === 0 || trimmed.length > 200) {
    return NextResponse.json(
      { error: "El titulo debe tener entre 1 y 200 caracteres" },
      { status: 400 },
    );
  }

  const newTask: Todo = {
    id: randomUUID(),
    title: trimmed,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  return NextResponse.json(newTask, { status: 201 });
}
