import fs from "fs/promises";
import { parseContent } from "./parseContent.mjs";

export async function main(path, iterations) {
  const fileContent = await fs.readFile(path, { encoding: "utf8" });

  const { hashLines, headerLine, patternLinesStr } = parseContent(fileContent);

  return writeToFile(hashLines, headerLine, patternLinesStr);
}

export function writeToFile(hashLines, headerLine, patternLinesStr) {
  return hashLines.join("\n") + "\n" + headerLine + "\n" + patternLinesStr;
}

export function getNeighbours({ x, y }) {
  let neighbours = [];
  let xCell, yCell;

  for (let dx of [-1, 0, 1]) {
    for (let dy of [-1, 0, 1]) {
      if (!(dx === 0 && dy === 0)) {
        xCell = x + dx;
        yCell = y + dy;
        neighbours.push(`${xCell},${yCell}`);
      }
    }
  }

  return neighbours;
}

export function step(cells) {
  const neighbourCounts = new Map();

  for (const cell of cells) {
    for (const n of getNeighbours(cell)) {
      neighbourCounts.set(n, (neighbourCounts.get(n) || 0) + 1);
    }
  }

  const nextGen = [];
  const aliveCells = new Set(cells.map(({ x, y }) => `${x},${y}`));

  for (const [key, count] of neighbourCounts.entries()) {
    const isAlive = aliveCells.has(key);

    if ((isAlive && (count === 2 || count === 3)) || (!isAlive && count === 3)) {
      const [x, y] = key.split(",").map(Number);
      nextGen.push({ x, y });
    }
  }

  return nextGen;
}

export function simulate(world, iterations) {
  let current = world;

  for (let i = 0; i < iterations; i++) {
    current = { ...current, cells: step(current.cells) };
  }

  return current;
}
