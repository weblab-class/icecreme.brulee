import React, { Component } from 'react';
import { RouteComponentProps } from "@reach/router";
import GoogleLogin, {  GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login';
import "./Skeleton.css";
//TODO(weblab student): REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "1029457388024-o249v3ppd6up5tpigtvelkjsv3rgirj0.apps.googleusercontent.com";

type Props = {
  userId: String;
  handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  handleLogout: () => void;
}
type State = {
  loggedIn: boolean;
}
class Skeleton extends Component<Props & RouteComponentProps, State> {
  render() {
    return (
      <>
        <div className='Logo'>
          <img src={'logo.jpg'} />
        </div>

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
              buttonText="Log in with Google"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
            />
          )}
        </div>
        
        <style>{'body { background-color: #FFE7C2; }'}</style>
        <h1>Icecreme brulee</h1>
      </>
    )
  }
}

export default Skeleton;