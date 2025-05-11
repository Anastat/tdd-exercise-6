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
