//import {Player} from "../client/src/components/Player";
import {Player} from "../shared/Player";


/** game state */

interface gameState {
    playerList: Player[];
    idToPlayerMap: Map<string, Player>;
    turn: number;
    state?: "rps" | "question";
    asker?: Player | undefined;
    answerer?: Player | undefined;
    chosen?: Player | undefined;
    answererRPS?: rps | undefined;
    chosenRPS?: rps | undefined;
    answererFermi?: number | undefined;
    chosenFermi?: number | undefined;
}

type rps = "rock" | "paper" | "scissors";

export const gameState: gameState = {
    playerList: [],
    idToPlayerMap: new Map<string, Player>(),
    turn: 0,
}

//given the chooser rps and the choice rps, returns the winner
export const getRPSWinner = (chooser: rps, choice: rps): Player => {
    //two player objects: need to standardize how we do this part first
    const player1 = gameState.playerList[gameState.turn]
    const player2 = gameState.chosen!

    //if there's a tie, we need to reroll
    if ( (chooser === "rock" && choice === "scissors") ||
        (chooser === "scissors" && choice === "paper") ||
        (chooser === "paper" && choice === "rock")) {
            return player1
        } else if ((choice === "rock" && chooser === "scissors") ||
        (choice === "scissors" && chooser === "paper") ||
        (choice === "paper" && chooser === "rock")) {
            return player2
        } else {
            //TODO: reroll / play RPS again
            //if tie, question gets revealed
            return player2
    }
}

export const getFermiWinner = (chooser: number, choice: number, answer: number): Player => {
    //two player objects: need to standardize how we do this part first
    const player1 = gameState.playerList[gameState.turn]
    const player2 = gameState.chosen!

    //if there's a tie, we need to reroll
    const player1Diff = Math.abs(chooser - answer)
    const player2Diff = Math.abs(choice - answer)
    if ( player1Diff < player2Diff) {
        return player1
    } else if ( player2Diff < player1Diff) {
        return player2
    } else {
        //ties go to choice for now
        return player2
    }
}

//not sure if this is written correctly
export const addPlayer = (name:String, id:String) => {
    const newPlayer: Player = {name: name, _id:id};
    console.log(`New player ${newPlayer.name}`);
    gameState.playerList = gameState.playerList.concat(newPlayer);
    gameState.idToPlayerMap.set(String(id), newPlayer);
}

export const removePlayer = (id:String) => {
    gameState.playerList = gameState.playerList.filter((player) => player._id !== id)
    gameState.idToPlayerMap.delete(String(id));
  };

//set asker and answerer given the turn; update turn
export const setNextTurn = () => {
    gameState.turn = gameState.turn + 1
    if (gameState.turn === gameState.playerList.length) {
        gameState.asker = gameState.playerList[gameState.turn-1]
        gameState.answerer = gameState.playerList[0]
    } else if (gameState.turn > gameState.playerList.length) {
        //if we reach the end of the list, we will reset the turn
        gameState.turn = 1
        gameState.asker = gameState.playerList[0]
        gameState.answerer = gameState.playerList[1]
    } else {
        //simply update game state and who the players are
        gameState.asker = gameState.playerList[gameState.turn-1]
        gameState.answerer = gameState.playerList[gameState.turn]
    }
}

export const setChosenPlayer = (chosenPlayer: Player) => {
    gameState.chosen = chosenPlayer
}

export default {
    gameState,
    getRPSWinner,
    addPlayer,
    removePlayer,
    setNextTurn,
    setChosenPlayer,
    getFermiWinner,
  };