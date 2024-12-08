const board = document.getElementById('board');
const withDrawButton = document.getElementById('withdraw');
const giveUpButton = document.getElementById('giveup');

const moveHistory = []; // 用于记录落子历史
const size_Board = 15;
let color = 1; // 1: 黑色, 2: 白色 小黑子先下

//生成棋盘
for (let y = 0; y < size_Board; y++) {
    for (let x = 0; x < size_Board; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x; // 设置列号
        cell.dataset.y = y; // 设置行号
        board.appendChild(cell);
    }
}

//生成棋子且判断胜负
board.addEventListener('click', (event) => {
    const target = event.target;
    console.log(target);
    if (target.classList.contains('cell') && !target.classList.contains('black') && !target.classList.contains('white')) {
        target.classList.add(color === 1 ? 'black' : 'white');
        moveHistory.push({
            x: parseInt(target.dataset.x, 10),
            y: parseInt(target.dataset.y, 10),
            color: color
        }); // 记录落子历史, 用于悔棋
        color = 3 - color;
    }
    check(target);
});

//判断胜负
function check(cell) {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const color = cell.classList.contains('black') ? 'black' : 'white';

    let i = 1;
    //遍历四个方向
    const directions = [
        { dx: 1, dy: 0 },  // 横向
        { dx: 0, dy: 1 }, // 纵向
        { dx: 1, dy: 1 }, // 右下
        { dx: 1, dy: -1 }  // 右上
    ]

    for (const dir of directions) {
        let count = 1;

        //计算一个方向上的棋子数 分别向正反方向扫描
        count += countDir(x, y, dir.dx, dir.dy, color);
        count += countDir(x, y, -dir.dx, -dir.dy, color);

        if (count >= 5) {
            setTimeout(() => { alert(`${color} win!`); resetBoard(); }, 1000);
            break;
        }
    }
}

//计算一个方向上的棋子数
function countDir(x, y, dy, dx, color) {
    let count = 0;
    while (true) {
        x += dx;
        y += dy;

        //判断是否超出边界
        if (x < 0 || x >= size_Board || y < 0 || y >= size_Board) {
            break;
        }

        //判断是否是同色棋子
        const cell = document.querySelector(`.cell[data-x='${x}'][data-y='${y}']`);
        if (cell.classList.contains(color)) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

//重置棋盘
function resetBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.classList.remove('black', 'white');
    });
    moveHistory.length = 0;
}

//悔棋
withDrawButton.addEventListener('click', () => {
    if (moveHistory.length > 0) {
        const lastMove = moveHistory.pop();
        const cell = document.querySelector(`.cell[data-x='${lastMove.x}'][data-y='${lastMove.y}']`);
        if (cell) {
            cell.classList.remove(lastMove.color === 1 ? 'black' : 'white');
            color = lastMove.color; // 恢复到上一步的玩家
        }
    } else {
        alert('无法悔棋');
    }
});

//认输
giveUpButton.addEventListener('click', () => {
    if (moveHistory.length > 0) {

        const lastMove = moveHistory.pop();
        alert(`${lastMove.color === 1 ? 'black' : 'white'} win!`);
    } else {
        alert('white win!');
    }
    resetBoard();
});
