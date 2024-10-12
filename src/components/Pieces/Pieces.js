import './Pieces.css';
import Piece from "./Piece.js";
import { useRef } from 'react';
import { useAppContext } from "../../context/Context";
import { clearCandidateMoves, makeNewMove } from '../../reducer/actions/move';
import master from '../../master/master';
import { openPromotion } from '../../reducer/actions/popup';
import { detectCheckmate, detectInsufficientMaterial, detectStalemate, updateCastling } from '../../reducer/actions/game';
import { getCastleDirections } from '../../master/getMoves';
import { getNewMoveNotation } from '../../utils/helper';

const Pieces = () => {

    const ref = useRef();

    const { appState, dispatch } = useAppContext();

    const currentPosition = appState.position[appState.position.length - 1];

    const getComputedCoords = e => {
        const { width, left, top } =  ref.current.getBoundingClientRect();
        const size = width / 8;
        const y = Math.floor((e.clientX - left) / size);
        const x = 7 - Math.floor((e.clientY - top) / size);
        return {x,y};
    }

    const openPromotionBox = ({ row, col, x, y}) => {
        dispatch(openPromotion({
            row : Number(row), col : Number(col), x, y
        }))
    }

    const updateCastlingState = ( { piece, row, col }) => {
        const direction = getCastleDirections({
            castleDirection : appState.castleDirection,
            piece,
            row,
            col
        });

        if(direction) {
            dispatch(updateCastling(direction));
        }
    }

    const move = e => {
        const {x,y} = getComputedCoords(e);
        const [piece, row, col] = e.dataTransfer.getData('text').split(",");
        const opponent = piece.startsWith('b') ? 'w' : 'b';
        const castleDirection = appState.castleDirection[`${piece.startsWith('b') ? 'w' : 'b'}`]
        if(appState.candidateMoves?.find(m => m[0] === x && m[1] === y)) {
            if((piece === 'wp' && x === 7) || (piece === 'bp' && x === 0)) {
                openPromotionBox({ row, col, x, y });
                return;
            }

            if(piece.endsWith('r') || piece.endsWith('k')) {
                updateCastlingState({ piece, row, col });
            }

            const newPosition = master.performMove({
                position : currentPosition,
                piece,
                row,
                col,
                x,
                y
            })
            
            const newMove = getNewMoveNotation({ 
                piece,
                row,
                col,
                x,
                y,
                position : currentPosition
             })
            dispatch(makeNewMove({newPosition, newMove}));

            if(master.insufficientMaterial(newPosition)) {
                dispatch(detectInsufficientMaterial())
            }else if(master.isStaleMate(newPosition, opponent, castleDirection)) {
                dispatch(detectStalemate())
            } else if(master.isCheckMate(newPosition, opponent, castleDirection)) {
                dispatch(detectCheckmate(piece[0]))
            }
        }
        dispatch(clearCandidateMoves());
    }

    const onDrop = e => {
        e.preventDefault();
        move(e);
    }

    const onDragOver = e => e.preventDefault();

    return (
        <div 
            ref={ref}
            className='pieces'
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            { 
                currentPosition.map(
                    (r, row) => r.map(
                        (c, col) => currentPosition[row][col] 
                        ?  <Piece 
                                key={row + "-" + col}
                                row={row}
                                col={col}
                                piece={currentPosition[row][col]}
                            />
                        : null 
                    )
                )
            }
        </div>
    );
}

export default Pieces;