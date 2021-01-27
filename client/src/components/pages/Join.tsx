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


class Join extends Component<Props & RouteComponentProps, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
            <div className = "rectangle1" />
            <h2 id="title">Create / Join Game</h2>
            <div className = "rectangle2" />
            <div className = "Join">
                <h2>Join game</h2>
                <NewCodeInput setCode={this.props.setCode}/>
            </div>
                
            </>
        )
    }

}

export default Join;