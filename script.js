console.log("hello");
let startBtn = document.getElementById("start");
let resetBtn = document.getElementById("reset");
let scoreText = document.getElementById("score");
// :.·

const WIDTH = 20;
const OBSTACLES_INIT = [
    {
        pos: WIDTH + 5,
        enemy: [0, 0, 0, 1],
    },
    {
        pos: WIDTH + 8,
        enemy: [0, 0, 1, 1],
    },
    {
        pos: WIDTH + 15,
        enemy: [0, 0, 1, 1],
    },
];
const DINO_Y_INIT = 3;
let dinoY = DINO_Y_INIT;
let gameInterval;
let cooldown = false;
let jumpOnCooldown = false;
let score = 0;
let gameState = 'rest';
let obstacles = OBSTACLES_INIT;
let grid;

function convertGridToBraille(grid) {
    const rows = 4;
    const cols = WIDTH;
    let result = "";

    for (let c = 0; c < cols; c += 2) {
        let offset = 0;
        if (grid[0][c]) offset |= 0x01;
        if (grid[1][c]) offset |= 0x02;
        if (grid[2][c]) offset |= 0x04;
        if (grid[3][c]) offset |= 0x40;
        if (c + 1 < cols) {
            if (grid[0][c + 1]) offset |= 0x08;
            if (grid[1][c + 1]) offset |= 0x10;
            if (grid[2][c + 1]) offset |= 0x20;
            if (grid[3][c + 1]) offset |= 0x80;
        }
        result += String.fromCharCode(0x2800 + offset);
    }
    return result;
}
function draw(grid) {
    document.title = convertGridToBraille(grid);
}
function updateScore() {
    scoreText.innerText = score;
}
function gameLoop() {
    grid = Array.from({ length: 4 }, () => Array(WIDTH).fill(0));
    let colision = false;
    grid[dinoY][2] = 1;

    obstacles = obstacles.map((obs) => {
        return { ...obs, pos: obs.pos - 1 };
    });
    if (obstacles[0].pos < 0) {
        obstacles.shift();
        obstacles.push({
            pos: WIDTH + Math.round(Math.random() * 10),
            enemy: [0, 0, 0, 1],
        });
        score += 1;
        updateScore();
    }
    obstacles.forEach(({ pos: i, enemy }) => {
        for (let j = 0; j < enemy.length; j++) {
            if (i == 2 && enemy[j] && dinoY === j) colision = true;
            grid[j][i] = enemy[j];
        }
    });
    if (colision) {
        // console.log('colide')
        gameState = 'over';
        clearInterval(gameInterval);
    }
    draw(grid);
    //   console.log(grid);
}
function jump() {
    if (cooldown) {
        jumpOnCooldown = true;
        return;
    }
    dinoY = 0;
    jumpOnCooldown = false;
    setTimeout(function () {
        dinoY = 3;
        cooldown = true;
        setTimeout(function () {
            cooldown = false;
            if (jumpOnCooldown) {
                jump();
            }
        }, 400);
    }, 700);
}
// const myGrid = [
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
//     [1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1],
//     [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1],
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
// ];


startBtn.addEventListener("click", function (e) {
    if (gameState !== 'rest') return;
    start();
});
resetBtn.addEventListener("click", function (e) {
    if (gameState !== 'over') return;
    dinoY = DINO_Y_INIT;
    score = 0;
    updateScore();
    gameState = 'rest';
    obstacles = OBSTACLES_INIT;
    draw(grid);

})
document.addEventListener('keydown', function (e) {
    if (e.key === " " && !e.repeat && dinoY === 3) {
        jump();
    }
})

function start() {
    gameState = 'running';
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(function () {
        gameLoop();
    }, 150);
    startBtn.blur();
}
