import * as _pieces from './modules/pieces.js'
import * as _config from './modules/config.js'

var _board = new Array(_config.rows);
var _pivotR = 0;
var _pivotC = 0;
var _intervalID = 0;
var _piece;

document.getElementById("but-startGame").onclick = startGame;

function startGame() {
   
    document.getElementById("init-container").style.visibility= "hidden"

    for (let r = 0; r < _config.rows; r++) {
        _board[r] = new Array(_config.colums).fill(0);
    }
    
    createTable(_config.rows, _config.colums);
    document.getElementById("board-container").style.visibility = 'visible';

    insertNewPiecedAndPaintBoard();
    
    document.onkeydown = checkKey;
    
    _intervalID = window.setInterval(move, _config.initialVelocity, 'down');
}

function checkKey(e) {
    e = e || window.event;

    switch (e.keyCode) {
        case 37: { move("left"); break; }
        case 38: { rotatePiece(); break; }
        case 39: { move("right"); break; }
        case 40: { move("down"); break; }
    }
}

function move(action) {
    let result = true;
    movePivot(action, 1);

    if (tryMove(_board, _pivotR, _pivotC, _piece)) {
        movePivot(action, -1);
        removePieceFromTheFromBorad(_board, _pivotR, _pivotC, _piece);
        movePivot(action, 1);
        result = insertPieceOnBorad(_board, _pivotR, _pivotC, _piece);
        paintBoard();
    } else {
        movePivot(action, -1);

        if (action == 'down') {
            stickUpPiece(_board, _pivotR, _pivotC, _piece);
            findCompletedRowsFromTheBoardAndClean(_board);
            result = insertNewPiecedAndPaintBoard();
        }
    }

    if (!result) endGame();
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
    _piece = _pieces.getRamdomPiece();
    _pivotR = 0;
    _pivotC = (Math.floor(_config.colums / 2) - Math.floor(_piece[0].length / 2));

    if (_piece[0].length % 2 != 0 && _config.colums % 2 == 0) _pivotC--;

    let result = insertPieceOnBorad(_board, _pivotR, _pivotC, _piece);

    paintBoard();

    return result;
}

function findCompletedRowsFromTheBoardAndClean(board) {
    let completedRows = 0;

    for (let r = 0; r < board.length; r++) {
        if (board[r].every((currentValue) => currentValue < 0)) {
            _board.splice(r, 1);
            _board.splice(0, 0, new Array(_config.colums).fill(0));
            completedRows++;
        }
    }

    return completedRows;
}

function endGame() {
    clearInterval(_intervalID);
    alert("END GAME");
}

function paintBoard() {
    for (let r = 0; r < _config.rows; r++) {
        for (let c = 0; c < _config.colums; c++) {
            document.getElementById('td' + (_config.colums * r + c)).className = _pieces.pieces_color[Math.abs(_board[r][c])]
        }
    }
}

function createTable(rows, colums) {
    var myDiv = document.getElementById("board");
    
    var table = document.createElement('table');

    for (let r = 0; r < rows; r++) {
        var row = document.createElement('tr');

        for (let c = 0; c < colums; c++) {
            var cell = document.createElement('td');
            cell.id = 'td' + (colums * r + c)
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    myDiv.prepend(table);
}