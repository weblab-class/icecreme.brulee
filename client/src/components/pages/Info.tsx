import React, { Component } from "react";
import GoogleLogin, {  GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login';
import { RouteComponentProps } from "@reach/router";
import "../../utilities.css";
import "./Info.css";
import Login from "./Login";
import { Button } from 'antd';

const GOOGLE_CLIENT_ID = "1029457388024-o249v3ppd6up5tpigtvelkjsv3rgirj0.apps.googleusercontent.com";

type Props = {
    userId: String;
    handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
    handleLogout: () => void;
  }
  type State = {
    loggedIn: boolean;
  }

  
  class Info extends Component<Props & RouteComponentProps, State> {
    constructor(props){
      super(props);
    }
      render() {
        return (
          <>

          <div className="Rules">
              <h2>Welcome to icecreme.brulee! </h2>
          </div>



            <Button> Back </Button>




            )
            </>
        )
        }
      }
  
  export default Info;