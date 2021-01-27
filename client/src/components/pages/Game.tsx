/*TODO*/
import React, { Component } from 'react';
import "./Game.css";
import { RouteComponentProps } from "@reach/router";
import GoogleLogin, {  GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login';
import PlayerList from '../PlayerList';
import Player from "../../../../shared/Player";
import { get, post } from '../../utilities';
import RockPaperScissors from '../RockPaperScissors';
import {NewQuestionInput} from '../NewTextInput';
import PlayerButtonList from '../PlayerButtonList';
import User from "../../../../shared/User";
import { socket } from '../../client-socket';
const GOOGLE_CLIENT_ID = "1029457388024-o249v3ppd6up5tpigtvelkjsv3rgirj0.apps.googleusercontent.com";
import { navigate } from "@reach/router";
import Chat from "../Chat";
import { Button, Input } from 'semantic-ui-react';
import FermiBlock from '../FermiBlock';


type Props = {
  userId: String;
  handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  handleLogout: () => void;
  gameCode?: string;
}
type State = {
  userId: String;
  currentPlayer: Player;

  answeringPlayer: Player;

  activePlayers: Player[];
  loggedIn: boolean;

  gameStarted: boolean;
  isAskingPlayer: boolean;
  isAnsweringPlayer: boolean;
  isChosenPlayer: boolean;
  isRPSPlayer: boolean;
  hasAskedQuestion: boolean;
  hasChosenPlayer: boolean;
  questionText: string;
  chooseText: string;
  buttonText: string;
  questionReveal: boolean;
  codeText: string;
  fermiQuestion: string;
  fermiAnswer: number;
  mode: string;
}

class Game extends Component<Props & RouteComponentProps, State> {
  constructor(props){
    super(props);
    this.state = {
      userId: undefined,
      currentPlayer: {
        name:"",
        _id: undefined
      },
      answeringPlayer: {
        name:"",
        _id: undefined
      },
      activePlayers: [],
      loggedIn: false,
      gameStarted: false,
      isAskingPlayer: false,
      isAnsweringPlayer: false,
      isChosenPlayer: false,
      isRPSPlayer: false,
      hasAskedQuestion: false,
      hasChosenPlayer: false,
      questionText:"",
      chooseText:"",
      buttonText:"Start game",
      questionReveal: false,
      codeText: "Room code: " + this.props.gameCode,
      fermiQuestion: "",
      fermiAnswer: 0,
      mode: "",
    };
  }

  enableRPS = () => {
    this.setState({isRPSPlayer:true});
  }

  disableQuestionSubmit = () => {
    this.setState({isAskingPlayer:false});
  }

  disableButtonList = () => {
    this.setState({isAnsweringPlayer:false});
  }

  disableRPS = () => {
    this.setState({isRPSPlayer:false, isChosenPlayer:false});
  }

  setMode = (mode: string) => {
    this.setState({mode: mode});
    // console.log('current game room')
    // console.log(this.props.gameCode);
    if (this.props.gameCode.length === 0) {
      // console.log('error: game code not set.');
      return;
    }
    post('/api/mode', {mode: mode, gameCode:String(this.props.gameCode)});
  }

  getFermiQuestion = () => {
    get("/api/fermi", {gameCode:this.props.gameCode}).then((data) => {
      this.setState({fermiQuestion: data.question, fermiAnswer: data.answer});
    });
  }

  componentDidMount() {
    get("/api/whoami")
      .then((user: User) => {
        if (user._id) {
          // They are registed in the database and currently logged in.
          const currentPlayer: Player = {
            name:user.name,
            _id:user._id
          };
          this.setState({ userId: user._id, loggedIn: true});
        }
      })
      .then(() =>
        socket.on("connect", () => {
          post("/api/initsocket", { socketid: socket.id , gameCode:this.props.gameCode}).then(()=>{
            // this.setState({codeText: "Room code: " + this.props.gameCode});
          });
        })
      )
      
    get("/api/activeUsers").then((data) => {
      const playerList : Player[] = [];
      for (let i = 0; i < data.activeUsers.length; i++) {
        const newPlayer: Player = {name: data.activeUsers[i].name, _id: data.activeUsers[i]._id, color: data.activeUsers[i].color}
        playerList.push(newPlayer)
      }
      let playerName = this.state.currentPlayer.name;
      for (let i = 0; i < data.activePlayers.length; i++) {
        if (this.state.userId === data.activePlayers[i]._id){
          playerName = data.activePlayers[i].name;
        }
      }
      console.log(`New name ${playerName}`);
      const current: Player = {name: playerName, _id: this.state.userId};
      this.setState({
        activePlayers: data.activePlayers.filter((player) => {
          return player.gameCode === this.props.gameCode
        }),
        currentPlayer: current
      });
      get('/api/mode', {gameCode: this.props.gameCode}).then((data) => {
        this.setState({mode: data.mode});
      })
    })
    
    socket.on("activeUsers", (data) => {
      const playerList : Player[] = [];
      for (let i = 0; i < data.activeUsers.length; i++) {
        const newPlayer: Player = {name: data.activeUsers[i].name, _id: data.activeUsers[i]._id, color: (data.activeUsers[i].color || undefined)}
        playerList.push(newPlayer)
      }
      let playerName = this.state.currentPlayer.name;
      for (let i = 0; i < data.activePlayers.length; i++) {
        if (this.state.currentPlayer._id === data.activePlayers[i]._id){
          playerName = data.activePlayers[i].name;
        }
      }
      console.log(`New name ${playerName}`);
      const current: Player = {name: playerName, _id: this.state.userId};
      this.setState({
        activePlayers: data.activePlayers.filter((player) => {
          return player.gameCode === this.props.gameCode
        }),
        currentPlayer: current
      });
      // if (this.state.activePlayers.length > 1 && !(this.state.gameStarted)) {
      //   post("/api/update", {});
      // }
    });


    socket.on("question", (data) => {
      //TODO: implement me 
      if (data.gameState.answerer._id === this.state.userId){
        console.log(`${data.gameState.asker.name} asks: ${data.questionText}`);
        this.setState({isAnsweringPlayer:true, questionText:`${data.gameState.asker.name} asks: ${data.questionText}`, chooseText:''});
      }
      else if (data.gameState.asker._id !== this.state.userId) {
        console.log(`${data.gameState.asker.name} is asking ${data.gameState.answerer.name} a question...`);
        this.setState({questionText:`${data.gameState.asker.name} is asking ${data.gameState.answerer.name} a question...`})
      }
    });

    socket.on("choose", (data) => {
      //TODO: implement me
      if (data.gameState.chosen._id === this.state.userId) {
        console.log(`${data.gameState.answerer.name} chose you!`);
        this.setState({isChosenPlayer:true, chooseText:`${data.gameState.answerer.name} chose you!`});
      }
      else if (data.gameState.answerer._id === this.state.userId) {
        console.log(`You chose ${data.gameState.chosen.name}!`);
        this.setState({isRPSPlayer:true, chooseText:`You chose ${data.gameState.chosen.name}!`});
      }
      else {
        console.log(`${data.gameState.answerer.name} chose ${data.gameState.chosen.name}!`);
        this.setState({chooseText:`${data.gameState.answerer.name} chose ${data.gameState.chosen.name}!`})
      }
      // post("/api/update", {})
      // post("/api/rps", )
    })

    socket.on("update", (data) => {
      //TODO: implement me
      this.setState({isAskingPlayer:data.askingPlayer._id ===this.state.userId, gameStarted:true, answeringPlayer:data.answeringPlayer, questionText:'', chooseText: '', hasAskedQuestion: false, hasChosenPlayer: false});
      // this.setState({isAskingPlayer:data.askingPlayer._id ===this.state.userId, gameStarted:true, answeringPlayer:data.answeringPlayer, isAnsweringPlayer:data.answeringPlayer._id ===this.state.userId, questionText:''});
      console.log(this.state.isAskingPlayer)
      this.getFermiQuestion();
    })

    socket.on('fermi', (data) => {
      this.getFermiQuestion();
    })

    //todo for rps
    socket.on("rpsupdate", (data) => {
      console.log(`rpsupdate, winner ${data.winner.name}`)
      if (data.winner._id === data.gameState.answerer._id) {
        this.setState({questionReveal: false, questionText:`${data.winner.name} won, so the question will not be revealed.`});
        console.log(`Question will not be revealed.`)
      } else if (data.winner._id === data.gameState.chosen._id) {
        this.setState({questionReveal: true, questionText: `${data.winner.name} won! The question was "${data.gameState.currentQuestion}"`})
        console.log(`Revealed question is ${data.gameState.currentQuestion}`)
      }
      this.setState({gameStarted: false, buttonText:'Next round'});
      // post("/api/update", {})
      // this.setState({isAskingPlayer:data.gameState.asker._id ===this.state.userId, isAnsweringPlayer:data.gameState.answerer._id ===this.state.userId, gameStarted:true, answeringPlayer:data.gameState.answerer, questionText:'', hasAskedQuestion: false, hasChosenPlayer: false});
      // console.log(this.state.isAskingPlayer)
    })

    socket.on("mode", (data) => {
      console.log(`set reveal mode to ${data.mode}`);
      this.setState({mode: data.mode});
    })
  }

  startGame= () => {
    post("/api/update", {gameCode:this.props.gameCode});
  }

    render() {
      return (
        <>
        <div className='Login'>
        {this.props.userId ? (
          <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.props.handleLogout}
            onFailure={() => console.log(`Failed to logout.`)}
          />
        ) : (
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={this.props.handleLogin}
            onFailure={(err) => console.log(err)}
          />
        )}
        </div>
        <PlayerList playerList={this.state.activePlayers}/>
        <h1>{this.state.codeText}</h1>
        <h2>{this.state.questionText}</h2>
        <h2>{this.state.chooseText}</h2>

        {!this.state.gameStarted ? (<Button type='submit' onClick={this.startGame} disabled={this.state.activePlayers.length <= 1 || !this.state.loggedIn || this.state.mode.length === 0}> {this.state.buttonText}</Button>):null}
        {this.state.isAskingPlayer ? (<NewQuestionInput isAskingPlayer={this.state.loggedIn && this.state.isAskingPlayer} answerer={this.state.answeringPlayer} disableQuestionSubmit={this.disableQuestionSubmit}/>):null}
        {this.state.isAnsweringPlayer ? (<PlayerButtonList isAnsweringPlayer={this.state.loggedIn && this.state.isAnsweringPlayer} playerList={this.state.activePlayers} hasChosenPlayer={this.state.hasChosenPlayer} userId={this.state.userId} disableButtonList={this.disableButtonList}/>):null}

        {(this.state.isRPSPlayer || this.state.isChosenPlayer) && this.state.mode==='rps' ? (<RockPaperScissors isChosenPlayer={this.state.loggedIn && this.state.isChosenPlayer} isRPSPlayer = {this.state.loggedIn && this.state.isRPSPlayer} disableRPS={this.disableRPS} gameCode={this.props.gameCode}/>):null}
        {(this.state.isRPSPlayer || this.state.isChosenPlayer) && this.state.mode==='fermi' ? (<FermiBlock isChosenPlayer={this.state.loggedIn && this.state.isChosenPlayer} isRPSPlayer = {this.state.loggedIn && this.state.isRPSPlayer} disableRPS={this.disableRPS} gameCode={this.props.gameCode} fermiText={this.state.fermiQuestion} answer={this.state.fermiAnswer}/>):null}
        <Chat userId={this.props.userId} gameCode={this.props.gameCode} name={this.state.currentPlayer.name}/>
        {(!this.state.gameStarted && this.state.loggedIn)? (<span>
          <Button type='submit' onClick={()=>{this.setMode('rps')}} disabled={this.state.mode==='rps'}>Classic Mode</Button>
          <Button type='submit' onClick={()=>{this.setMode('fermi')}} disabled={this.state.mode==='fermi'}>Fermi Mode</Button>
        </span>) : null}
          </>
      )
      }
    }

export default Game;