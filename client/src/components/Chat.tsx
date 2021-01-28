import React, { Component } from "react";
import SingleMessage from "./SingleMessage";
import { NewMessage } from "./NewTextInput";

import "./Chat.css";
import { Message } from "../../../shared/Message";
import User from "../../../shared/User";
import { get } from "../utilities";
import { socket } from "../client-socket";
// import { ChatData } from "../pages/Chatbook";
export interface ChatData {
    messages: Message[];
  }
/**
 * Renders main chat window including previous messages,
 * who is being chatted with, and the new message input.
 */

interface Props {
  gameCode: string;
  userId: String;
  name: String;
}

interface State {
    data: ChatData;
}

class Chat extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
        data: {messages: []}
    }
  }
  loadMessageHistory(gameCode: string) {
    get("/api/chat", { gameCode: gameCode}).then((messages: Message[]) => {
      this.setState({
        data: {
          messages: messages.slice(Math.max(0, messages.length - 5)),
        },
      });
    });
  }
  componentDidMount() {
    this.loadMessageHistory(this.props.gameCode);

    socket.on("message", (data) => {
        if (data.gameCode === this.props.gameCode) {
          this.setState((prevstate) => ({
            data: {
              messages: prevstate.data.messages.concat(data).slice(Math.max(0, prevstate.data.messages.length - 4)),
            },
          }));
        }
      });
  }
  render() {
    return (
      <div className="Chat-container">
        <div className="Chat-historyContainer">
          {this.state.data.messages.map((m, i) => (
            <SingleMessage message={m} key={i} />
          ))}
        </div>
        <div className="Chat-newContainer">
          <NewMessage gameCode={this.props.gameCode} name={this.props.name}/>
        </div>
      </div>
    );
  }
}

export default Chat;