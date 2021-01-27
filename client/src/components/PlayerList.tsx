import React, { Component } from "react";
import { Router } from "@reach/router";
import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
// import Skeleton from "./pages/Skeleton";
import { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { socket } from "../client-socket";
import User from "../../../shared/User";
//import PlayerBlock, {Player} from "./Player";
import PlayerBlock from "./Player";
import Player from "../../../shared/Player";
import "../utilities.css";
import "./PlayerList.css"



interface Props {
    playerList: Player[];
    // code: String; TODO: implement multiple rooms, not sure where
}

class PlayerList extends Component<Props>
{
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>  
                <div className="Players">
                    <h3>Current Players</h3>
                    {this.props.playerList.map((player, i) => (
                        <PlayerBlock
                            player={player}
                            key={i}
                        />
                    )
                    )}
                </div>
            </>
        )
    }
}
export default PlayerList;