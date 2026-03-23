console.log('hello');
let startBtn = document.getElementById('start');
// :.·

const WIDTH = 10;
let dinoY = 3;
let obstacles = [
    {
        pos: 15,
        enemy: [0, 0, 0, 1],
    },
    {
        pos: 20,
        enemy: [0, 0, 1, 1],
    },
];

function spanEnemy(enemy = [0, 0, 0, 1]) {
    for (let i = 0; i < myGrid.length; i++) {
        myGrid[i].push(enemy[i]);
    }
}

function convertGridToBraille(grid) {
    const rows = 4;
    const cols = grid[0].length;
    let result = '';

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
function gameLoop() {
    const grid = new Array({length: 4}, () => Array(WIDTH).fill(0));

    grid[2][dinoY] = 1;
    obstacles.map((obs) => {
        return {...obs, pos: obs.pos - 1};
    });
}
// const myGrid = [
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
//     [1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1],
//     [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1],
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
// ];

console.log(convertGridToBraille(myGrid));

startBtn.addEventListener('click', function (e) {
    spanEnemy();
    document.title = convertGridToBraille(myGrid);
    convertGridToBraille(myGrid);
});
