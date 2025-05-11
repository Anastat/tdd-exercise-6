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
