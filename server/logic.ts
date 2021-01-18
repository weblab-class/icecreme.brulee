import Player from "../client/src/components/Player"

/** game state */

interface gameState {
    playerList: Player[];
    turn: number;
    chosen?: Player;
    state?: "rps" | "question";
}

type rps = "rock" | "paper" | "scissors";

const gameState: gameState = {
    playerList: [],
    turn: 0,
}

//given the chooser rps and the choice rps, returns the winner
const getRPSWinner = (chooser: rps, choice: rps) => {
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
const addPlayer = (newPlayer: Player) => {
    gameState.playerList.concat(newPlayer);
}

const removePlayer = (id) => {
    delete gameState.playerList[id];
  };