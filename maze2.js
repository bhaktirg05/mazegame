const r = require("raylib");
const m = require("./math");

const generateMap = function (rows, cols) {
    const map = [];
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            row.push(0);
        }
        map.push(row);
    }
    return map;
};

const getNeighbors = function ({ y, x }, arr) {
    const neighborPoints = [];
    const rowStart = Math.max(0, y - 1);
    const rowEnd = Math.min(y + 1, arr.length - 1);
    const colStart = Math.max(0, x - 1);
    const colEnd = Math.min(x + 1, arr.length - 1);

    for (let row = rowStart; row <= rowEnd; row++) {
        if (row !== y) neighborPoints.push({ y: row, x });
    }

    for (let col = colStart; col <= colEnd; col++) {
        if (col !== x) neighborPoints.push({ y, x: col });
    }
    return neighborPoints;
};

const filterNeighbor = function (neighbors, arr) {
    const filteredNeighbors = [];
    for (let key = 0; key < neighbors.length; key++) {
        const { y, x } = neighbors[key];

        if (arr[y][x] === 0) filteredNeighbors.push(neighbors[key]);
    }
    return filteredNeighbors;
};

const isDeathEnd = function (neighbors, arr) {
    let count = 0;
    for (const { y, x } of neighbors) {
        if (arr[y][x] === 0) count++;
    }
    return !(count > 0);
};

const isNeighborVisited = function (neighbours, arr, value) {
    let count = 0;
    for (const { y, x } of neighbours) {
        if (arr[y][x] === value) count++;
    }
    return count >= 2;
};

const dbg = function (value, name = "") {
    console.log(name, ":", value);
    return value;
};

const firstStartPoint = function (storage, map, ROWS) {
    // const start = [
    //     {
    //         y: 0,
    //         x: m.random(0, 3),
    //     },
    //     {
    //         y: ROWS - 1,
    //         x: m.random(0, 3),
    //     },
    //     {
    //         y: m.random(0, 3),
    //         x: 0,
    //     },
    // ];
    // const index = m.random(0, 2);
    // const { y, x } = start[index];
    const y = m.random(0, ROWS - 1);
    const x = 0;
    map[y][x] = 1;
    storage.push({ y, x });
};

const getFilteredNeighbours = function (arr, map) {
    const neighbors = getNeighbors(arr, map);
    return filterNeighbor(neighbors, map);
};

const backtrack = function (neighbours, storage, map) {
    while (neighbours.length === 0) {
        const { y, x } = storage.at(-1);
        map[y][x] = 1;
        storage.pop();

        neighbours = getFilteredNeighbours(storage.at(-1), map);
    }

    return neighbours;
};

const randomFromData = function (data) {
    const i = m.random(0, data.length - 1);
    return data[i];
};

const generatePath = function (map) {
    const storage = [];
    const ROWS = map.length;
    const COLS = map.at(0).length;
    firstStartPoint(storage, map, ROWS);

    while (storage.at(-1).x !== COLS - 1) {
        let neightbours = getFilteredNeighbours(storage.at(-1), map);

        if (neightbours.length === 0) {
            neightbours = backtrack(neightbours, storage, map);
        }

        const randomNeighbour = randomFromData(neightbours);
        const indexNeighb = getNeighbors(randomNeighbour, map);

        map[randomNeighbour.y][randomNeighbour.x] = 1;
        if (
            !isDeathEnd(indexNeighb, map) &&
            !isNeighborVisited(indexNeighb, map, 1)
        )
            storage.push(randomNeighbour);
    }
    return storage;
};

const isInclude = function (path, i, j) {
    for (const { y, x } of path) {
        if (y === i && x === j) return true;
    }
    return false;
};

const removePathPoints = function (pointNeighbors, path, map) {
    const neighbours = [];
    for (const { y, x } of pointNeighbors) {
        if (!isInclude(path, y, x) && map[y][x] !== 2)
            neighbours.push({ y, x });
    }
    return neighbours;
};

const getWallNeighbors = function ({ y, x }, arr) {
    const neighborPoints = [];
    const rowStart = Math.max(0, y - 2);
    const rowEnd = Math.min(y + 2, arr.length - 1);
    const colStart = Math.max(0, x - 2);
    const colEnd = Math.min(x + 2, arr.length - 1);

    for (let row = rowStart; row <= rowEnd; row++) {
        if (row !== y) neighborPoints.push({ y: row, x });
    }

    for (let col = colStart; col <= colEnd; col++) {
        if (col !== x) neighborPoints.push({ y, x: col });
    }
    return neighborPoints;
};

const filteredWallNeighbours = function (point, map, path) {
    const pointNeighbors = getWallNeighbors(point, map);
    pointNeighbors.splice(0, 0, point);
    return removePathPoints(pointNeighbors, path, map);
};

const generateBlocks = function (path, map) {
    const blocks = [];
    for (let j = 0; j < map.length; j += 2) {
        for (let i = 0; i < map.at(0).length; i += 2) {
            const neighbors = filteredWallNeighbours({ y: j, x: i }, map, path);
            const endIndex = m.random(2, neighbors.length - 1);
            blocks.push(neighbors.slice(0, endIndex));
        }
    }
    return blocks;
};

const isCellAtEdge = function (i, j, length) {
    return i === 0 || j === 0 || i === length || j === length;
};

const isBlock = function (walls, i, j, length, path) {
    for (const block of walls) {
        if (
            (isCellAtEdge(i, j, length) && !isInclude(path, i, j)) ||
            isInclude(block, i, j)
        )
            return true;
    }
    return false;
};

// const chooseColor = function (walls, i, j, length, path) {
//     return isBlock(walls, i, j, length, path) ? r.BLACK : r.WHITE;
// };

const chooseColor = function (walls, i, j, length, path) {
    return isBlock(walls, i, j, length, path) ? r.BLACK : r.WHITE;
};

const generateMaze = function (path, blocks, grid) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid.at(0).length; x++) {
            grid[y][x] = isBlock(blocks, y, x, grid.at(0).length - 1, path)
                ? 1
                : 0;
        }
    }
    return grid;
};
// (isCellAtEdge(i, j, length) && !isInclude(path, i, j)) ||

function getObject(row, col, map) {
    const x = map.gap + col * map.size;
    const y = map.gap + row * map.size;
    const color = chooseColor(map.maze, row, col, map.COLS - 1, map.path);
    const size = map.size;
    return { rec: { x, y, width: size, height: size }, color };
}

function drawMaze(map) {
    const thickness = 5;
    const rec = {
        x: map.gap - thickness,
        y: map.gap - thickness,
        width: map.size * map.ROWS + thickness * 2,
        height: map.size * map.COLS + thickness * 2,
    };
    r.DrawRectangleLinesEx(rec, thickness, r.BLACK);
    // console.log("Called", map.world.maze);
    for (let y = 0; y < map.ROWS; y++) {
        for (let x = 0; x < map.COLS; x++) {
            const obj = getObject(y, x, map);
            if (m.isEqual({ y, x }, map.path.at(0))) {
                obj.rec.x -= thickness;
                r.DrawRectangleRec(obj.rec, obj.color);
            }
            if (m.isEqual({ y, x }, map.path.at(-1))) {
                obj.rec.x += thickness;
                r.DrawRectangleRec(obj.rec, obj.color);
            }
            r.DrawRectangleRec(obj.rec, obj.color);
        }
    }
}

// console.log(generatePath(map));

module.exports = {
    generatePath,
    generateMap,
    drawMaze,
    generateBlocks,
    generateMaze,
};
