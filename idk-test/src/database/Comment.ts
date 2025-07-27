import User from "./User";
import {Deed} from "./GoodDeeds";

interface Comment {
    owner: User;
    post: Deed;
    time: number;
    text: string;
}

export default Comment;