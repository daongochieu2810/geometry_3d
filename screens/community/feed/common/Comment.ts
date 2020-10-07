import User from './User';
export interface CommentProps {
    ownerId: string;
    content: string;
}

export default class Comment {
    private owner : User;
    private content : string;
    constructor(props: CommentProps) {
        this.content = props.content;
    }
}
