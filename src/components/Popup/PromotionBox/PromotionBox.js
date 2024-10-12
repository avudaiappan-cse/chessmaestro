import { useAppContext } from "../../../context/Context";
import { clearCandidateMoves, makeNewMove } from "../../../reducer/actions/move";
import { copyPosition, getNewMoveNotation } from "../../../utils/helper";
import "./PromotionBox.css";

const PromotionBox = ({ onClosePopup }) => {
    const options = ['q', 'r', 'b', 'n'];


    const { appState, dispatch } = useAppContext();
    const { promotionSquare } = appState;

    if(!promotionSquare) {
        return null;
    }

    const color = promotionSquare.x === 7 ? 'w' : 'b';

    const  { x, y} = promotionSquare;

    const getPromotionBoxPosition = () => {
        const style = {};

        if(x === 7) {
            style.top = "-10%";
        } else {
            style.top = "97.5%";
        }

        if(y <= 1) {
            style.left = "0%"
        } else if(y >= 6) {
            style.right = "0%"
        } else {
            style.left = `${12.5 * y - 20}%`
        }

        return style;
    }

    const onClick = option => {
        onClosePopup();
        const newPosition = copyPosition(appState.position[appState.position.length  -1]);

        newPosition[promotionSquare.row][promotionSquare.col] = '';
        newPosition[promotionSquare.x][promotionSquare.y] = color + option;

        dispatch(clearCandidateMoves());

        const newMove = getNewMoveNotation({
            ...promotionSquare,
            piece : color + 'p',
            promotesTo : color + option,
            position : appState.position[appState.position.length  - 1]
        })
        dispatch(makeNewMove({newPosition, newMove}));

    }

    return (
        <div className="popup-inner promotion-choices" style={getPromotionBoxPosition()}>
            {options.map(option => 
                <div 
                    key={option} 
                    className={`piece ${color}${option}`}
                    onClick={() => onClick(option)}
                >
                </div>
                )
            }
        </div>
    );
};


export default PromotionBox;