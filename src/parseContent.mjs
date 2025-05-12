const RULE = "B3/S23";
const HASH = "#";
const ALIVE_CELL = "o";
const DEAD_CELL = "b";
const END_LINE = "$";
const END = "!";

export function fileContentToWorld(data) {
  let lines = parseContent(data).patternLinesStr;

  return { cells: patternToCells(lines) };
}

export function worldToFile(world) {
  let pattern = cellsToPattern(world);
  let headerLine = `x = ${pattern.width}, y = ${pattern.height}, rule = ${RULE}`;

  return [headerLine, pattern.pattern].join("\n");
}

export function parseContent(content) {
  if (!content) throw Error("RLE file is empty");

  const lines = content.split(/\r?\n/);
  const trimmedLines = lines.map((line) => line.trim()).filter((line) => line !== "");
  const hashLines = trimmedLines.filter((line) => line.startsWith(HASH));
  const [headerLine, ...patternLines] = trimmedLines.filter((line) => !line.startsWith(HASH));

  if (!headerLine.includes("x") && !headerLine.includes("y")) throw Error("File doesn't contain header");

  const rule = extractRuleFromHeader(headerLine);

  if (rule != RULE) throw Error("The rule should be 'B3/S23'");

  const patternLinesStr = patternLines.join("");

  return { hashLines, headerLine, patternLinesStr };
}

function extractRuleFromHeader(header) {
  if (!header.includes("rule =")) return "";

  return header.split("rule =")[1].trim();
}

export function encodePattern(pattern) {
  return pattern.replace(/(\D)\1+/g, (match) => `${match.length}${match[0]}`);
}

export function decodePattern(pattern) {
  return pattern.replace(/(\d+)(\D)/g, (_, count, char) => char.repeat(Number(count)));
}

export function patternToCells(pattern) {
  const decoded = decodePattern(pattern);

  const cells = new Set();
  let x = 0,
    y = 0;

  for (const char of decoded) {
    if (char === ALIVE_CELL) {
      cells.add(`${x}, ${y}`);
      x++;
    } else if (char === DEAD_CELL) {
      x++;
    } else if (char === END_LINE) {
      x = 0;
      y++;
    } else if (char === END) {
      break;
    }
  }

  return new Set(
    [...cells].map((cell) => {
      const [x, y] = cell.split(",").map(Number);

      return { x, y };
    }),
  );
}

export function cellsToPattern(cells) {
  const cellSet = new Set([...cells].map((cell) => `${cell.x},${cell.y}`));
  const xCells = Array.from(cells).map((cell) => cell.x);
  const yCells = Array.from(cells).map((cell) => cell.y);

  const minX = Math.min(...xCells, 0);
  const maxX = Math.max(...xCells, 0);
  const minY = Math.min(...yCells, 0);
  const maxY = Math.max(...yCells, 0);

  let rows = [];

  for (let y = minY; y <= maxY; y++) {
    let row = "";

    for (let x = minX; x <= maxX; x++) {
      row += cellSet.has(`${x},${y}`) ? ALIVE_CELL : DEAD_CELL;
    }

    row = row.replace(/^b+/, "");

    if (row) rows.push(row);
  }

  return { width: maxX - minX + 1, height: maxY - minY + 1, pattern: encodePattern(rows.join(END_LINE) + END) };
}
