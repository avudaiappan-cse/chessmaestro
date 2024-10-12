import { useAppContext } from "../../context/Context";
import master from "../../master/master";
import { generateCandidateMoves } from "../../reducer/actions/move";

const Piece = ({ row, col, piece }) => {

    const { appState, dispatch } = useAppContext();

    const { turn, position, castleDirection } = appState;

    const currentPosition =position[position.length - 1];



    const onDragStart = (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `${piece},${row},${col}`);
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 0);

        if(turn === piece[0]) {
            const candidateMoves = master.getValidMoves( 
                { 
                    position : currentPosition, 
                    prevPosition: position[position.length - 2], 
                    castleDirection : castleDirection[turn],
                    piece, 
                    row, 
                    col 
                }
            );
            dispatch(generateCandidateMoves( { candidateMoves }));
        }
    };

    const onDragEnd = e => e.target.style.display = 'block';

    return (
        <div 
            className={`piece ${piece} p-${col}${row}`} 
            draggable={true}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
        </div>
    );
}

export default Piece;