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
          <div className = "Body">
            <div className="rectangle" />

            <div className="Rules">
                <h2>Hi {this.props.player.name}, welcome to icecreme.brulee! The rules are as follows: 

                Everyone will input their names and gather around in a (virtual) circle.
                The person starting the round will secretly ask his/her neighbor a question starting with "Who". (i.e. "Who is the most likely to die first in a zombie apocalypse?".
                The person being asked will pick a person among the other friends.
                The pair described above will rock paper scissors: If the person who answered the question wins, the question will not be revealed. If the person who was chosen wins, the question is revealed to everyone.
                The turn continues, the person who was previously asked a question will ask his/her neighbor, and so forth. '''
                
                </h2>
                <Button onClick = {this.goToSetup}> Back </Button>
            </div>
          </div>


          <style>{'body { background-color: #FED8D8; }'}</style>

            </>
        )
        }
      }
  
  export default Info;