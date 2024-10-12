import { getCharacter } from "../../utils/helper";
import "./Column.css";

const Column = ({ columns }) => {
    return (
        <div className="columns">
            {columns.map(col => <span key={col}>{getCharacter(col)}</span>)}
        </div>
    );
};

export default Column;