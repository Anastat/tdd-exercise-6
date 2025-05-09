import fs from "fs/promises";

export async function readRleFile(path) {
  const fileContent = await fs.readFile(path, { encoding: "utf8" });

  const { hashLines, headerLine, patternLines } = parseFile(fileContent);

  return hashLines.join("\n") + "\n" + headerLine + "\n" + patternLines.join("\n");
}

function parseFile(content) {
  const lines = content.split(/\r?\n/);
  const trimmedLines = lines.map((line) => line.trim());
  const hashLines = trimmedLines.filter((line) => line.startsWith("#"));
  const [headerLine, ...patternLines] = trimmedLines.filter((line) => !line.startsWith("#"));

  return { hashLines, headerLine, patternLines };
}
