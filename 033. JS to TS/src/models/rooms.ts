import {Schema, Types, model} from "mongoose";
export interface RoomTypes {
    participants: [Types.ObjectId];
    messages: [Types.ObjectId];
    marked: boolean;
    countUnRead: number;
}
const RoomSchema = new Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'chats'
        }
    ],
    marked: {
        type: Boolean,
        require: true
    },
    countUnRead: {
        type: Number,
        require: true
    }
}, {timestamps: true})

const Room = model<RoomTypes>('rooms', RoomSchema);
export default Room;