import {Schema, Types, model} from "mongoose";

export interface ChatTypes {
    message: string;
    url: string;
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
}

const ChatSchema = new Schema({
    message: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: false
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, {timestamps: true})

const Chat = model<ChatTypes>('chats', ChatSchema);
export default Chat;