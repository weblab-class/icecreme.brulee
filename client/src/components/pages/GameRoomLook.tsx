import React, { Component } from 'react';
import "./Game.css";
import { RouteComponentProps } from "@reach/router";

class GameRoomLook extends Component<RouteComponentProps> {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className = "gameContainer">
                <div className = "gameDisplay">
                    <div className = "gameDisplayHeader"></div>
                    <div className = "gameDisplayPlay"></div>
                </div>
                <div className = "gameSidebar">
                    <div className = "gameSidebarChat"></div>
                </div>
            </div>
        )
    }
}

export default GameRoomLook;