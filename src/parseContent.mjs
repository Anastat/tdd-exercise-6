export function parseContent(content) {
  const lines = content.split(/\r?\n/);
  const trimmedLines = lines.map((line) => line.trim());
  const hashLines = trimmedLines.filter((line) => line.startsWith("#"));
  const [headerLine, ...patternLines] = trimmedLines.filter((line) => !line.startsWith("#"));

  return { hashLines, headerLine, patternLines };
}
