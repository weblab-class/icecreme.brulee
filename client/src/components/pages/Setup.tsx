import React, { Component } from 'react';
import { RouteComponentProps } from "@reach/router";
import GoogleLogin, {  GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login';
import "./Setup.css";
import { IroColorPicker } from '@jaames/iro/dist/ColorPicker';
const GOOGLE_CLIENT_ID = "1029457388024-o249v3ppd6up5tpigtvelkjsv3rgirj0.apps.googleusercontent.com";
//const iro = require('@jaames/iro');
import { TwitterPicker, PhotoshopPicker } from 'react-color';
import { Button, Input, Grid} from 'semantic-ui-react'
import { post } from '../../utilities';
import { navigate } from "@reach/router";
import Player from "../../../../shared/Player";

interface Props {
  player: Player
}

// type Props = {
//   userId: String;
//   handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
//   handleLogout: () => void;
// }

type State = {
  color: string;
  name: string;
}
class Setup extends Component<Props & RouteComponentProps, State> {
  constructor(props){
    super(props);
    this.state = {
        color: "#0000ff",
        name: "",
    }
  }

  onChangeColor = (color, event) => {
      console.log(color.hex)
      this.setState({color: color.hex})
  }
  handleSubmit = (event) => {
      const player = {name: this.state.name, color: this.state.color}
      console.log("new player attributes: " + player)
      post('/api/playerUpdate', player)
  }
  
  goToInfo = () => {
    navigate("/info")
  }

  nameChange = (event) => {
      this.setState({name: event.target.value})
  }

  render() {
    // let colorPicker = new iro.ColorPicker("#picker", {
    //     // Set the size of the color picker
    //     width: 320,
    //     // Set the initial color to pure red
    //     color: "#ffffff"
    //   });

    return (
      <div className = "setupContainer">
          <input placeholder='Name' className = "center setupInput" onChange = {this.nameChange}></input>
                    <div className = "newCircle center" style={{background:this.state.color}}>{this.state.name}</div>
                    <TwitterPicker  className = "center" color={ this.state.color }
                        onChangeComplete={ this.onChangeColor}
                        //onSwatchHover = {this.onChangeColor}
                    ></TwitterPicker>

                <button className = "center setupButton" onClick = {this.handleSubmit}>Submit</button>
        {/* I think below are old code */}
      {/* <div>
          <Input placeholder='Name' />
      </div>

      <div className = "newCircle" style={{background:this.state.color}}>{this.props.player.name}</div>

      <div className = "palette">
          <TwitterPicker color={ this.state.color }
            onChangeComplete={ this.onChangeColor}
            onSwatchHover = {this.onChangeColor}></TwitterPicker>

            <Button onClick = {this.handleSubmit}>Submit</Button>

            <Button onClick = {this.goToInfo}>Game Info</Button>
      </div> */}
    </div>
    )
  }
}

export default Setup;