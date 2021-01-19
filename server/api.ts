import express from "express";
import auth from "./auth";
import { gameState, setNextTurn } from "./logic";
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
  res.send({ activeUsers: socket.getAllConnectedUsers() });
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
    const socket = socketManager.getSocketFromUserID(req.body.answerer._id);
    if (socket !== undefined) {
      socket.emit("question", {questionText:req.body.questionText, gameState:gameState});
      console.log(`${req.user.name} asked question "${req.body.questionText}" to ${req.body.answerer.name}`);
    }
  }
})

router.post('/choose', auth.ensureLoggedIn, (req, res) => {
  //TODO: implement socket.on for choose
  if (req.user) {
    const socket = socketManager.getSocketFromUserID(req.body.chosenPlayer._id);
    if (socket !== undefined) {
      setNextTurn();
      socket.emit("choose", {chosenPlayer:req.body.chosenPlayer, gameState:gameState});
      console.log(`${req.user.name} chose ${req.body.chosenPlayer.name}`);
    }
  }
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
