import { copyPosition } from "../utils/helper";

export const movePiece = ({ position, piece, row, col, x, y }) => {
    const newPosition = copyPosition(position);

    if(piece.endsWith('k') && Math.abs(y - col) > 1) {
        if( y === 2) {
            newPosition[row][0] = '';
            newPosition[row][3] = piece.startsWith('w') ? 'wr' : 'br';
        } 

        if ( y === 6) {
            newPosition[row][7] = '';
            newPosition[row][5] = piece.startsWith('w') ? 'wr' : 'br'
        }
    }
    newPosition[row][col] = '';
    newPosition[x][y] = piece;

    return newPosition;
}

export const movePawn = ({ position, piece, row, col, x, y }) => {
    const newPosition = copyPosition(position);
    if(!newPosition[x][y] && x !== row && y !== col) {
        newPosition[row][y] = "";
    }

    newPosition[row][col] = "";
    newPosition[x][y] = piece;

    return newPosition;
}