import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import supabase from "../config/supabase.js";

describe("Category - Testes de integração", () => {
  const testNames: string[] = [];

  function makeCategoryData() {
    const name = `Teste integração ${randomUUID()}`;

    testNames.push(name);

    return {
      name,
      display_order: 1,
      description: "Categoria criada pelo teste de integração",
      icon: "🍕",
    };
  }

  async function createCategory() {
    const data = makeCategoryData();

    const response = await request(app).post("/categories").send(data);

    expect(response.status).toBe(201);
    expect(response.body.id).toEqual(expect.any(String));

    return {
      id: response.body.id as string,
      data,
    };
  }

  afterEach(async () => {
    const names = testNames.slice(0);

    if (names.length === 0) {
      return;
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .in("name", names); //possível problema...

    if (error) {
      throw new Error(`Falha ao limpar categorias do teste: ${error.message}`);
    }
  });

  it("deve criar uma categoria válida", async () => {
    const data = makeCategoryData();

    const response = await request(app).post("/categories").send(data);

    expect(response.status).toBe(201);
    expect(response.body.id).toEqual(expect.any(String));
    expect(response.body).toMatchObject({
      ...data,
      active: true,
    });
  });

  it("deve listar as categorias inclusive a categoria criada", async () => {
    const { id, data } = await createCategory();

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id,
          name: data.name,
        }),
      ]),
    );
  }, 20_000);

  it("deve consultar uma categoria existente pelo ID", async () => {
    const { id, data } = await createCategory();

    const response = await request(app).get(`/categories/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id,
      ...data,
      active: true,
    });
  }, 20_000);

  it("deve buscar uma categoria por palavra-chave", async () => {
    const { id, data } = await createCategory();

    const response = await request(app).get(
      `/categories/search/${encodeURIComponent(data.name)}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id,
          name: data.name,
        }),
      ]),
    );
  }, 20_000);

  it("deve remover uma categoria existente", async () => {
    const { id } = await createCategory();

    const response = await request(app).delete(`/categories/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Categoria removida com sucesso!",
    });
  }, 20_000);

  it("deve atualizar os dados de uma categoria existente", async () => {
    const { id } = await createCategory();

    const updateData = {
      ...makeCategoryData(),
      description: "Descrição atualizada pelo teste.",
      icon: "🍰",
      display_order: 5,
      active: false,
    };

    const response = await request(app)
      .put(`/categories/${id}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id,
      ...updateData,
    });
  }, 20_000);
});
