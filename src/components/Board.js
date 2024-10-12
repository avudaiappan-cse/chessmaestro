import { useAppContext } from "../context/Context";
import { getKingPosition } from "../master/getMoves";
import master from "../master/master";
import { generateTile } from "../utils/helper";
import "./Board.css";
import Pieces from "./Pieces/Pieces";
import GameEnds from "./Popup/GameEnds/GameEnds";
import Popup from "./Popup/Popup";
import PromotionBox from "./Popup/PromotionBox/PromotionBox";
import Column from "./squares/Column";
import Row from "./squares/Row";

const Board = () => {

    const rows = generateTile((x,i) => 8 - i);
    const columns = generateTile((x,i) => i + 1);

    const { appState } = useAppContext();

    const position = appState.position[appState.position.length  - 1];

    const isChecked = (() => {
       const isInCheck =  master.isPlayerInCheck({ positionAfterMove : position, player : appState.turn });

       if(isInCheck) {
            return getKingPosition(position, appState.turn);
       }

       return null;
    })();

    const getClassName = (row, col) => {
        let cname = 'tile';
        cname += (row + col) % 2 === 0 ? ' tile-dark' : ' tile-light';

        if(appState.candidateMoves?.find(m => m[0] === row && m[1] === col)) {
        
            if(position[row][col]) {
                cname += ' attacking'
            } else {
                cname += ' highlight'
            }
        }

        if(isChecked && isChecked[0] === row && isChecked[1] === col) {
            cname += ' checked';
        }

        return cname;
    }

    return (
        <div className="board">
            <Row rows={rows} />
            <div className="tiles">
                { 
                    rows.map((row, i) => columns.map((col, j) => 
                        <div key={row + '-' + col} className={getClassName(7 - i,j)}>{row} {col} </div>
                    ))
                }
            </div>

            <Pieces />
            <Popup>
                <PromotionBox />
                <GameEnds />
            </Popup>
            <Column columns={columns} />
        </div>
    );
}

export default Board;