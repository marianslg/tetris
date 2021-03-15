const pieces = new Array();
const pieces_color = [
    "yellow",
    "cyan",
    "red",
    "green",
    "orange",
    "pink",
    "violet"
]

pieces[0] =
    [[1, 1],
    [1, 1]];

pieces[1] =
    [[2],
    [2],
    [2],
    [2]]

pieces[2] =
    [[0, 3, 3],
    [3, 3, 0]];

pieces[3] =
    [[4, 4, 0],
    [0, 4, 4]];

pieces[4] =
    [[5, 0],
    [5, 0],
    [5, 5]];

pieces[5] =
    [[0, 6],
    [0, 6],
    [6, 6]];

pieces[6] =
    [[7, 7, 7],
    [0, 7, 0]];

function getRamdomPiece() {
    let index = Math.floor(Math.random() * (pieces.length - 0)) + 0;

    return pieces[index];
}

export { pieces_color, getRamdomPiece };