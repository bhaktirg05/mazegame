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
const getNeighbors = function (i, j, arr) {
    const neighborPoints = [];
    const rowStart = Math.max(0, i - 1);
    const rowEnd = Math.min(i + 1, arr.length - 1);
    const colStart = Math.max(0, j - 1);
    const colEnd = Math.min(j + 1, arr.length - 1);

    for (let row = rowStart; row <= rowEnd; row++) {
        if (row !== i) neighborPoints.push({ row, col: j });
    }

    for (let col = colStart; col <= colEnd; col++) {
        if (col !== j) neighborPoints.push({ row: i, col });
    }
    return neighborPoints;
};

const filterNeighbor = function (neighbors, arr) {
    const filteredNeighbors = [];
    for (let key = 0; key < neighbors.length; key++) {
        const { row, col } = neighbors[key];

        if (arr[row][col] === 0) filteredNeighbors.push(neighbors[key]);
    }
    return filteredNeighbors;
};

const isDeathEnd = function (neighbors, arr) {
    let count = 0;
    for (const index of neighbors) {
        if (arr[index.row][index.col] === 0) count++;
    }
    if (count > 0) return false;
    return true;
};

const isNeighborVisited = function (indexNeigh, arr) {
    console.log("Yes Called");
    let count = 0;
    for (const index of indexNeigh) {
        if (arr[index.row][index.col] === 1) count++;
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
            row: 0,
            col: m.random(0, 3),
        },
        {
            row: ROWS - 1,
            col: m.random(0, 3),
        },
        {
            row: m.random(0, 3),
            col: 0,
        },
    ];
    const index = m.random(0, 2);
    const { row, col } = start[index];

    map[row][col] = 1;
    storage.push({ row, col });
};

const backtrack = function (filtered, storage, row, col, neigh, map) {
    while (filtered.length === 0) {
        console.log("Filter empty");
        map[storage.at(-1).row][storage.at(-1).col] = 2;
        storage.pop();

        // ({row, col}) = storage.at(-1)
        row = storage.at(-1).row;
        col = storage.at(-1).col;

        neigh = getNeighbors(row, col, map);
        filtered = filterNeighbor(neigh, map);
    }
    return filtered;
};

const getFilteredNeightbours = function (row, col, map) {
    const neighbors = getNeighbors(row, col, map);
    return filterNeighbor(neighbors, map);
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

    while (storage.length !== 0 && storage.at(-1).col !== COLS - 1) {
        let { row, col } = storage.at(-1);

        const neigh = getNeighbors(row, col, map);
        let neightbours = filterNeighbor(neigh, map);

        if (neightbours.length === 0) {
            neightbours = backtrack(neightbours, storage, row, col, neigh, map);
        }

        const neighindex = m.random(0, neightbours.length - 1);
        const randomNeighbour = randomFromData(neightbours);

        const indexNeigh = getNeighbors(
            randomNeighbour.row,
            randomNeighbour.col,
            map,
        );

        if (isDeathEnd(indexNeigh, map) || isNeighborVisited(indexNeigh, map)) {
            map[randomNeighbour.row][randomNeighbour.col] = 1;
            continue;
        }

        map[randomNeighbour.row][randomNeighbour.col] = 1;
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
