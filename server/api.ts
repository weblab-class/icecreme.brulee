import express from "express";
//import PlayerBlock from "../client/src/components/Player";
import Player from "../shared/Player";
import auth from "./auth";
import { getRPSWinner, setNextTurn, getFermiWinner, setChosenPlayer, setCurrentQuestion, getCurrentQuestion, codeToGameState, addNewGame, addPlayer, getAllPlayers, getRandomNumber} from "./logic";
import socketManager, { addUser, getAllConnectedUsers } from "./server-socket";
const router = express.Router();

const socket = require("./server-socket");

const Fermi = require("./models/Fermi");
const Message = require("./models/message");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});
router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    const socket = socketManager.getSocketFromSocketID(req.body.socketid);
    if (socket !== undefined && req.body.gameCode === undefined) {socketManager.addUser(req.user, socket, '');}
    else if (socket !== undefined && req.body.gameCode) {
      socketManager.addUser(req.user, socket, req.body.gameCode);
    }
  }
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.get("/activeUsers", (req, res) => {
  res.send({ activeUsers: socket.getAllConnectedUsers() , activePlayers: getAllPlayers(), codeToGameState:codeToGameState});
});

router.post("/removeSocket", (req, res) => {
  if (req.user) {
    const socket = socketManager.getSocketFromSocketID(req.body.socketid);
    if (socket !== undefined) {socketManager.removeUser(req.user, socket, req.body.gameCode);}
  }
  res.send({});
});

//update player with their custom avatar and name
//request is a Player object
router.post("/playerUpdate", (req, res) => {
  const gameState = codeToGameState.get(req.body.gameCode)!
  if (req.user) {
    let player: Player;
    let newPlayerList: Player [] = [];
    for (player of gameState.playerList) {
      if (player._id === req.body._id) {
        player.name = req.body.name;
        player.color = req.body.color;
        newPlayerList.push(player)
      } else {
        newPlayerList.push(player)
      }
    }
    console.log(newPlayerList)
    gameState.playerList = newPlayerList;

    for (let i = 0; i < gameState.playerList.length; i++) {
      let playerSocket = socketManager.getSocketFromUserID(String(gameState.playerList[i]._id));
      if (playerSocket !== undefined) {
        playerSocket.emit("activeUsers", {activePlayers:gameState.playerList, activeUsers: gameState.playerList});
      }
    }
    res.send({});
  }
})

router.post("/question", auth.ensureLoggedIn, (req, res) => {
  //TODO: implement socket.on for question
  if (req.user) {
    // const socket = socketManager.getSocketFromUserID(req.body.answerer._id);
    // if (socket !== undefined) {
    //   socket.emit("question", {questionText:req.body.questionText, gameState:gameState});
    //   setCurrentQuestion(req.body.questionText);
    //   console.log(`${req.user.name} asked question "${req.body.questionText}" to ${req.body.answerer.name}`);
    // }
    if (req.body.answerer.gameCode) {
      const currentGameState = codeToGameState.get(req.body.answerer.gameCode);
      if (currentGameState) {
        setCurrentQuestion(req.body.questionText, req.body.answerer.gameCode);
        for (let i = 0; i < currentGameState.playerList.length; i++) {
          let playerSocket = socketManager.getSocketFromUserID(String(currentGameState.playerList[i]._id));
          if (playerSocket !== undefined) {
            playerSocket.emit("question", {questionText:req.body.questionText, gameState:currentGameState});
          }
        }
        console.log(`${req.user.name} asked question "${req.body.questionText}" to ${req.body.answerer.name}`);
        res.send({});
      }
    }
    // setCurrentQuestion(req.body.questionText);
    // socketManager.getIo().emit("question", {questionText:req.body.questionText, gameState:gameState});
    // console.log(`${req.user.name} asked question "${req.body.questionText}" to ${req.body.answerer.name}`);
    // res.send({});
  }
})

router.post('/choose', auth.ensureLoggedIn, (req, res) => {
  //TODO: implement socket.on for choose
  if (req.user) {
    // const socket = socketManager.getSocketFromUserID(req.body.chosenPlayer._id);
    // setChosenPlayer(req.body.chosenPlayer);
    // if (socket !== undefined) {
    //   socket.emit("choose", {chosenPlayer:req.body.chosenPlayer, gameState:gameState});
    //   console.log(`${req.user.name} chose ${req.body.chosenPlayer.name}`);
    // }
    if (req.body.chosenPlayer.gameCode) {
      const currentGameState = codeToGameState.get(req.body.chosenPlayer.gameCode)
      if (currentGameState) {
        setChosenPlayer(req.body.chosenPlayer, req.body.chosenPlayer.gameCode);
        for (let i = 0; i < currentGameState.playerList.length; i++) {
          let playerSocket = socketManager.getSocketFromUserID(String(currentGameState.playerList[i]._id));
          if (playerSocket !== undefined) {
            playerSocket.emit("choose", {chosenPlayer:req.body.chosenPlayer, gameState:currentGameState});
          }
        }
        console.log(`${req.user.name} chose ${req.body.chosenPlayer.name}`);
        res.send({});
      }
    }
    // setChosenPlayer(req.body.chosenPlayer);
    // socketManager.getIo().emit("choose", {chosenPlayer:req.body.chosenPlayer, gameState:gameState});
    // console.log(`${req.user.name} chose ${req.body.chosenPlayer.name}`);
    // res.send({});
  }
})

router.post('/update', auth.ensureLoggedIn, (req, res) => {
  if (req.user) {
    setNextTurn(req.body.gameCode);
    // const askingPlayerSocket = socketManager.getSocketFromUserID(String(gameState.asker._id));
    // const answeringPlayerSocket = socketManager.getSocketFromUserID(String(gameState.answerer._id));
    // if (askingPlayerSocket !== undefined && answeringPlayerSocket !== undefined) {
    //   askingPlayerSocket.emit("update", {})
    // }
    if (codeToGameState.get(req.body.gameCode)) {
      const currentGameState = codeToGameState.get(req.body.gameCode);
      if (currentGameState && currentGameState.asker!==undefined && currentGameState.answerer!==undefined) {
        for (let i = 0; i < currentGameState.playerList.length; i++) {
          let playerSocket = socketManager.getSocketFromUserID(String(currentGameState.playerList[i]._id));
          if (playerSocket !== undefined) {
            playerSocket.emit("update", {askingPlayer:currentGameState.asker, answeringPlayer:currentGameState.answerer});
          }
        }
        console.log(currentGameState)
        console.log(`${currentGameState.asker.name} is asking ${currentGameState.answerer.name}...`);
        res.send({});
      }
    }
    // if (gameState.asker!==undefined && gameState.answerer!==undefined) {
    //   socketManager.getIo().emit("update", {askingPlayer:gameState.asker, answeringPlayer:gameState.answerer});
    //   console.log(gameState)
    //   console.log(`${gameState.asker.name} is asking ${gameState.answerer.name}...`);
    //   res.send({});
    // }
  }
})

router.post('/rps', auth.ensureLoggedIn, (req, res) => {
  const gameState = codeToGameState.get(req.body.gameCode);
  if (gameState === undefined) {
    return;
  }
  console.log(req.body.rpsChoice)
  if (req.user){
    if (gameState.answerer && gameState.chosen && gameState.answerer._id === req.user._id && gameState.answererRPS === undefined){
      gameState.answererRPS = req.body.rpsChoice;
      console.log(`Waiting on ${gameState.chosen.name}`)
      console.log(gameState)
    }
    //if gameState.chosen instead of gameState.asker
    if (gameState.chosen && gameState.answerer && gameState.chosen._id === req.user._id && gameState.chosenRPS === undefined){
      gameState.chosenRPS = req.body.rpsChoice;
      console.log(`Waiting on ${gameState.answerer.name}`)
      console.log(gameState)
    }
    if (gameState.answererRPS && gameState.chosenRPS && gameState.chosen && gameState.answerer) {
      const winner = getRPSWinner(gameState.answererRPS, gameState.chosenRPS, req.body.gameCode);
      // console.log(gameState)
      if (winner) {
        console.log(`Between answerer ${gameState.answerer.name} and choice ${gameState.chosen.name}, ${winner.name} won!`);
        for (let i = 0; i < gameState.playerList.length; i++) {
          let playerSocket = socketManager.getSocketFromUserID(String(gameState.playerList[i]._id));
          if (playerSocket !== undefined) {
            playerSocket.emit("rpsupdate", {gameState:gameState, winner:winner});
          }
        }
        // socketManager.getIo().emit("rpsupdate", {gameState:gameState, winner:winner});
      }
    }
    res.send({});
  }
})

//fermis
router.get('/fermi', auth.ensureLoggedIn, (req, res) => {
  // TODO: get random fermi
  let query = {};
  let index:number = getRandomNumber(0, 216);
  Fermi.find({}).then((fermis:any) => {res.send(fermis[index].question)});
})

router.post('/fermi', auth.ensureLoggedIn, (req, res) => {
  const gameState = codeToGameState.get(req.body.gameCode)!;
  console.log(req.body.fermiAns)
  if (req.user){
    if (gameState.answerer && gameState.chosen && gameState.answerer._id === req.user._id && gameState.answererFermi === undefined){
      gameState.answererFermi = req.body.fermiAns;
      console.log(`Waiting on ${gameState.chosen.name}`)
      console.log(gameState)
    }
    //if gameState.chosen instead of gameState.asker
    if (gameState.answerer && gameState.chosen && gameState.chosen._id === req.user._id && gameState.chosenFermi === undefined){
      gameState.chosenFermi = req.body.fermiAns;
      console.log(`Waiting on ${gameState.answerer.name}`)
      console.log(gameState)
    }
  }
  if (gameState.answerer && gameState.chosen && gameState.answererFermi && gameState.chosenFermi) {
    //TODO: get the Fermi answer and question
    const winner = getFermiWinner(gameState.answererFermi, gameState.chosenFermi, 0, req.body.gameCode);
    if (winner) {
      console.log(`Between answerer ${gameState.answerer.name} and choice ${gameState.chosen.name}, ${winner.name} won!`);
        for (let i = 0; i < gameState.playerList.length; i++) {
          let playerSocket = socketManager.getSocketFromUserID(String(gameState.playerList[i]._id));
          if (playerSocket !== undefined) {
            playerSocket.emit("fermiupdate", {gameState:gameState, winner:winner});
          }
      }
    }
  }
})

router.post('/newgame', auth.ensureLoggedIn, (req, res) => {
  if (req.user) {
    addNewGame(req.body.gameCode);
    addPlayer(req.user.name, req.user._id, req.body.gameCode);
    console.log(codeToGameState);
    socketManager.getIo().emit("activeUsers", {activeUsers: getAllConnectedUsers() , activePlayers:getAllPlayers(), gameCode:req.body.gameCode});
  }
  res.send({});
})



// chat messages

router.get("/chat", (req, res) => {
  let query = { "gameCode":req.query.gameCode};
  
  Message.find(query).then((messages:any) => {
    console.log(`found ${messages.length} messages`);
    res.send(messages)
  });
});

router.post("/message", auth.ensureLoggedIn, (req, res) => {
  if (req.user) {
    console.log(`Received a chat message from ${req.body.name}: ${req.body.content}`);

  // insert this message into the database
  const message = new Message({
    sender: {
      _id: req.user._id,
      name: req.body.name,
    },
    content: req.body.content,
    gameCode: req.body.gameCode,
  });
  message.save();

  socket.getIo().emit("message", message);
  res.send({message})
  }

});


// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
