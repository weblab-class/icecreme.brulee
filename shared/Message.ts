import Player from "./Player";

export interface Message {
    sender: Player;
    content: string;
}
export default Message;