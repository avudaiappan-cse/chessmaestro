import { areSameColorTiles, findPieceCoords } from "../utils/helper";
import { getBishopMoves, getKingMoves, getKnightMoves, getPawnCaptures, getPawnMoves, getQueenMoves, getRookMoves, getCastlingMoves, getKingPosition, getPieces } from "./getMoves";
import { movePawn, movePiece } from "./move";

const master = {
    getRegularMoves : function ({ position, prevPosition, piece, row, col }) {
        switch(true) {
            case piece.endsWith('n') : return getKnightMoves({ position, row, col });
            case piece.endsWith('r') : return getRookMoves({ position, piece, row, col });
            case piece.endsWith('b') : return getBishopMoves({ position, piece, row, col });
            case piece.endsWith('q') : return getQueenMoves({ position, piece, row, col });
            case piece.endsWith('k') : return getKingMoves({ position, piece, row, col });
            case piece.endsWith('p') : return getPawnMoves({ position, piece, row, col }); 
            default: break; 
        }
    },

    getValidMoves : function ({ position, castleDirection, prevPosition, piece, row, col }) {
        let moves = this.getRegularMoves({ position, prevPosition, piece, row, col });
        const notInCheckMoves = [];

        if(piece.endsWith('p')) {
            moves = [
                ...moves,
                ...getPawnCaptures({ position, prevPosition, piece, row, col })
            ]
        }

        if(piece.endsWith('k')) {
            moves = [
                ...moves,
                ...getCastlingMoves({ position, castleDirection, piece, row, col })
            ]
        }

        moves.forEach(([x, y]) => {
            const positionAfterMove = this.performMove({ position, piece, row, col, x, y });
            if(!this.isPlayerInCheck( { positionAfterMove, position, player : piece[0] })) {
                notInCheckMoves.push([x, y]);
            }
        });

        return notInCheckMoves;
    },

    performMove : function ({ position, piece, row, col, x, y }) {
        if(piece.endsWith('p')) {
            return movePawn({ position, piece, row, col, x, y })
        } else {
            return movePiece({ position, piece, row, col, x, y })
            
        }
    },

    isPlayerInCheck : function({ positionAfterMove, position, player }) {
        const enemy = player.startsWith('w') ? 'b' : 'w';
        let kingPos = getKingPosition(positionAfterMove, player);
        const enemyPieces = getPieces(positionAfterMove, enemy);

        const enemyMoves = enemyPieces.reduce((acc, p) => 
        acc = [
            ...acc, 
            ...(p.piece.endsWith('p')) 
            ? getPawnCaptures({position : positionAfterMove, prevPosition : position, ...p})
            : this.getRegularMoves({ position : positionAfterMove, ...p })
        ],
        []
        );

        return enemyMoves.some(([x, y]) => kingPos[0] === x && kingPos[1] === y);
    },

    isStaleMate : function(position, player, castleDirection) {
        const isInCheck = this.isPlayerInCheck( { positionAfterMove : position, player });

        if(isInCheck) {
            return false;
        }

        const pieces = getPieces(position, player);
        const moves = pieces.reduce((acc, p) => acc = [
            ...acc,
            ...(this.getValidMoves({
                position,
                castleDirection,
                ...p
            }))
        ], []);

        return (!isInCheck && moves.length === 0)
    },

    insufficientMaterial : function (position) {
        const pieces = position.reduce((acc, row) => 
        acc = [
            ...acc,
            ...row.filter(x => x)
        ], []
        )

        if(pieces.length === 2) {
            return true;
        }

        if(pieces.length === 3 && (pieces.some(p => p.endsWith('b') || p.endsWith('n')))) {
            return true;
        }

        if(
            pieces.length === 4 &&
            pieces.every(p => p.endsWith('b') || p.endsWith('k')) &&
            new Set(pieces).size === 4 &&
            areSameColorTiles(
                findPieceCoords(position, 'wb')[0],
                findPieceCoords(position, 'bb')[0]
            ) 
        ) {
            return true;
        }

        return false;
    },

    isCheckMate : function(position, player, castleDirection) {
        const isInCheck = this.isPlayerInCheck( { positionAfterMove : position, player });

        if(!isInCheck) {
            return false;
        }

        const pieces = getPieces(position, player);
        const moves = pieces.reduce((acc, p) => acc = [
            ...acc,
            ...(this.getValidMoves({
                position,
                castleDirection,
                ...p
            }))
        ], []);

        return (isInCheck && moves.length === 0)
    },
};

export default master;