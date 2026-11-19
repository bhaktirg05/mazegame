const arr = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];

const start = [
    {
        row: 0,
        col: Math.floor(Math.random() * (arr.length - 1)),
    },
    {
        row: arr.length - 1,
        col: Math.floor(Math.random() * (arr.length - 1)),
    },
    {
        col: 0,
        row: Math.floor(Math.random() * (arr.length - 1)),
    },
];

let stop = false;

function getNeighbors(i, j, arr) {
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
}

function filterNeighbor(neighbors, arr) {
    const neigh = neighbors.slice();
    for (let key = 0; key < neigh.length; key++) {
        if (arr[neigh[key].row][neigh[key].col] !== 0) {
            neigh.splice(key, 1);
            key--;
        }
    }
    return neigh;
}

const isDeathEnd = function (neighbors, arr) {
    let count = 0;
    for (const index of neighbors) {
        if (arr[index.row][index.col] === 0) count++;
    }
    if (count >= 1) return false;
    return true;
};

function neighborSideVisited(indexNeigh, arr) {
    let count = 0;
    for (const index of indexNeigh) {
        if (arr[index.row][index.col] === 1) count++;
    }
    if (count >= 2) return true;
    return false;
}

function firstStartPoint(storage) {
    const index = Math.floor(Math.random() * 3);
    console.log(start[index].row, start[index].col);
    arr[start[index].row][start[index].col] = 1;
    console.log(
        "Start",
        "i",
        start[index],
        "r:",
        start[index].row,
        "c",
        start[index].col,
    );
    storage.push({ row: start[index].row, col: start[index].col });
}

function backtrack(filtered, storage, row, col, neigh) {
    while (filtered.length === 0 && storage.length !== 0) {
        console.log("Filter empty");
        arr[storage.at(-1).row][storage.at(-1).col] = 2;
        storage.pop();

        if (storage.length !== 0) {
            row = storage.at(-1).row;
            col = storage.at(-1).col;

            neigh = getNeighbors(row, col, arr);
            filtered = filterNeighbor(neigh, arr);
        }
    }
    return filtered;
}

const isToDeclareDeath = function (indexNeigh, arr, filtered, neighindex) {
    if (isDeathEnd(indexNeigh, arr)) {
        arr[filtered[neighindex].row][filtered[neighindex].col] = 2;
        console.log("Death End", filtered[neighindex]);
        return true;
    }
    return false;
};

const isToDeclareNeighborVisited = function (
    indexNeigh,
    arr,
    filtered,
    neighindex,
) {
    if (neighborSideVisited(indexNeigh, arr)) {
        arr[filtered[neighindex].row][filtered[neighindex].col] = 2;
        return true;
    }
    return false;
};

const findPath = function () {
    const storage = [];
    firstStartPoint(storage);
    console.log("Storage1: ", storage);
    let i = 0;
    while (storage.length !== 0 && storage.at(-1).col !== arr[0].length - 1) {
        console.log("Iteration", i, "\n", arr);
        console.log("Stop:", stop);

        i++;

        let { row, col } = storage.at(-1);
        let neigh = getNeighbors(row, col, arr);
        let filtered = filterNeighbor(neigh, arr);

        console.log("Last element in storage :", storage.at(-1));
        console.log("Neighbors :", neigh, "Filtered", filtered);

        filtered = backtrack(filtered, storage, row, col, neigh);

        if (storage.length === 0 || filtered.length === 0) {
            stop = true;
            console.log("Break");
            break;
        }

        const neighindex = Math.floor(Math.random() * filtered.length);
        const indexNeigh = getNeighbors(
            filtered[neighindex].row,
            filtered[neighindex].col,
            arr,
        );

        console.log(
            "index : ",
            neighindex,
            " Selected : ",
            filtered[neighindex],
        );
        console.log("index neighbors :", indexNeigh);

        // if (isDeathEnd(indexNeigh, arr)) {
        //     arr[filtered[neighindex].row][filtered[neighindex].col] = 2;
        //     console.log("Death End", filtered[neighindex]);
        //     continue;
        // }

        if (isToDeclareDeath(indexNeigh, arr, filtered, neighindex)) continue;

        // if (neighborSideVisited(indexNeigh, arr)) {
        //     arr[filtered[neighindex].row][filtered[neighindex].col] = 2;
        //     continue;
        // }

        if (isToDeclareNeighborVisited(indexNeigh, arr, filtered, neighindex))
            continue;

        arr[filtered[neighindex].row][filtered[neighindex].col] = 1;
        storage.push(filtered[neighindex]);
    }
    console.log("Array", arr);
    console.log("Storage", storage);
    // return storage;
};

console.log(findPath());

console.log(arr);
