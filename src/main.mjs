import fs from "fs/promises";
import { fileContentToWorld, worldToFile } from "./parseContent.mjs";
import { simulate } from "./game.mjs";

export async function main(path, iterations, outputFile) {
  const fileContent = await fs.readFile(path, { encoding: "utf8" });
  const world = fileContentToWorld(fileContent);
  const gen = simulate(world, iterations);
  const output = worldToFile(gen.cells);

  //const { hashLines, headerLine, patternLinesStr } = parseContent(fileContent);
  if (outputFile) {
    await fs.writeFile(outputFile, output, { encoding: "utf8" });
  }

  return output;
}

export function writeToFile(hashLines, headerLine, patternLinesStr) {
  return hashLines.join("\n") + "\n" + headerLine + "\n" + patternLinesStr;
}
