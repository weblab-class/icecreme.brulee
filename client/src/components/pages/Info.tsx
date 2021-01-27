import React, { Component } from "react";
import GoogleLogin, {  GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login';
import { RouteComponentProps } from "@reach/router";
import "../../utilities.css";
import "./Info.css";
import Login from "./Login";
import { Button, Input } from 'semantic-ui-react';
import { navigate } from "@reach/router";
import Setup from "./Setup"
import Player from "../../../../shared/Player";

const GOOGLE_CLIENT_ID = "1029457388024-o249v3ppd6up5tpigtvelkjsv3rgirj0.apps.googleusercontent.com";
interface Props {
    player: Player
}

  type State = {
    loggedIn: boolean;
  }

  
  class Info extends Component<Props & RouteComponentProps, State> {
    constructor(props){
      super(props);
    }
    goToSetup = () => {
        navigate("/setup")
    }
    
      render() {
        return (
          <>
          <div id = "greeting">
            <h2> Welcome {this.props.player.name}! </h2>
          </div>
          <div className="rectangle">

          <div className="Title">
              {/* <h2>Rules</h2> */}
          </div>


          <div className = "Rules">
            <h4>icecreme.brulee is a fun game to play to get to know your friends better! ask deep questions, vote on memes, and much more... </h4> 
            <ul>
              <li>
                Everyone will input their names and gather around in a (virtual) circle.

              </li>

              <li>
                The person starting the round will secretly ask his/her neighbor a question starting with "Who". (i.e. "Who is the most likely to die first in a zombie apocalypse?)"

              </li>

              <li>
                The person being asked will pick a person among the other friends.

              </li>

              <li>
              The pair described above will play rock paper scissors: If the person who asked the question wins, the question will not be revealed. If the person who was chosen wins, the question is revealed to everyone.
                The turn continues, the person who was previously asked a question will ask his/her neighbor, and so forth.
              </li>
            </ul>
            
          </div>
          

          <div className="Button">
            <Button onClick = {this.goToSetup}> Back </Button>
          </div>

          </div>

          <img className = 'Icecreme1' src="https://i.imgur.com/kdi2Sel.png" title="source: imgur.com" width="100"/>

          <img className = 'Icecreme2' src="https://i.imgur.com/jokyLks.png" title="source: imgur.com" width="120"/>

          <img className = 'Icecreme3' src="https://i.imgur.com/Pmwanzs.png" title="source: imgur.com" width="80"/>

          <img className = 'Icecreme4' src="https://i.imgur.com/kdi2Sel.png" title="source: imgur.com" width="100"/>


          <style>{'body { background-color: #fff; }'}</style>

            </>
        )
        }
      }
  
  export default Info;