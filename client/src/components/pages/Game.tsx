/*TODO*/
import React, { Component } from 'react';
import "./Game.css";
import { RouteComponentProps } from "@reach/router";
import GoogleLogin, {  GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login';
const GOOGLE_CLIENT_ID = "1029457388024-o249v3ppd6up5tpigtvelkjsv3rgirj0.apps.googleusercontent.com";

type Props = {
  userId: String;
  handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  handleLogout: () => void;
}
type State = {
  loggedIn: boolean;
}

class Game extends Component<Props & RouteComponentProps, State> {
  constructor(props){
    super(props);
  }
    render() {
      return (
        <>
          <h1> HELLO </h1>

        <div className='Login'>
        {this.props.userId ? (
          <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.props.handleLogout}
            onFailure={() => console.log(`Failed to logout.`)}
          />
        ) : (
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={this.props.handleLogin}
            onFailure={(err) => console.log(err)}
          />
        )}
        </div>
          )
          </>
      )
      }
    }

export default Game;