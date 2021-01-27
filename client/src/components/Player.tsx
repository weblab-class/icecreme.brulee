import React, { Component } from "react";
import "../utilities.css";
import Player from "../../../shared/Player";
import './Player.css';


// export interface Player {
//     _id: String;
//     name: String;
// }

interface Props {
    player: Player
}
class PlayerBlock extends Component<Props> {
    constructor(props) {
        super(props);
    }
    render() {
        let color:string = (String(this.props.player.color));
        console.log(color)
        return (
            <div className = "circle" style={{background: color}}>
                {this.props.player.name}
            </div>
        )
    }
}

export default PlayerBlock;
/*
class Player extends Component{
    constructor(props) = {
        super(props);
        this.props = {
            name: 
        }
    }
}*/