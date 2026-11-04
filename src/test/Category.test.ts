import { describe, it, expect } from "vitest";
import { Category } from "../models/Category.js";

describe("Category - Testes unitários", () => {
  it("deve criar uma categoria válida", () => {
    const name = "Pizzas";
    const display_order = 1;
    const description = "Categoria de pizzas";
    const icon = "🍕";

    const category = new Category(name, display_order, description, icon);

    expect(category.getName()).toBe("Pizzas");
    expect(category.getDisplayOrder()).toBe(1);
    expect(category.getDescription()).toBe("Categoria de pizzas");
    expect(category.getIcon()).toBe("🍕");
    expect(category.isActive()).toBe(true);
    expect(category.getId()).toBeUndefined();
  });

  it("não deve permitir criar uma categoria sem nome", () => {
    const name = "";
    const display_order = 1;

    expect(() => {
      new Category(name, display_order);
    }).toThrow("O nome da categoria é obrigatório.");
  });

  it("não deve permitir criar uma categoria com nome contendo apenas espaços", () => {
    const name = "        ";
    const display_order = 1;

    expect(() => {
      new Category(name, display_order);
    }).toThrow("O nome da categoria é obrigatório.");
  });

  it("deve remover o espaço antes e depois do nome de uma categoria", () => {
    const name = "   Pizzas   ";
    const display_order = 1;

    const category = new Category(name, display_order);

    expect(category.getName()).toBe("Pizzas");
  });

  it("não deve permitir ordem de exibição negativa", () => {
    const name = "Pizzas";
    const display_order = -1;

    expect(() => {
      new Category(name, display_order);
    }).toThrow(
      "A ordem de exibição deve ser um número inteiro maior ou igual a zero.",
    );
  });

  it("não deve ordem de exibição decimal", () => {
    const name = "Pizzas";
    const display_order = 1.5;

    expect(() => {
      new Category(name, display_order);
    }).toThrow(
      "A ordem de exibição deve ser um número inteiro maior ou igual a zero.",
    );
  });

  it("deve permitir ordem de exibição igual a zero", () => {
    const name = "Pizzas";
    const display_order = 0;

    const category = new Category(name, display_order);

    expect(category.getDisplayOrder()).toBe(0);
  });

  it("deve permitir renomear uma categoria existente", () => {
    const category = new Category("Pizzas", 1);

    category.rename("Bebidas");

    expect(category.getName()).toBe("Bebidas");
  });

  it("deve preservar o nome original após uma tentativa inválida de renomeação", () => {
    const category = new Category("Pizzas", 1);

    expect(() => {
      category.rename("");
    }).toThrow("O nome da categoria é obrigatório.");

    expect(category.getName()).toBe("Pizzas");
  });

  it("deve permitir desativar e reativar uma categoria", () => {
    const category = new Category("Pizzas", 1);

    expect(category.isActive()).toBe(true); //opcional

    category.deactivate();
    expect(category.isActive()).toBe(false);

    category.activate();
    expect(category.isActive()).toBe(true);
  });

  it("deve restaura uma categoria existente", () => {
    const id = "44ec31af-a216-4b49-a112-e51e3187378c";
    const name = "Pizzas";
    const display_order = 1;
    const active = false;
    const description = "Categoria de pizzas";
    const icon = "🍕";

    const category = Category.restore(
      id,
      name,
      display_order,
      active,
      description,
      icon,
    );

    expect(category.getId()).toBe("44ec31af-a216-4b49-a112-e51e3187378c");
    expect(category.getName()).toBe("Pizzas");
    expect(category.getDisplayOrder()).toBe(1);
    expect(category.isActive()).toBe(false);
    expect(category.getDescription()).toBe("Categoria de pizzas");
    expect(category.getIcon()).toBe("🍕");
  });

  it("deve permitir alterar a descrição de uma categoria existente", () => {
    const category = new Category(
      "Pizzas",
      1,
      "Categoria de pizzas tradicionais",
    );

    category.changeDescription("Categoria de pizzas tradicionais e especiais");

    expect(category.getDescription()).toBe(
      "Categoria de pizzas tradicionais e especiais",
    );
  });

  it("deve permitir alterar o ícone de uma categoria existente", () => {
    const category = new Category(
      "Pizzas",
      1,
      "Categoria de pizzas tradicionais",
      "🍕",
    );

    category.changeIcon("🥤");

    expect(category.getIcon()).toBe("🥤");
  });

  it("deve permitir alterar a ordem de exibição de uma categoria existente", () => {
    const category = new Category("Pizzas", 1);

    category.changeDisplayOrder(5);

    expect(category.getDisplayOrder()).toBe(5);
  });

  it("deve preservar a ordem de exibição original após uma alteração inválida", () => {
    const category = new Category("Pizzas", 1);

    expect(() => {
      category.changeDisplayOrder(-5);
    }).toThrow(
      "A ordem de exibição deve ser um número inteiro maior ou igual a zero.",
    );

    expect(category.getDisplayOrder()).toBe(1);
  });
});
