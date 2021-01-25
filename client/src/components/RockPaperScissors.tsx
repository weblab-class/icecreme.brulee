import React, { Component } from "react";
import "../utilities.css";
import Player from "../../../shared/Player";
import './Player.css';
import './RockPaperScissors.css'
import { Button, Icon } from 'semantic-ui-react';
import CircleButton from "./CircleButton";
import { post } from "../utilities";

//const ButtonExampleCircular = () => <Button circular icon='settings' />


interface Props {
    isAnsweringPlayer: boolean;
    isChosenPlayer: boolean;
}

interface State {
    choice: "rock" | "paper" | "scissors";
}

class RockPaperScissors extends Component<Props, State> {
    constructor(props) {
        super(props);
    }

    // handleClick = (choice) => {
    //     //const rps = {rpsChoice: this.props.text};
    //     post('/api/rps', choice)
    // }

    render() {
        //const CircularButton = (icon: string) => <Button circular icon= {icon} className = "circularButton"/>

        return (
            <div className = "RPS-container">
                <h2>rock, paper, scissors</h2> 
                {(this.props.isAnsweringPlayer || this.props.isChosenPlayer) ? (<>
                
                <CircleButton color = "teal" text = "rock" icon = "hand rock"></CircleButton>
                <CircleButton color = "teal" text = "paper" icon = "hand paper"></CircleButton>
                <CircleButton color = "teal" text = "scissors" icon = "hand scissors"></CircleButton>
                </>): ""}
            </div>
        )
    }
}

export default RockPaperScissors;