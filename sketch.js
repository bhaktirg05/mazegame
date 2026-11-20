const r = require("raylib");
const p = require("./path");

const running = function () {
    return !r.WindowShouldClose();
};

const createWorld = function () {
    return {
        screen: {
            WIDTH: 400,
            HEIGHT: 400,
            TITLE: "Maze",
            FPS: 60,
        },
        map: { ROWS: 20, COLS: 20 },
    };
};

const chooseColor = function (path, i, j) {
    for (const { row, col } of path) {
        if (row === i && col === j) return r.WHITE;
    }
    return r.BLACK;
};

function getObject(row, col, map) {
    const x = col * map.size;
    const y = row * map.size;
    const color = chooseColor(map.path, row, col);
    // const color = map.path[row][col] === 1 ? r.WHITE : r.BLACK;
    // console.log(map.path[row][col], "color", color);
    const size = map.size;
    return { x, y, size, size, color };
}

function drawMaze(map) {
    // console.log("Called");
    for (let y = 0; y < map.ROWS; y++) {
        for (let x = 0; x < map.COLS; x++) {
            const obj = getObject(y, x, map);
            r.DrawRectangle(obj.x, obj.y, obj.size, obj.size, obj.color);
        }
    }
}

const setup = function () {
    const world = createWorld();
    world.map.grid = p.generateMap(world.map.ROWS, world.map.COLS);
    world.map.size = Math.ceil(world.screen.WIDTH / world.map.ROWS);
    world.map.path = p.generatePath(world.map.grid);

    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(world.screen.WIDTH, world.screen.HEIGHT, world.screen.TITLE);
    r.SetTargetFPS(world.screen.FPS);

    return world;
};

const update = function (world) {};

const draw = function (world) {
    r.BeginDrawing();
    r.ClearBackground(r.WHITE);
    drawMaze(world.map);
    r.EndDrawing();
};

const teardown = function () {
    r.CloseWindow();
};

module.exports = {
    running,
    setup,
    update,
    draw,
    teardown,
};
