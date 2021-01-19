import express from "express";
import auth from "./auth";
import { removePlayer } from "./logic";
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
  socket.getSocketFromUserID(req.body.answerer._id).emit("question", req.body.questionText);
  if (req.user) {
    console.log(`${req.user.name} asked question "${req.body.questionText}" to ${req.body.answerer.name}`);
  }
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
