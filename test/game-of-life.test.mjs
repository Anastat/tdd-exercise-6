import { describe, test } from "vitest";
import { expect } from "chai";
import { main, getNeighbours, step, simulate } from "../src/game-of-life.mjs";
import path from "path";

describe("Read file", () => {
  test("file output similar to content", async () => {
    const testPath = path.resolve(__dirname, "../test_data/block.rle");
    const file = await main(testPath);

    expect(file).to.equal(
      `#N Block\n#C An extremely common 4-cell still life.\n#C www.conwaylife.com/wiki/index.php?title=Block\nx = 2, y = 2, rule = B3/S23\n2o$2o!`,
    );
  });
});

describe("Count neighbours", () => {
  test("cell has correct neighbours", () => {
    const testCell = { x: 5, y: 5 };
    const result = getNeighbours(testCell);
    const expected = new Set(["4,4", "5,4", "6,4", "4,5", "6,5", "4,6", "5,6", "6,6"]);

    expect([...expected].sort()).to.deep.equal([...result].sort());
  });

  test("list of neighbours don't have cell itself", () => {
    const result = getNeighbours({ x: 0, y: 0 });

    const hasCell = result.some((neighbour) => neighbour.x === 0 && neighbour.y === 0);

    expect(hasCell).to.be.false;
  });
});

describe("Validate game rules", () => {
  test("live cell with 0 neighbours dies", () => {
    const cells = [{ x: 5, y: 5 }];
    const next = step(cells);

    expect(next).to.deep.equal([]);
  });

  test("live cell with 1 neighbours dies", () => {
    const cells = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ];

    const next = step(cells);

    expect(next).to.deep.equal([]);
  });

  test("live cell with 2 neighbours survives", () => {
    const cells = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ];

    const next = step(cells);
    const nextSet = new Set(next.map(({ x, y }) => `${x},${y}`));

    expect(nextSet).to.include("0,0");
  });

  test("live cell with 3 neighbours survives", () => {
    const cells = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ];

    const next = step(cells);
    const nextSet = new Set(next.map(({ x, y }) => `${x},${y}`));

    expect(nextSet).to.include("0,0");
  });

  test("live cell with 4 neighbours dies", () => {
    const cells = [
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 2 },
    ];

    const next = step(cells);
    const nextSet = new Set(next.map(({ x, y }) => `${x},${y}`));

    expect(nextSet).not.to.include("1,1");
  });

  test("dead cell with 3 neighbours becomes alive", () => {
    const cells = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];

    const next = step(cells);
    const nextSet = new Set(next.map(({ x, y }) => `${x},${y}`));

    expect(nextSet).to.include("1,1");
  });
});

describe("Simulate game", () => {
  test("blinker after 2 gen returns to origin", () => {
    const cells = [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ];

    const result = simulate({ cells: cells });

    const original = new Set(cells.map(({ x, y }) => `${x},${y}`));
    const resultSet = new Set(result.cells.map(({ x, y }) => `${x},${y}`));

    expect([...original]).to.deep.equal([...resultSet]);
  });

  test("empty word stays empty", () => {
    const cells = [];
    const result = simulate({ cells: cells });

    const original = new Set(cells.map(({ x, y }) => `${x},${y}`));
    const resultSet = new Set(result.cells.map(({ x, y }) => `${x},${y}`));

    expect([...original]).to.deep.equal([...resultSet]);
  });

  test("glider moves diagonally after 4 generations ", () => {
    const glider = [
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ];

    const expected = [
      { x: 2, y: 1 },
      { x: 3, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ];

    const result = simulate({ cells: glider }, 4);

    const expectedSet = new Set(expected.map(({ x, y }) => `${x},${y}`));
    const resultSet = new Set(result.cells.map(({ x, y }) => `${x},${y}`));

    expect([...expectedSet].sort()).to.deep.equal([...resultSet].sort());
  });

});
