import React, { Component } from "react";
import { Router } from "@reach/router";
import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
import Skeleton from "./pages/Skeleton";
import { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { socket } from "../client-socket";
import User from "../../../shared/User";
//import PlayerBlock, {Player} from "./Player";
import PlayerBlock from "./Player";
import Player from "../../../shared/Player";
import "../utilities.css";



interface Props {
    playerList: Player[];
    // code: String; TODO: implement multiple rooms, not sure where
}
interface State {
    chosenPlayer: Player;
}

class PlayerButtonList extends Component<Props, State>
{
    constructor(props) {
        super(props)
        this.state = {
            chosenPlayer: {name:'', _id: ''},
        }
    }

    resetPlayer = () =>{
        this.setState({chosenPlayer: {name:'', _id: ''}});
    }

    render() {
        return (
            <>
                {this.state.chosenPlayer._id.length === 0 ? <h3>Choose a player...</h3>:<h3>{`Chose ${this.state.chosenPlayer.name}`}</h3>}
                {this.props.playerList.map((player, i) => (
                    <>
                        <button 
                            type='button'
                            onClick = {() => {
                                this.setState({chosenPlayer:player});
                            }}
                        >   
                        </button>
                        <PlayerBlock
                            player={player}
                            key={i}
                        />
                    </>
                )
                )
                }
                <button type='reset' onClick={this.resetPlayer}>
                    Reset player
                </button>
            </>
        )
    }
}
export default PlayerButtonList;