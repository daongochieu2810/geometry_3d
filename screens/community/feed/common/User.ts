export interface UserProps {
    userId: string;
    name: string;
    email: string;
}

export default class User {
    public userId: string;
    private name : string;
    private email : string;
    constructor(props: UserProps) {
        this.userId = props.userId;
        this.name = props.name;
        this.email = props.email;
    }
}
