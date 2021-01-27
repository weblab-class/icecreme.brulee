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
    currentQuestion?: String;
    currentFermi?: String; 
    currentFermiAnswer?: number;
}

type rps = "rock" | "paper" | "scissors";

export const gameState: gameState = {
    playerList: [],
    idToPlayerMap: new Map<string, Player>(),
    turn: 0,
}

export const codeToGameState: Map<string, gameState> = new Map<string, gameState>();

export const addNewGame = (code:string) => {
    console.log(codeToGameState);
    if (!codeToGameState.has(code)){
        const newGame: gameState = {
            playerList: [],
            idToPlayerMap: new Map<string, Player>(),
            turn: 0,
        }
        codeToGameState.set(code, newGame);
    }
}

//given the chooser rps and the choice rps, returns the winner
export const getRPSWinner = (chooser: rps, choice: rps, code:string): Player | undefined => {
    //two player objects: need to standardize how we do this part first
    const gameState = codeToGameState.get(code);
    if (gameState === undefined) {
        return;
    }
    const player1 = gameState.answerer;
    const player2 = gameState.chosen;

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

export const getFermiWinner = (chooser: number, choice: number, answer: number, code: string): Player | undefined => {
    //two player objects: need to standardize how we do this part first
    const gameState = codeToGameState.get(code)!;
    const player1 = gameState.answerer;
    const player2 = gameState.chosen;

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
export const addPlayer = (name:String, id:String, code:string) => {
    if (!gameState.idToPlayerMap.has(String(id))) {
        const newPlayer: Player = {name: name, _id:id, gameCode:code};
        console.log(`New player ${newPlayer.name}`);
        gameState.playerList = gameState.playerList.concat(newPlayer);
        gameState.idToPlayerMap.set(String(id), newPlayer);
    }

    if (code.length > 0){
            const currentGameState = codeToGameState.get(code);
            if (currentGameState && !currentGameState.idToPlayerMap.has(String(id))) {
                const newPlayer: Player = {name: name, _id:id, gameCode:code};
                console.log(`New player ${newPlayer.name} in room ${code}`);
                currentGameState.playerList = currentGameState.playerList.concat(newPlayer);
                currentGameState.idToPlayerMap.set(String(id), newPlayer);
            }
    }
}

export const removePlayer = (id:String, code:string) => {
    gameState.playerList = gameState.playerList.filter((player) => player._id !== id)
    gameState.idToPlayerMap.delete(String(id));
    if (code.length > 0) {
        const currentGameState = codeToGameState.get(code);
        if (currentGameState) {
            console.log(`Player ${currentGameState.idToPlayerMap.get(String(id))} left room ${code}`)
            currentGameState.playerList = currentGameState.playerList.filter((player) => player._id !== id)
            currentGameState.idToPlayerMap.delete(String(id));
        }
    }
    else {
        codeToGameState.forEach((value, key)=>{
            const currentGameState = value;
            console.log(`Player ${currentGameState.idToPlayerMap.get(String(id))} left room ${code}`)
            currentGameState.playerList = currentGameState.playerList.filter((player) => player._id !== id)
            currentGameState.idToPlayerMap.delete(String(id));
        })
    }
  };

//set asker and answerer given the turn; update turn
export const setNextTurn = (code:string) => {
    //not sure if block or global
    const gameState = codeToGameState.get(code);
    if (gameState === undefined) {
        return;
    }
    // if (currentGameState === undefined) {
    //     return;
    // }
    // currentGameState.turn = currentGameState.turn + 1;
    // currentGameState.chosen = undefined;
    // currentGameState.answererRPS = undefined;
    // currentGameState.chosenRPS = undefined;
    // if (currentGameState.turn === currentGameState.playerList.length) {
    //     currentGameState.asker = currentGameState.playerList[currentGameState.turn-1]
    //     currentGameState.answerer = currentGameState.playerList[0]
    // } else if (currentGameState.turn > currentGameState.playerList.length) {
    //     //if we reach the end of the list, we will reset the turn
    //     currentGameState.turn = 1
    //     currentGameState.asker = currentGameState.playerList[0]
    //     currentGameState.answerer = currentGameState.playerList[1]
    // } else {
    //     //simply update game state and who the players are
    //     currentGameState.asker = currentGameState.playerList[currentGameState.turn-1]
    //     currentGameState.answerer = currentGameState.playerList[currentGameState.turn]
    // }
    gameState.turn = gameState.turn + 1;
    gameState.chosen = undefined;
    gameState.answererRPS = undefined;
    gameState.chosenRPS = undefined;
    gameState.answererFermi = undefined;
    gameState.chosenFermi = undefined;
    gameState.currentFermi = undefined;
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

export const setChosenPlayer = (chosenPlayer: Player, code:string) => {
    const gameState = codeToGameState.get(code);
    if (gameState === undefined) {
        return;
    }
    gameState.chosen = chosenPlayer;
}

export const setCurrentQuestion = (question: String, code: string) => {
    const gameState = codeToGameState.get(code);
    if (gameState === undefined) {
        return;
    }
    gameState.currentQuestion = question;
}

export const getCurrentQuestion = (): String|undefined => {
    return gameState.currentQuestion;
}

export const getAllPlayers = (): Player[] => {
    const allPlayers:Player[] = [];
    codeToGameState.forEach((value, key) => {
        for (let i = 0; i < value.playerList.length; i++) {
        allPlayers.push(value.playerList[i]);
        }
    })
    // console.log("allplayers");
    // console.log(allPlayers);
    return allPlayers;
}

export const getRandomNumber = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export default {
    gameState,
    codeToGameState,
    getRPSWinner,
    addPlayer,
    removePlayer,
    setNextTurn,
    setChosenPlayer,
    getFermiWinner,
    setCurrentQuestion,
    getCurrentQuestion,
    addNewGame,
    getAllPlayers,
    getRandomNumber
  };