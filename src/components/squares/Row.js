import "./Row.css";

const Row = ({ rows }) => {
    return (
        <div className="rows">
            {rows.map(row => <span key={row}>{row}</span>)}
        </div>
    );
} ;

export default Row;