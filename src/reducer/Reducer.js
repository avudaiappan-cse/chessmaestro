import { STATUSES } from "../utils/constant";
import actionTypes from "./actions/actionTypes";

export const reducer = (state, action) => {
    switch(action.type) {
        case actionTypes.NEW_MOVE :  {
            let { turn, position, movesList } = state;

            turn = turn === 'w' ? 'b' : 'w';

            position = [
                ...position,
                action.payload.newPosition
            ]

            movesList = [
                ...movesList,
                action.payload.newMove
            ]

            return {
                ...state,
                turn,
                position,
                movesList
            }
        }

        case actionTypes.GENERATE_CANDIDATE_MOVES :  {
            return {
                ...state,
                candidateMoves : action.payload.candidateMoves
            }
        }

        case actionTypes.CLEAR_CANDIDATE_MOVES : {
            return {
                ...state,
                candidateMoves : []
            }
        }

        case actionTypes.PROMOTION_OPEN : {
            return {
                ...state, 
                status : STATUSES.promoting,
                promotionSquare : { ...action.payload }
            }
        }

        case actionTypes.PROMOTION_CLOSE : {
            return {
                ...state,
                status : STATUSES.ongoing,
                promotionSquare : null
            }
        }

        case actionTypes.CAN_CASTLE : {
            let { turn, castleDirection } = state;
            castleDirection[turn] = action.payload;

            return {
                ...state, 
                castleDirection
            }
        }

        case actionTypes.STALEMATE : {
            return {
                ...state, 
                status : STATUSES.stalemate
            }
        }

        case actionTypes.WIN : {
            return {
                ...state, 
                status : action.payload === 'w' ? STATUSES.white : STATUSES.black
            }
        }

        case actionTypes.INSUFFICIENT_MATERIAL : {
            return {
                ...state, 
                status : STATUSES.insufficient
            }
        }


        case actionTypes.NEW_GAME : {
            return {
                ...action.payload
            }
        }

        case actionTypes.TAKE_BACK : {
            let { position, movesList, turn } = state; 
            if(position.length > 1) {
                position = position.slice(0, position.length - 1)
                movesList = movesList.slice(0, position.length - 1)
                turn = turn === 'w' ? 'b' : 'w';
            }
            return {
                ...state,
                position,
                movesList,
                turn
            }
        }


        default :
            return state;
    }
}