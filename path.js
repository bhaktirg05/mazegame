// const ROWS = 20;
// const COLS = 20;

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

// const map = generateMap(ROWS, COLS);
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

const isNeighborVisited = function (neighbours, arr) {
    console.log("Yes Called");
    let count = 0;
    for (const { y, x } of neighbours) {
        if (arr[y][x] === 1) count++;
    }
    return count >= 2;
};

const dbg = function (value, name = "") {
    console.log(name, ":", value);
    return value;
};

const firstStartPoint = function (storage, map, ROWS) {
    const start = [
        {
            y: 0,
            x: m.random(0, 3),
        },
        {
            y: ROWS - 1,
            x: m.random(0, 3),
        },
        {
            y: m.random(0, 3),
            x: 0,
        },
    ];
    const index = m.random(0, 2);
    const { y, x } = start[index];

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

const generateMaze = function (map) {
    const storage = [];
    const ROWS = map.length;
    const COLS = map.at(0).length;
    firstStartPoint(storage, map, ROWS);

    while (storage.length !== 0 && storage.at(-1).x !== COLS - 1) {
        let neightbours = getFilteredNeighbours(storage.at(-1), map);

        if (neightbours.length === 0) {
            neightbours = backtrack(neightbours, storage, map);
        }

        const randomNeighbour = randomFromData(neightbours);
        const indexNeigh = getNeighbors(randomNeighbour, map);

        map[randomNeighbour.y][randomNeighbour.x] = 1;
        if (!isDeathEnd(indexNeigh, map) && !isNeighborVisited(indexNeigh, map))
            storage.push(randomNeighbour);
    }
    console.table(map);
    console.log(storage);
    return map;
};

// console.log(generatePath(map));

module.exports = {
    generateMaze,
    generateMap,
};
