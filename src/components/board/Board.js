import { useState, useEffect } from 'react';
import Tile from '../tile/Tile';
import ScoreBoard from '../score/ScoreBoard';
import RestartButton from '../restart/RestartButton';
import { initiateBoard, move, getEmptyTilesIndexes, addRandomTile } from './board_functions'

function GameOverDiv( {status} ) {
    return (
        <div className='gameOver' >
            <h1>{(status === 'won') ? 'youHaveWonOU WON!': 'GAME OVER'}</h1>
        </div>
    )
}

function Board(props) {

// SETUP
// =====
    const [tiles, setTiles] = useState(initiateBoard());
    const [score, setScore] = useState(0);
    const [gameStatus, setGameStatus] = useState(false);

    useEffect( () => {
        if (gameStatus === false){
            document.addEventListener('keydown', keyPressHandler);
        }

        return () => {
            document.removeEventListener('keydown', keyPressHandler);
        }
    })

    useEffect( () => {
      checkGameStatus(tiles);  
    }, [tiles])

// =====


    function increaseScore(value) {
        setScore(score + value);
    }

    function checkGameStatus(tiles) {
        const tilesFlatArray = [].concat(...tiles);
        const emptyTiles = getEmptyTilesIndexes(tilesFlatArray)
        if (emptyTiles.length < 1) {
            setGameStatus('lost');
        }
        if (tilesFlatArray.includes(2048)) {
            setGameStatus('won')
        }
    }

    function keyPressHandler(e) {
        let newTiles = [];
        let moveScore = 0;

        switch(e.key) {
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
                [newTiles, moveScore] = move(tiles, e.key, increaseScore)
                break;

            default:
                return;
        }

        newTiles = addRandomTile(newTiles);
        increaseScore(moveScore);
        setTiles([...newTiles]);
    }

    function restartHandler() {
        setGameStatus(false);
        setScore(0);
        setTiles(initiateBoard());
    }

    function renderRow(row) {
        return (
            <tr className="row">
                {row.map((tile, i) => <td key={i.toString()}><Tile value={tile} /></td>)}
            </tr>
        )
    }

    return (
        <div className="container">
            <ScoreBoard score={score} />
            <div className="board">
                {(gameStatus !== false) ? <GameOverDiv status={gameStatus} /> : null}
                <table className="table">
                <tbody>
                    {tiles.map((row) => renderRow(row))}
                </tbody>
                </table>
            </div>
                {(gameStatus !== false) ? <RestartButton clickHandler={restartHandler} /> : null}
        </div>
    );
}

export default Board;