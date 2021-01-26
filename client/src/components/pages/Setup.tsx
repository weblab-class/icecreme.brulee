import React, { Component } from 'react';
import { RouteComponentProps } from "@reach/router";
import GoogleLogin, {  GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login';
import "./Setup.css";
import { IroColorPicker } from '@jaames/iro/dist/ColorPicker';
const GOOGLE_CLIENT_ID = "1029457388024-o249v3ppd6up5tpigtvelkjsv3rgirj0.apps.googleusercontent.com";
//const iro = require('@jaames/iro');
import { TwitterPicker, PhotoshopPicker } from 'react-color';
import { Button, Input } from 'semantic-ui-react'
import { navigate } from "@reach/router";



type Props = {
  userId: String;
  handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  handleLogout: () => void;
}

type State = {
  color: string;
}
class Setup extends Component<Props & RouteComponentProps, State> {
  constructor(props){
    super(props);
    this.state = {
        color: "#0000ff",
    }
  }
  onChangeColor = (color, event) => {
      console.log(color.hex)
      this.setState({color: color.hex})
  }
  handleSubmit = () => {

  }

  
  goToInfo = () => {
    navigate("/info")
  }
//    componentDidMount() {

//     colorPicker.on('color:change', function(color) {
//         // log the current color as a HEX string
//         this.setState({color: color.hexString})
//       });
//   }

  render() {
    // let colorPicker = new iro.ColorPicker("#picker", {
    //     // Set the size of the color picker
    //     width: 320,
    //     // Set the initial color to pure red
    //     color: "#ffffff"
    //   });

    return (
      <div>
          <Input placeholder='Name' />
          <div className = "newCircle" style={{background:this.state.color}}>Hello</div>
          <TwitterPicker color={ this.state.color }
            onChangeComplete={ this.onChangeColor}
            onSwatchHover = {this.onChangeColor}></TwitterPicker>

            <Button onClick = {this.handleSubmit}>Submit</Button>

            <Button onClick = {this.goToInfo}>Game Info</Button>
      </div>
    )
  }
}

export default Setup;