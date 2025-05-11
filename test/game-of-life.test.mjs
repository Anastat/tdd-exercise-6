import { describe, test } from "vitest";
import { expect } from "chai";
import { main } from "../src/game-of-life.mjs";
import path from "path";

describe("Read file", () => {
  test("file output similar to content", async () => {
    const testPath = path.resolve(__dirname, "../test_data/block.rle");
    const file = await main(testPath);

    expect(file).to.equal(
      `#N Block\n#C An extremely common 4-cell still life.\n#C www.conwaylife.com/wiki/index.php?title=Block\nx = 2, y = 2, rule = B3/S23\n2o$2o!`,
    );
  });
});
