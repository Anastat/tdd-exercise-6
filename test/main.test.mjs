import { describe, test } from "vitest";
import { expect } from "chai";
import { main } from "../src/main.mjs";
import { readFile } from "fs/promises";
import path from "path";

describe("Read file", () => {
  test("file output similar to content", async () => {
    const testPath = path.resolve(__dirname, "../test_data/block.rle");
    const file = await main(testPath);

    expect(file).to.equal(`x = 2, y = 2, rule = B3/S23\n2o$2o!`);
  });
});

describe("Simulate game ", async () => {
  test("file output matches expected after 12 generations", async () => {
    const testPath = path.resolve(__dirname, "../test_data/biloafpgg.rle");
    const outputPath = path.resolve(__dirname, "../test_data/output.rle");
    const expectedPath = path.resolve(__dirname, "../test_data/biloafpgg-12.rle");

    const file = await main(testPath, 12, outputPath);

    const actual = await readFile(outputPath, { encoding: "utf8" });
    const expected = await readFile(expectedPath, { encoding: "utf8" });

    const normalize = (str) => str.replace(/\r\n/g, "\n").trim();

    expect(normalize(actual)).to.equal(normalize(expected));
  });
});
