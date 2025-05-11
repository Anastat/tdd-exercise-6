import { describe, test } from "vitest";
import { expect } from "chai";
import { parseContent, encodePattern, decodePattern, patternToCells, cellsToPattern } from "../src/parseContent.mjs";

const testContent = `#N Blinker
    #O John Conway
    #C A period 2 oscillator that is the smallest and most common oscillator.
    #C www.conwaylife.com/wiki/index.php?title=Blinker
    x = 3, y = 1, rule = B3/S23
    3o!`;

describe("Parse file content ", () => {
  test("throws an error if file is empty ", async () => {
    const result = () => parseContent("");

    expect(result).to.throw("RLE file is empty");
  });

  test("header line to be 'x = 3, y = 1, rule = B3/S23'", async () => {
    const result = parseContent(testContent);

    expect(result.headerLine).to.be.equal("x = 3, y = 1, rule = B3/S23");
  });

  test("header line to have rule", async () => {
    const result = parseContent(testContent);

    expect(result.headerLine).to.be.contain("rule = B3/S23");
  });

  test("throws Error if rule is not 'B3/S23'", async () => {
    const result = () =>
      parseContent(`x = 3, y = 1, rule = B3
    3o!`);

    expect(result).to.throw("The rule should be 'B3/S23'");
  });

  test("throws Error if RLE file has no header", async () => {
    const result = () =>
      parseContent(`#N Blinker
    #O John Conway
    #C A period 2 oscillator that is the smallest and most common oscillator.
    #C www.conwaylife.com/wiki/index.php?title=Blinker
    3o!`);

    expect(result).to.throw("File doesn't contain header");
  });

  test("ignores empty lines ", async () => {
    const result = parseContent(`#N Blinker
    #O John Conway


    #C A period 2 oscillator that is the smallest and most common oscillator.
    #C www.conwaylife.com/wiki/index.php?title=Blinker
    x = 3, y = 1, rule = B3/S23
    
    3o!`);

    expect(result.headerLine).to.be.equal("x = 3, y = 1, rule = B3/S23");
    expect(result.patternLinesStr).to.be.equal("3o!");
  });
});

describe("Content encoding/decoding ", () => {
  test("encodes line properly", async () => {
    expect(encodePattern("!")).to.be.equal("!");
    expect(encodePattern("ooobb$!")).to.be.equal("3o2b$!");
  });

  test("decodes line correctly", async () => {
    expect(decodePattern("$")).to.be.equal("$");
    expect(decodePattern("3o2b$!")).to.be.equal("ooobb$!");
  });
});

describe("Pattern to cells ", () => {
  test("parse correctly pattern to cells", async () => {
    const pattern = "2o$2o!";
    const cells = patternToCells(pattern);

    const expected = new Set([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);

    for (const cell of expected) {
      expect([...cells]).to.deep.include(cell);
    }
  });

  test("ignores pattern after '!'", async () => {
    const pattern = "2o$2o!oo";
    const cells = patternToCells(pattern);

    const expected = new Set([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);

    for (const cell of expected) {
      expect([...cells]).to.deep.include(cell);
    }
  });

  test("parse correct result with dead cells", async () => {
    const pattern = "bobo$3o";
    const cells = patternToCells(pattern);

    const expected = new Set([
      { x: 1, y: 0 },
      { x: 3, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ]);

    for (const cell of expected) {
      expect([...cells]).to.deep.include(cell);
    }
  });

  describe("Cells to pattern parse correctly ", () => {
    test("cells to pattern ", async () => {
      const cells = new Set([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ]);

      const pattern = cellsToPattern(cells);

      expect(pattern).to.be.equal("2o$2o!");
    });

    test("one cell to pattern ", async () => {
      const cells = new Set([
        { x: 6, y: 7}
      ]);

      const pattern = cellsToPattern(cells)

      expect(pattern).to.be.equal("o!")
    });

    test("no cells ", async () => {
      const cells = new Set();

      const pattern = cellsToPattern(cells)

      expect(pattern).to.be.equal("!")
    });

    test("cells in same row", async () => {
      const cells = new Set([
        { x: 0, y: 0},
        { x: 1, y: 0},
        { x: 2, y: 0}
      ]);

      const pattern = cellsToPattern(cells)

      expect(pattern).to.be.equal("3o!")
    });

    test("cells in same column", async () => {
      const cells = new Set([
        { x: 0, y: 0},
        { x: 0, y: 1},
        { x: 0, y: 2}
      ]);

      const pattern = cellsToPattern(cells)

      expect(pattern).to.be.equal("o$o$o!")
    });
  });
});
