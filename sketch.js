const r = require("raylib");
const p = require("./path");
const m = require("./math");

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
        map: { ROWS: 5, COLS: 5 },
    };
};

const setup = function () {
    const world = createWorld();
    world.map.grid = p.generateMap(world.map.ROWS, world.map.COLS);
    world.map.size = Math.ceil(world.screen.WIDTH / world.map.ROWS);
    world.map.maze = p.generateMaze(world.map.grid);

    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(world.screen.WIDTH, world.screen.HEIGHT, world.screen.TITLE);
    r.SetTargetFPS(world.screen.FPS);

    return world;
};

const chooseColor = function (maze, i, j) {
    return maze[i][j] === 1 ? r.WHITE : r.BLACK;
};

function getObject(row, col, map) {
    const x = col * map.size;
    const y = row * map.size;
    const color = chooseColor(map.maze, row, col);
    const size = map.size;
    return { x, y, size, size, color };
}

function drawMaze(map) {
    for (let y = 0; y < map.ROWS; y++) {
        for (let x = 0; x < map.COLS; x++) {
            const obj = getObject(y, x, map);
            r.DrawRectangle(obj.x, obj.y, obj.size, obj.size, obj.color);
        }
    }
}

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
