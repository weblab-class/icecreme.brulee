import React, { Component } from "react";
import { Router } from "@reach/router";
import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
import Skeleton from "./pages/Skeleton";
import { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { socket } from "../client-socket";
import User from "../../../shared/User";
import "../utilities.css";
import Player from "../../../shared/Player";
import PlayerBlock from "./Player";

// Based on NewPostInput from Catbook

interface NewTextInputProps {
    defaultText: string;
    onSubmit: (value: string) => void;
}

interface NewTextInputState {
    value: string;
}

class NewTextInput extends Component<NewTextInputProps, NewTextInputState>{
    constructor(props) {
        super(props)

        this.state = {
            value: ""
        }
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
          value: event.target.value,
        });
      };
    
    handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      this.props.onSubmit && this.props.onSubmit(this.state.value);
      this.setState({
        value: "",
      });
    };

    render() {
        return (
            <div>
                <input
                    type="text"
                    placeholder={this.props.defaultText}
                    value={this.state.value}
                    onChange={this.handleChange}
                    className="NewPostInput-input"
                />
                <button
                    type="submit"
                    className="NewPostInput-button u-pointer"
                    value="Submit"
                    onClick={this.handleSubmit}
                >
                    Submit
                </button>
            </div>
        );
    }
}

interface NewQuestionInputProps {
    //code :
    isAskingPlayer: boolean;
    answerer: Player;
}

class NewQuestionInput extends Component<NewQuestionInputProps>{
    constructor(props){
        super(props)
    }
    askQuestion = (questionText:string) => {
        const questionBody = {answerer: this.props.answerer, questionText: questionText};
        post("/api/question", questionBody)
    }
    render() {
        return this.props.isAskingPlayer ? (<NewTextInput defaultText={`Ask a question to ${this.props.answerer.name}`} onSubmit={this.askQuestion}/>): null;
    }
}

export default NewQuestionInput;