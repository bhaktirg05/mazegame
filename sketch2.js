const r = require("raylib");
const p = require("./maze2");
const { copy } = require("./utils");

const running = function () {
    return !r.WindowShouldClose();
};

const createWorld = function () {
    return {
        screen: {
            WIDTH: 800,
            HEIGHT: 800,
            TITLE: "Maze",
            FPS: 60,
        },
        map: { ROWS: 30, COLS: 30, gap: 50 },
    };
};

const setup = function () {
    const world = createWorld();
    const { WIDTH } = world.screen;
    const { ROWS, COLS, gap } = world.map;
    world.map.grid = p.generateMap(ROWS, COLS);
    world.map.size = Math.ceil((WIDTH - gap * 2) / ROWS);
    world.map.path = p.generatePath(copy(world.map.grid));
    world.map.maze = p.generateBlocks(world.map.path, copy(world.map.grid));

    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(world.screen.WIDTH, world.screen.HEIGHT, world.screen.TITLE);
    r.SetTargetFPS(world.screen.FPS);

    return world;
};

const update = function (world) {};

const draw = function (world) {
    r.BeginDrawing();
    r.ClearBackground(r.WHITE);
    p.drawMaze(world.map);
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
