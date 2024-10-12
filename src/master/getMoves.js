import master from "./master";

export const getRookMoves = ({ position, piece, row, col }) => {
    const moves = [];
    const self = piece[0];
    const enemy  = self === 'w' ? 'b' : 'w';

    const direction = [
        [-1,0], [1,0], [0,-1],[0,1]
    ];

    direction.forEach(dir => {
        for(let i = 1; i < 8; i++) {
            const x = row + ( i * dir[0]);
            const y = col + ( i * dir[1]);

            if(position?.[x]?.[y] === undefined) {
                break;
            }

            if(position[x][y].startsWith(enemy)) {
                moves.push([x,y]);
                break;
            }

            if(position[x][y].startsWith(self)) {
                break;
            }

            moves.push([x,y]);
        }
    })

    return moves;
};


export const getKnightMoves = ({ position, row, col }) => {
    const moves = [];
    const enemy = position[row][col].startsWith('w') ? 'b' : 'w';
    const directions = [ 
        [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1] 
    ];

    directions.forEach(dir => {
        const cell = position?.[row + dir[0]]?.[col + dir[1]];
        if(cell !== undefined && (cell.startsWith(enemy) || cell === '')) {
            moves.push([row + dir[0], col + dir[1]])
        }
    });

    return moves;

}

export const getBishopMoves = ({ position, piece, row, col }) => {
    const moves = [];
    const self = piece[0];
    const enemy  = self === 'w' ? 'b' : 'w';

    const direction = [
        [-1, -1], [-1, 1], [1, 1], [1, -1]
    ];

    direction.forEach(dir => {
        for(let i = 1; i < 8; i++) {
            const x = row + ( i * dir[0]);
            const y = col + ( i * dir[1]);

            if(position?.[x]?.[y] === undefined) {
                break;
            }

            if(position[x][y].startsWith(enemy)) {
                moves.push([x,y]);
                break;
            }

            if(position[x][y].startsWith(self)) {
                break;
            }

            moves.push([x,y]);
        }
    })

    return moves;
}

export const getQueenMoves = ({ position, piece, row, col }) => {
    return [ 
        ...getRookMoves({ position, piece, row, col }),
        ...getBishopMoves({ position, piece, row, col})
    ]
}

export const getKingMoves = ({ position, piece, row, col }) => {
    const moves = [];
    const self = piece[0];

    const direction = [
        [1, -1], [1, 0], [1, 1], [0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1]
    ];

    direction.forEach(dir => {
        const x = row + dir[0];
        const y = col + dir[1];

        if(position?.[x]?.[y] !== undefined && !position[x][y].startsWith(self)) {
            moves.push([x,y]);
        } 
    })

    return moves;
}

export const getPawnMoves = ({ position, piece, row, col }) => {
    const moves = [];
    const dir = piece === 'wp' ? 1 : -1;

    if(!position?.[row + dir][col]) {
        moves.push([row + dir, col]);
    }

    if(row % 5 === 1) {
        if(position?.[row + dir]?.[col] === '' && position?.[row + dir + dir]?.[col] === '') {
            moves.push([row + dir + dir, col]);
        }
    }

    return moves;
}

export const getPawnCaptures = ({ position, prevPosition, piece, row, col }) => {
    const moves = [];
    const dir = piece === 'wp' ? 1 : -1;
    const enemy = piece[0] === 'w' ? 'b' : 'w';

    // Left enemy capture
    if(position?.[row + dir]?.[col - 1] &&  position?.[row + dir]?.[col - 1].startsWith(enemy)) {
        moves.push([row + dir, col - 1])
    }

    // Right enemy capture
    if(position?.[row + dir]?.[col + 1] &&  position?.[row + dir]?.[col + 1].startsWith(enemy)) {
        moves.push([row + dir, col + 1])
    }

    //En-passant 
    const enemyPawn = dir === 1 ? 'bp' : 'wp';
    const adjacentCols = [col - 1, col + 1];
    if(prevPosition) {
        if(( dir === 1 && row === 4) || (dir === -1 && row === 3)) {

            adjacentCols.forEach(c => {
                if(
                    position?.[row]?.[c] === enemyPawn && 
                    position?.[row + dir + dir]?.[c] === '' &&
                    prevPosition?.[row]?.[c] === '' &&
                    prevPosition?.[row + dir + dir]?.[c] === enemyPawn
                ) {
                    moves.push([row + dir, c])
                }
            })

        }
    }
    
    return moves;
}


export const getCastlingMoves = ({ position, castleDirection, piece, row, col }) => {
    const moves = [];

    if(col !== 4 || row % 7 !== 0 || castleDirection === 'none') {
        return moves;
    }

    const isPlayerInCheck = (player, positionAfterMove = position) =>  master.isPlayerInCheck({ positionAfterMove, player }); 

    if(piece.startsWith('w')) {
        if(isPlayerInCheck('w')) {
            return moves;
        }

        if(
            ['left', 'both'].includes(castleDirection) &&
            !position[0][3] &&
            !position[0][2] &&
            !position[0][1] &&
            position[0][0] === 'wr' &&
            !isPlayerInCheck('w', master.performMove({ position, piece, row, col, x : 0, y : 3 })) &&
            !isPlayerInCheck('w', master.performMove({ position, piece, row, col, x : 0, y : 2 }))
        ) {
            moves.push([0,2]);
        }

        if(
            ['right', 'both'].includes(castleDirection) &&
            !position[0][5] &&
            !position[0][6] &&
            position[0][7] === 'wr' &&
            !isPlayerInCheck('w', master.performMove({ position, piece, row, col, x : 0, y : 5 })) &&
            !isPlayerInCheck('w', master.performMove({ position, piece, row, col, x : 0, y : 6 }))
        ) {
            moves.push([0,6]);
        }
    }

    else {
        if(isPlayerInCheck('b')) {
            return moves;
        }

        if(
            ['left', 'both'].includes(castleDirection) &&
            !position[7][3] &&
            !position[7][2] &&
            !position[7][1] &&
            position[7][0] === 'br' &&
            !isPlayerInCheck('b', master.performMove({ position, piece, row, col, x : 7, y : 3 })) &&
            !isPlayerInCheck('b', master.performMove({ position, piece, row, col, x : 7, y : 2 }))
        ) {
            moves.push([7,2]);
        }

        if(
            ['right', 'both'].includes(castleDirection) &&
            !position[7][5] &&
            !position[7][6] &&
            position[7][7]  === 'br' &&
            !isPlayerInCheck('b', master.performMove({ position, piece, row, col, x : 7, y : 5 })) &&
            !isPlayerInCheck('b', master.performMove({ position, piece, row, col, x : 7, y : 6 }))
        ) {
            moves.push([7,6]);
        }
    }

    return moves;
 }

 export const getCastleDirections = ({ castleDirection, piece, row, col }) => {
    [row, col] = [Number(row), Number(col)];

    const direction = castleDirection[piece[0]];

    if(piece.endsWith('k')) {
        return "none";
    }

    [0, 7].forEach(r => {
        if(col === 0 && row === r) {
            if(direction === 'both') {
                return 'right';
            }
    
            if(direction === 'left') {
                return 'none';
            }
        }
    
        if(col === 7 && row === r) {
            if(direction === 'both') {
                return 'left';
            }
    
            if(direction === 'right') {
                return 'none';
            }
        }
    })
}

export const getKingPosition = (position, player) => {
    let kingPos;
    position.forEach((row, x) => {
        row.forEach((col, y) =>{
            if(position[x][y].startsWith(player) && position[x][y].endsWith('k')) {
                kingPos = [x,y];
            }
        })
    })

    return kingPos;
};

export const getPieces = (position, enemy) => {
    const enemyPieces = [];
    position.forEach((row, x) => {
        row.forEach((col, y) => {
            if (position[x][y].startsWith(enemy)) {
                enemyPieces.push({
                    piece : position[x][y],
                    row : x,
                    col : y
                });
            }
        })
    })
    

    return enemyPieces;
};