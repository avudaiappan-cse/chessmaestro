export const generateTile = (fn) => Array(8).fill().map(fn);
export const getCharacter = col => String.fromCharCode(col + 96);

export const initializePosition = () => {
    const position = new Array(8).fill('').map(x => new Array(8).fill(''));

    // Place pawns in their order;
    for(let i = 0; i <  8; i++ ) {
        position[1][i] = 'wp';
        position[6][i] = 'bp';
    }

    // position[5][7] = 'wk';
    // position[1][7] = 'wr';
    // position[7][7] = 'bk';

    //Place all in their initial positions;
    [0,7].forEach(pos => {
        const clr = pos === 0 ? 'w' : 'b';
        position[pos][0] = `${clr}r`;
        position[pos][1] = `${clr}n`;
        position[pos][2] = `${clr}b`;
        position[pos][3] = `${clr}q`;
        position[pos][4] = `${clr}k`;
        position[pos][5] = `${clr}b`;
        position[pos][6] = `${clr}n`;
        position[pos][7] = `${clr}r`;
    });

    return position;
}


export const copyPosition = position => {
    const copy = new Array(8).fill('').map(x => new Array(8).fill(''));

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            copy[row][col] = position[row][col];
        }
    }

    return copy;
}

export const areSameColorTiles = (coords1, coords2) => (coords1.x + coords1.y) % 2 === (coords2.x + coords2.y) % 2;

export const findPieceCoords = (position, type) => {
    let results = [];

    position.forEach((row,i) => {
        row.forEach((pos, j) => {
            if(pos === type) {
                results.push({ x : i, y : j});
            }
        })
    })

    return results;
}

export const getNewMoveNotation = ({  piece, row, col, x, y, position, promotesTo }) => {
    let note = '';

    [ row, col ] = [Number(row), Number(col)];

    if(piece[1] === 'k' && Math.abs(col - y) === 2) {
        if(col > y) {
            return '0-0';
        } else {
            return '0-0-0';
        }
    }

    if(piece[1] !== 'p') {
        note += piece[1].toUpperCase();
        if(position[x][y]) {
            note += 'x';
        }
    } else if( row !== x && col !== y ) {
        note += getCharacter(col + 1) + 'x';
    }

    note += getCharacter(y + 1) + (x + 1)

    if(promotesTo) {
        note += "=" + promotesTo.toUpperCase();
    }

    return note;
}