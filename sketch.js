const r = require("raylib");
const maze = require("./maze");
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
    world.map.grid = maze.generateMap(world.map.ROWS, world.map.COLS);
    world.map.size = Math.ceil(world.screen.WIDTH / world.map.ROWS);
    world.map.maze = maze.generateMaze(world.map.grid);

    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(world.screen.WIDTH, world.screen.HEIGHT, world.screen.TITLE);
    r.SetTargetFPS(world.screen.FPS);

    return world;
};

const update = function (world) {};

const draw = function (world) {
    r.BeginDrawing();
    r.ClearBackground(r.WHITE);
    maze.drawMaze(world.map);
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
