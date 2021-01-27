import React, { Component } from "react";
import "../utilities.css";
import Player from "../../../shared/Player";
import './Player.css';
import './RockPaperScissors.css'
import { Button, Icon, SemanticICONS } from 'semantic-ui-react';
import { SemanticSIZES } from "semantic-ui-react/dist/commonjs/generic";
import { post } from "../utilities";

//text to display on button
//color of button: default = teal
//icon if one is passed
//size of button: default = massive
interface Props {
    text?: string;
    color?: "facebook" | "google plus" | "instagram" | "linkedin" | "twitter" | "vk" | "youtube" | "red" | "orange" | "yellow" | "olive" | "green" | "teal" | "blue" | "violet" | "purple" | "pink" | "brown" | "grey" | "black";
    icon?: SemanticICONS;
    size?: SemanticSIZES;
    disableRPS: () => void;
    gameCode: string;
    //onClick?: function;
}

class CircleButton extends Component<Props> {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        const rps = {rpsChoice: this.props.text, gameCode:this.props.gameCode};
        this.props.disableRPS();
        post('/api/rps', rps);
    }

    render() {
       let button;
        if (this.props.icon) {
            button = <Button circular color = {this.props.color || "teal"}
                        size = {this.props.size || "massive"} className = "circleButton"
                        onClick = {this.handleClick}>
                        <Icon name = {this.props.icon}></Icon>
                        <p>{this.props.text}</p>
                    </Button>
        } else {
            button = <Button circular color = {this.props.color || "teal"}
                        size = {this.props.size || "massive"} className = "circleButton"
                        onClick = {this.handleClick}>
                        <p>{this.props.text}</p>
                    </Button>
          }
        return (
                button
        )
    }
}

export default CircleButton;