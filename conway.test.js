const assert = require("chai").assert;

const isAlive = (cell, world) => world.has(cell);

const shouldDie = neighbours => {
  return neighbours < 2 || neighbours > 3;
};

const shouldComeToLife = neighbours => neighbours == 3;

const getNumberOfNeighbours = (cell, world) =>
  getSurroundingCells(cell).filter(c => world.has(c)).length;

const nextCellState = (cell, world) => {
  const neighbours = getNumberOfNeighbours(cell, world);
  return isAlive(cell, world)
    ? !shouldDie(neighbours)
    : shouldComeToLife(neighbours);
};

const getSurroundingCells = cell => {
  const [sx, sy] = cell.split(",");
  const x = parseInt(sx, 10);
  const y = parseInt(sy, 10);
  return [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
  ].map(([nx, ny]) => `${nx + x},${ny + y}`);
};

const tick = world => {
  const targetCells = new Set();
  world.forEach(cell => {
    getSurroundingCells(cell).forEach(c => targetCells.add(c));
  });

  return new Set(
    Array.from(targetCells.values()).filter(p => nextCellState(p, world))
  );
};

/* Tests */
describe("game of life", () => {
  it("returns an empty world when given an empty world", () => {
    const world = new Set();
    const expected = new Set();
    assert.deepEqual(tick(world), expected);
  });

  it("plays blinker", () => {
    const world = new Set(["0,1", "1,1", "2,1"]);
    const expected = new Set(["1,0", "1,1", "1,2"]);

    assert.deepEqual(tick(world), expected);
    assert.deepEqual(tick(tick(world)), world);
  });

  it("plays still block", () => {
    const world = new Set(["1,1", "2,1", "1,2", "2,2"]);
    assert.deepEqual(tick(world), world);
    assert.deepEqual(tick(tick(world)), world);
  });

  it("plays beacon", () => {
    const world = new Set([
      "1,1",
      "2,1",
      "1,2",
      "2,2",
      "3,3",
      "4,3",
      "3,4",
      "4,4"
    ]);
    const expected = new Set(["1,1", "2,1", "1,2", "4,3", "3,4", "4,4"]);
    assert.deepEqual(tick(world), expected);
    assert.deepEqual(tick(tick(world)), world);
  });
});

describe(getSurroundingCells.name, () => {
  it("returns all neighbouring cells", () => {
    assert.deepEqual(getSurroundingCells("1,1"), [
      "0,0",
      "1,0",
      "2,0",
      "0,1",
      "2,1",
      "0,2",
      "1,2",
      "2,2"
    ]);
  });
});

describe(getNumberOfNeighbours.name, () => {
  it("returns number of neighbours", () => {
    const world = new Set(["0,1", "1,1", "2,1"]);
    assert.equal(getNumberOfNeighbours("1,1", world), 2);
  });
});

describe(nextCellState.name, () => {
  it("return true for a cell with 2 neighbours", () => {
    const world = new Set(["0,1", "1,1", "2,1"]);
    assert.equal(nextCellState("1,1", world), true);
  });
});
