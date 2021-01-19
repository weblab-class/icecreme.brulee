import React, { Component } from 'react';
import { RouteComponentProps } from "@reach/router";
import GoogleLogin, {  GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login';
import "./Login.css";
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
class Login extends Component<Props & RouteComponentProps, State> {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <>
        <div className='Logo'>
          <a className = 'Logo' href="https://imgur.com/MRIeTqc"><img className = 'Logo' src="https://i.imgur.com/MRIeTqc.jpg" title="source: imgur.com" width="1000"/></a>
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
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
            />
          )}
        </div>
        
        <style>{'body { background-color: #FFF; }'}</style>
      </>
    )
  }
}

export default Login;