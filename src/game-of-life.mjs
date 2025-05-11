import fs from "fs/promises";
import { parseContent } from "./parseContent.mjs";

export async function main(path, iterations) {
  const fileContent = await fs.readFile(path, { encoding: "utf8" });

  const { hashLines, headerLine, patternLines } = parseContent(fileContent);

  return writeToFile(hashLines, headerLine, patternLines);
}

export function writeToFile(hashLines, headerLine, patternLines) {
  return hashLines.join("\n") + "\n" + headerLine + "\n" + patternLines.join("\n");
}

