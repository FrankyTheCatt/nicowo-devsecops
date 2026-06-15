/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/tasks/route";

function createPostRequest(body: unknown) {
  return new Request("http://localhost/api/tasks", {
    method: "POST",
    body: JSON.stringify(body),
  }) as NextRequest;
}

describe("tasks route", () => {
  it("devuelve tareas existentes", async () => {
    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.total).toBeGreaterThanOrEqual(3);
    expect(payload.tasks[0]).toHaveProperty("title");
  });

  it("crea una tarea valida", async () => {
    const response = await POST(createPostRequest({ title: "  Revisar pipeline  " }));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload).toEqual(
      expect.objectContaining({
        title: "Revisar pipeline",
        status: "pending",
      }),
    );
  });

  it("rechaza title ausente o no string", async () => {
    const response = await POST(createPostRequest({ title: 123 }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatch(/obligatorio/i);
  });

  it("rechaza title vacio", async () => {
    const response = await POST(createPostRequest({ title: "   " }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatch(/1 y 200/);
  });

  it("rechaza title mayor a 200 caracteres", async () => {
    const response = await POST(createPostRequest({ title: "a".repeat(201) }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatch(/1 y 200/);
  });
});
