import { initializePosition } from "./helper";

export const STATUSES = {
    'ongoing': 'Ongoing',
    'promoting' : 'Promoting',
    'white' : 'White wins',
    'black' : 'Black wins',
    'stalemate' : 'Game draws due to stalemate',
    'insufficient' : 'Game draws due to insufficient material'
}

export const initGameState = {
    position : [ initializePosition() ],
    turn : 'w',
    candidateMoves : [],
    status : STATUSES.ongoing,
    promotionSquare : null,
    movesList : [],
    castleDirection : {
        w : 'both',
        b : 'both'
    }
}