import { useReducer } from 'react';
import './App.css';
import Board from "./components/Board";
import MovesList from './components/Control/Bits/MovesList';
import TakeBack from './components/Control/Bits/TakeBack';
import Control from './components/Control/Control';
import Footer from './components/Footer/Footer';
import AppContext from './context/Context';
import { reducer } from './reducer/Reducer';
import { initGameState } from './utils/constant';

function App() {

  const [appState, dispatch] = useReducer(reducer, initGameState);

  const providerState = {
    appState,
    dispatch
  }

  return (
    <AppContext.Provider value={providerState}>
        <div className="App">
          <Board />
          <Control>
              <MovesList />
              <TakeBack />
          </Control>
          <Footer />
        </div>
    </AppContext.Provider>
  );
}

export default App;
