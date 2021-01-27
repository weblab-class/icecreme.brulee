import React, { Component } from "react";
import GoogleLogin, {  GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login';
import { RouteComponentProps } from "@reach/router";
import "../../utilities.css";
import "./Join.css"
import Login from "./Login";
import { Button, Input } from 'semantic-ui-react';
import { navigate } from "@reach/router";
import Setup from "./Setup"
import Player from "../../../../shared/Player";
import {NewCodeInput, NewQuestionInput} from "../NewTextInput"


const GOOGLE_CLIENT_ID = "1029457388024-o249v3ppd6up5tpigtvelkjsv3rgirj0.apps.googleusercontent.com";

interface Props {
    setCode: (string) => void;
}

interface State {
    hasJoinedGame: boolean;
}

class Join extends Component<Props & RouteComponentProps, State> {
    constructor(props) {
        super(props);
        this.state = {
            hasJoinedGame: true
        }
    }

    getRandomNumber = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    generateCode = () => {
        let newCode:string = '';
        for (let i = 0; i < 4; i++) {
            let char: string = String.fromCharCode(this.getRandomNumber(65, 91));
            newCode+=char;
        }
        return newCode;
    }

    joinGame = (code: string) => {
        this.props.setCode(code);
        this.setState({hasJoinedGame:true});
    }

    render() {
        return (
            <>
            <div className = "rectangle1">
                <h2 id="title">Create / Join Game</h2>
            </div>
            <div className = "rectangle2">
                <div className = "circle1" onClick={()=>{this.props.setCode(this.generateCode())}}>
                    <div className = "Create" >
                        <h2 id="jointxt">Create game</h2>
                    </div>
                </div>

                <div className = "circle2" onClick={()=>{this.setState({hasJoinedGame:false})}}>
                    <div className = "Join">
                        <h2 id="jointxt">Join game</h2>
                    </div>
                </div>
            {!this.state.hasJoinedGame ? (<div className = "Submit">
                <NewCodeInput setCode={this.joinGame}/>
            </div>):null}

            </div>
            </>
        )
    }

}

export default Join;