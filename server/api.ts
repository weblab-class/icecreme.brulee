import express from "express";
import auth from "./auth";
import { gameState, getRPSWinner, setNextTurn, getFermiWinner, setChosenPlayer, setCurrentQuestion, getCurrentQuestion } from "./logic";
import socketManager from "./server-socket";
const router = express.Router();

const socket = require("./server-socket");

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
    if (socket !== undefined) socketManager.addUser(req.user, socket);
  }
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.get("/activeUsers", (req, res) => {
  res.send({ activeUsers: socket.getAllConnectedUsers() , activePlayers: gameState.playerList});
});

router.post("/removeSocket", (req, res) => {
  if (req.user) {
    const socket = socketManager.getSocketFromSocketID(req.body.socketid);
    if (socket !== undefined) socketManager.removeUser(req.user, socket);
  }
  res.send({});
});


router.post("/question", auth.ensureLoggedIn, (req, res) => {
  //TODO: implement socket.on for question
  if (req.user) {
    // const socket = socketManager.getSocketFromUserID(req.body.answerer._id);
    // if (socket !== undefined) {
    //   socket.emit("question", {questionText:req.body.questionText, gameState:gameState});
    //   setCurrentQuestion(req.body.questionText);
    //   console.log(`${req.user.name} asked question "${req.body.questionText}" to ${req.body.answerer.name}`);
    // }
    setCurrentQuestion(req.body.questionText);
    socketManager.getIo().emit("question", {questionText:req.body.questionText, gameState:gameState});
    console.log(`${req.user.name} asked question "${req.body.questionText}" to ${req.body.answerer.name}`);
    res.send({});
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
    setChosenPlayer(req.body.chosenPlayer);
    socketManager.getIo().emit("choose", {chosenPlayer:req.body.chosenPlayer, gameState:gameState});
    console.log(`${req.user.name} chose ${req.body.chosenPlayer.name}`);
    res.send({});
  }
})

router.post('/update', auth.ensureLoggedIn, (req, res) => {
  if (req.user) {
    setNextTurn();
    // const askingPlayerSocket = socketManager.getSocketFromUserID(String(gameState.asker._id));
    // const answeringPlayerSocket = socketManager.getSocketFromUserID(String(gameState.answerer._id));
    // if (askingPlayerSocket !== undefined && answeringPlayerSocket !== undefined) {
    //   askingPlayerSocket.emit("update", {})
    // }
    if (gameState.asker!==undefined && gameState.answerer!==undefined) {
      socketManager.getIo().emit("update", {askingPlayer:gameState.asker, answeringPlayer:gameState.answerer});
      console.log(gameState)
      console.log(`${gameState.asker.name} is asking ${gameState.answerer.name}...`);
      res.send({});
    }
  }
})

router.post('/rps', auth.ensureLoggedIn, (req, res) => {
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
      const winner = getRPSWinner(gameState.answererRPS, gameState.chosenRPS)
      // console.log(gameState)
      if (winner) {
        console.log(`Between answerer ${gameState.answerer.name} and choice ${gameState.chosen.name}, ${winner.name} won!`);
        socketManager.getIo().emit("rpsupdate", {gameState:gameState, winner:winner});
      }
    }
    res.send({});
  }
})

router.post('/fermi', auth.ensureLoggedIn, (req, res) => {
  console.log(req.body.fermiAns)
  if (req.user){
    if (gameState.answerer?._id === req.user._id && gameState.answererRPS === undefined){
      gameState.answererFermi = req.body.fermiAns;
    }
    //if gameState.chosen instead of gameState.asker
    if (gameState.asker?._id === req.user._id && gameState.chosenRPS === undefined){
      gameState.chosenFermi = req.body.fermiAns;
    }
  }
  if (gameState.answererFermi && gameState.chosenFermi) {
    //TODO: get the Fermi answer and question
    const winner = getFermiWinner(gameState.answererFermi, gameState.chosenFermi, 0)
    if (winner) {
      socketManager.getIo().emit("fermiupdate", {gameState, winner})
      console.log(gameState)
      console.log(`Between answerer ${gameState.answerer?.name!} and choice ${gameState.chosen?.name!}, ${winner.name} won!`);
    }
  }
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
