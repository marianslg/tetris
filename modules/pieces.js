const pieces = new Array();
const pieces_color = [
    "white",
    "yellow",
    "cyan",
    "red",
    "green",
    "orange",
    "pink",
    "violet"
]

pieces[0] = [0];

pieces[1] =
    [[1, 1],
    [1, 1]];

pieces[2] =
    [[2],
    [2],
    [2],
    [2]]

pieces[3] =
    [[0, 3, 3],
    [3, 3, 0]];

pieces[4] =
    [[4, 4, 0],
    [0, 4, 4]];

pieces[5] =
    [[5, 0],
    [5, 0],
    [5, 5]];

pieces[6] =
    [[0, 6],
    [0, 6],
    [6, 6]];

pieces[7] =
    [[7, 7, 7],
    [0, 7, 0]];

function getRamdomPiece() {
    let index = Math.floor(Math.random() * (pieces.length - 1)) + 1;

    return pieces[index];
}

function getPiece(index) {
    return pieces[index];
}


export { pieces_color, getRamdomPiece, getPiece };