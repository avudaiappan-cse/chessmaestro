import { useAppContext } from '../../../context/Context';
import { setupNewGame } from '../../../reducer/actions/game';
import { STATUSES } from '../../../utils/constant';
import './GameEnds.css';

const GameEnds = ( { onClosePopup }) => {
    const { appState : {status}, dispatch } = useAppContext();

    if(status === STATUSES.ongoing || status === STATUSES.promoting) {
        return null;
    }

    const isWin = status.endsWith('wins');

    const newGame = () => {
        dispatch(setupNewGame())
    }

    return (
        <div className='popup-inner popup-inner_center'>
            <h1>{ isWin ? status : 'Draw' } </h1>
            <p>{!isWin && status}</p>
            <div className={status}></div>
            <button onClick={newGame}>New Game</button>
        </div>
    );
};

export default GameEnds;