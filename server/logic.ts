import {Player} from "../client/src/components/Player";

/** game state */

interface gameState {
    playerList: Player[]
    idToPlayerMap: Map<string, Player>;
    turn: number;
    chosen?: Player;
    state?: "rps" | "question";
}

type rps = "rock" | "paper" | "scissors";

export const gameState: gameState = {
    playerList: [],
    idToPlayerMap: new Map<string, Player>(),
    turn: 0,
}

//given the chooser rps and the choice rps, returns the winner
export const getRPSWinner = (chooser: rps, choice: rps) => {
    //two player objects: need to standardize how we do this part first
    const player1 = gameState.playerList[gameState.turn]
    const player2 = gameState.chosen

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
        }
    }

//not sure if this is written correctly
export const addPlayer = (name:String, id:String) => {
    const newPlayer: Player = {name: name, _id:id};
    gameState.playerList.concat(newPlayer);
    gameState.idToPlayerMap.set(String(id), newPlayer);
    console.log(gameState.playerList);
}

export const removePlayer = (id:String) => {
    gameState.playerList.filter((player) => player._id !== id)
    gameState.idToPlayerMap.delete(String(id));
    console.log(gameState.playerList);
  };

export default {
    gameState,
    getRPSWinner,
    addPlayer,
    removePlayer,
  };