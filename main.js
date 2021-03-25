import * as _pieces from './modules/pieces.js'
import * as _config from './modules/config.js'

var _board = new Array(_config.rows);
var _pivotR = 0;
var _pivotC = 0;
var _intervalID = 0;
var _piece;
var _nextPiece;
var _lines = 0;
var _velocity = _config.initialVelocity;
var _endGame = false;
var _stage = 0;

document.getElementById("but-startGame").onclick = startGame;
document.getElementById("but-up").onclick = function () { action(38); };
document.getElementById("but-left").onclick = function () { action(37); };
document.getElementById("but-right").onclick = function () { action(39); };
document.getElementById("but-down").onclick = function () { action(40); };

document.body.addEventListener("touchstart", startTouch, false);
document.body.addEventListener("touchend", endTouch, false);

function startGame() {
    document.getElementById("index-container").style.visibility = "hidden"

    for (let r = 0; r < _config.rows; r++) {
        _board[r] = new Array(_config.colums).fill(0);
    }

    document.getElementById("tableId").style.visibility = 'visible';

    _nextPiece = _pieces.getRamdomPiece();
    insertNewPiecedAndPaintBoard();

    document.onkeydown = checkKey;

    _intervalID = window.setInterval(move, _config.initialVelocity, 'down');
}

function checkKey(e) {
    e = e || window.event;

    action(e.keyCode);
}

function action(e) {
    if (_endGame) return;

    switch (e) {
        case 37: { move("left"); break; }
        case 38: { rotatePiece(); break; }
        case 39: { move("right"); break; }
        case 40: { move("down"); break; }
    }
}

function move(action) {
    if (_endGame) return;

    movePivot(action, 1);

    if (tryMove(_board, _pivotR, _pivotC, _piece)) {
        movePivot(action, -1);
        removePieceFromTheFromBorad(_board, _pivotR, _pivotC, _piece);
        movePivot(action, 1);
        _endGame = !insertPieceOnBorad(_board, _pivotR, _pivotC, _piece);
        paintBoard();
    } else {
        movePivot(action, -1);

        if (action == 'down') {
            stickUpPiece(_board, _pivotR, _pivotC, _piece);
            findCompletedRowsFromTheBoardAndClean(_board);
            _endGame = !insertNewPiecedAndPaintBoard();
        }
    }

    if (_endGame) endGame();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function movePivot(action, sum) {
    switch (action) {
        case 'down': { _pivotR += sum; break; }
        case 'left': { _pivotC -= sum; break; }
        case 'right': { _pivotC += sum; break; }
    }
}

function tryMove(board, pivotR, pivotC, piece) {
    try {
        for (let r = 0; r < piece.length; r++) {
            for (let c = 0; c < piece[0].length; c++) {
                if (piece[r][c] > 0 && (board[r + pivotR][c + pivotC] < 0 | board[r + pivotR][c + pivotC] == undefined))
                    return false;
            }
        }
        return true;
    } catch (Exception) {
        return false;
    }
}

function stickUpPiece(board, pivotR, pivotC, piece) {
    return modPieceFromTheFromBorad(board, pivotR, pivotC, piece, -1);
}

function insertPieceOnBorad(board, pivotR, pivotC, piece) {
    return modPieceFromTheFromBorad(board, pivotR, pivotC, piece, 1);
}

function removePieceFromTheFromBorad(board, pivotR, pivotC, piece) {
    return modPieceFromTheFromBorad(board, pivotR, pivotC, piece, 0);
}

function modPieceFromTheFromBorad(board, pivotR, pivotC, piece, op) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[0].length; c++) {
            if (piece[r][c] > 0)
                if (board[r + pivotR][c + pivotC] < 0)
                    return false; // end game
                else
                    board[r + pivotR][c + pivotC] = piece[r][c] * op;
        }
    }

    return true;
}

function rotatePiece() {
    let array = rotateArray(_piece);

    if (tryMove(_board, _pivotR, _pivotC, array)) {
        removePieceFromTheFromBorad(_board, _pivotR, _pivotC, _piece);
        _piece = array;
        let result = insertPieceOnBorad(_board, _pivotR, _pivotC, _piece);
        paintBoard();

        if (!result) endGame();
    }
}

function rotateArray(arr) {
    let arr2 = new Array(arr[0].length)

    for (let r = 0; r < arr[0].length; r++) {
        arr2[r] = new Array(arr.length - 1);
        for (let c = 0; c < arr.length; c++) {
            arr2[r][c] = arr[(arr.length - 1 - c)][r];
        };
    }

    return arr2;
}

function insertNewPiecedAndPaintBoard() {
    _piece = _pieces.getPiece(_nextPiece[0].filter(aa => aa > 0)[0]);
    _nextPiece = _pieces.getRamdomPiece();

    paintNextPiece();

    _pivotR = 0;
    _pivotC = (Math.floor(_config.colums / 2) - Math.floor(_piece[0].length / 2));

    if (_piece[0].length % 2 != 0 && _config.colums % 2 == 0) _pivotC--;

    let result = insertPieceOnBorad(_board, _pivotR, _pivotC, _piece);

    paintBoard();

    return result;
}

function paintNextPiece() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
            document.getElementById('panel-next-' + (3 * r + c)).className = _pieces.pieces_color[0];
        }
    }

    for (let r = 0; r < _nextPiece.length; r++) {
        for (let c = 0; c < _nextPiece[r].length; c++) {
            document.getElementById('panel-next-' + (3 * r + c)).className = _pieces.pieces_color[Math.abs(_nextPiece[r][c])]
        }
    }
}

function findCompletedRowsFromTheBoardAndClean(board) {
    let completedRows = 0;

    for (let r = 0; r < board.length; r++) {
        if (board[r].every((currentValue) => currentValue < 0)) {
            _board.splice(r, 1);
            _board.splice(0, 0, new Array(_config.colums).fill(0));
            completedRows++;

            _lines += completedRows;

            document.getElementById('panel-score-value').textContent = _lines;

            _config.initialVelocity;

            if (_lines % _config.linesStage == 0) {
                _stage++;
                document.getElementById('panel-stage-value').textContent = _stage;
                _velocity -= _config.acceleration;
                clearInterval(_intervalID);
                _intervalID = window.setInterval(move, _velocity, 'down');
            }
        }
    }

    return completedRows;
}

async function endGame() {
    await sleep(300);
    clearInterval(_intervalID);
    alert("END GAME");
}

function paintBoard() {
    for (let r = 0; r < _config.rows; r++) {
        for (let c = 0; c < _config.colums; c++) {
            document.getElementById('board-td-' + (_config.colums * r + c)).className = _pieces.pieces_color[Math.abs(_board[r][c])]
        }
    }
}

function reziseTable() {
    let he = 0;
    let wi = 0;

    if ((window.innerWidth / 13) < (window.innerHeight / 20)) {
        wi = innerWidth;
        he = (innerWidth / 13) * 20
    }
    else {
        wi = (innerHeight / 20) * 13;
        he = innerHeight;
    }

    document.documentElement.style.setProperty('--height', he * 0.99 + 'px');
    document.documentElement.style.setProperty('--width', wi * 0.99 + 'px');
}

reziseTable();

window.addEventListener('resize', reziseTable);

/* touch events */

var initialX = null;
var initialY = null;

function startTouch(e) {
    if (e.path[0].className != "panel-but") {
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
    }
};

function endTouch(e) {
    if (initialX === null | initialY === null) {
        return;
    }

    let currentX = e.changedTouches[0].clientX;
    let currentY = e.changedTouches[0].clientY;

    let diffX = initialX - currentX;
    let diffY = initialY - currentY;
    
    if (Math.abs(Math.abs(diffX) - Math.abs(diffY)) < 10) {
        action(38); //touch - rotate
    } else if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            action(37); //left
        } else {
            action(39); //right
        }
    } else if (Math.abs(diffX) < Math.abs(diffY)) {
        if (diffY > 0) {
            //up
        } else {
            action(40); //down
        }
    }

    initialX = null;
    initialY = null;

    e.preventDefault();
};