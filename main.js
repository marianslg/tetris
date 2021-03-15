import { pieces, pieces_color, getRamdomPiece } from './modules/pieces.js'
import { rows, colums, velocity } from './modules/config.js'

var board = new Array(rows);
var board2 = new Array(rows);

var pivotR = 0;
var pivotC = 0;

var actualPiece;

for (let r = 0; r < rows; r++) {
    board[r] = new Array(colums).fill(0);
    board2[r] = new Array(colums).fill(0);
}

createTable(rows, colums);
insertNewPiece();

//nuevaPieza()
// intervalID = window.setInterval(miFuncion, 1000, 'asd', 'Parametro 2');

function deleteCompleteRows() {
    
    
    for (let r = 0; r < rows; r++) {
        let sum = 1;

        board[r].reduce((a, curr) => {
            if (curr < 0) {
                sum++
            }
        })

        if (sum == colums) {
            board.splice(r, 1);
            board.splice(0, 0, new Array(colums).fill(0));
        }
    }
}

function copyArray(array1, array2) {
    for (let r = 0; r < array1.length; r++) {
        for (let c = 0; c < array1[0].length; c++) {
            array1[r][c] = array2[r][c];
        };
    }
}

function rotate(arr) {
    let array2 = new Array(arr[0].length)

    for (let i = 0; i < arr[0].length; i++) {
        array2[i] = new Array(arr.length - 1);

        let jj = 0;

        for (let j = (arr.length - 1); j >= 0; j--) {
            array2[i][jj] = arr[j][i];
            jj++;
        };
    }

    return array2;
}

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
        tryRotate();
    }
    else if (e.keyCode == '40') {
        move("down");
    }
    else if (e.keyCode == '37') {
        move("left");
    }
    else if (e.keyCode == '39') {
        move("right");
    }
}

function move(action) {
    copyArray(board2, board)

    if (tryMove(action)) {
        copyArray(board, board2);

        renderBoard();

        if (action == 'down') {
            pivotR++;
        } else if (action == 'left') {
            pivotC--;
        } else if (action == 'right') {
            pivotC++;
        }
    } else if (action == 'down') {
        for (let c = 0; c < actualPiece[0].length; c++) {
            for (let r = 0; r < actualPiece.length; r++) {
                if (actualPiece[r][c] > 0)
                    board[pivotR + r][pivotC + c] = -1 * actualPiece[r][c];
            }
        }

        deleteCompleteRows();
        insertNewPiece();
    }
}

function tryMove(action) {
    let pivotC2 = pivotC;
    let pivotR2 = pivotR;

    for (let r = 0; r < actualPiece.length; r++) {
        for (let c = 0; c < actualPiece[0].length; c++) {
            if (board2[r + pivotR][c + pivotC] >= 0)
                board2[r + pivotR][c + pivotC] = 0;
        };
    }

    switch (action) {
        case 'down': {
            pivotR2++;
            break;
        }
        case 'left': {
            pivotC2--;
            break;
        }
        case 'right': {
            pivotC2++;
            break;
        }
        default: return false;
    }

    for (let r = actualPiece.length - 1; r >= 0; r--) {
        for (let c = actualPiece[0].length - 1; c >= 0; c--) {
            if (pivotC2 >= 0 &&
                pivotR2 < rows &&
                (pivotC2 + actualPiece[0].length - 1) < colums &&
                (pivotR2 + actualPiece.length - 1) < rows) {
                if (board2[r + pivotR2][c + pivotC2] == 0) {
                    board2[r + pivotR2][c + pivotC2] = actualPiece[r][c];
                } else if (board2[r + pivotR2][c + pivotC2] < 0 && actualPiece[r][c] == 0) {
                    continue;
                } else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    }

    return true;
}

function tryRotate() {
    let simulationResult = true;

    let piece2 = rotate(actualPiece);

    copyArray(board2, board);

    for (let r = 0; r < actualPiece.length; r++) {
        for (let c = 0; c < actualPiece[0].length; c++) {
            board2[r + pivotR][c + pivotC] = 0;
        };
    }

    for (let r = 0; r < actualPiece.length; r++) {
        for (let c = 0; c < actualPiece[0].length; c++) {
            if (c + pivotR <= (rows - 1) && r + pivotC <= (colums - 1) && board2[c + pivotR][r + pivotC] == 0) {
                board2[c + pivotR][r + pivotC] = piece2[c][r];
            } else {
                simulationResult = false;
                break;
            }
        }
    }

    if (simulationResult) {
        actualPiece = piece2.slice();
        copyArray(board, board2);

        renderBoard();
    }
}


function miFuncion(a, b) {
    move("down");

    // window.clearInterval(intervalID);
}

function insertNewPiece() {
    actualPiece = getRamdomPiece();

    pivotC = (Math.floor(colums / 2) - Math.floor(actualPiece[0].length / 2));
    pivotR = 0;

    if (actualPiece[0].length % 2 != 0 && colums % 2 == 0)
        pivotC--;

    for (let c = 0; c < actualPiece[0].length; c++) {
        for (let r = 0; r < actualPiece.length; r++) {
            board[r][pivotC + c] = actualPiece[r][c]
        }
    }

    renderBoard();
}

function renderBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < colums; c++) {
            switch (Math.abs(board[r][c])) {
                case 0: {
                    document.getElementById('td' + (colums * r + c)).className = "white";
                    break;
                }
                default: {
                    document.getElementById('td' + (colums * r + c)).className = pieces_color[Math.abs(board[r][c]) - 1];
                    break;
                }
            }
        }
    }
}

function createTable(rows, colums) {
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

    document.body.appendChild(table);
}