const copy = function (map) {
    const grid = [];
    for (const arr of map) {
        grid.push(arr.slice());
    }
    return grid;
};

const printTable = function (arr, map) {
    if (!arr.at(0).length) {
        console.log("Yes");
        for (const { y, x } of arr) {
            map[y][x] = 1;
        }
        console.table(map);
        return;
    }
    console.log("No");
    for (const key of arr) {
        for (const { y, x } of key) {
            map[y][x] = 1;
        }
    }
    console.table(map);
};

module.exports = {
    copy,
    printTable,
};
