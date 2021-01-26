import React, { Component } from "react";
import GoogleLogin, {  GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login';
import { RouteComponentProps } from "@reach/router";
import "../../utilities.css";
import "./Skeleton.css";
import Login from "./Login";
import Game from "./Game";
import Setup from "./Setup"
const GOOGLE_CLIENT_ID = "1029457388024-o249v3ppd6up5tpigtvelkjsv3rgirj0.apps.googleusercontent.com";

type Props = {
  userId: String;
  handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  handleLogout: () => void;
}

class Skeleton extends Component<Props & RouteComponentProps> {
  constructor(props) {
    super(props);
    // Initialize Default State
      }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return <>{this.props.userId ? <Setup userId={this.props.userId} handleLogin={this.props.handleLogin} handleLogout={this.props.handleLogout}/> : <Login userId={this.props.userId} handleLogin={this.props.handleLogin} handleLogout={this.props.handleLogout}
    />}</>;
  }
}
export default Skeleton;