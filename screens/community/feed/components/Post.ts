import User from "../common/User";
import Comment from "../common/Comment";
export interface PostProps {
  images: string[];
  likes: string[];
  comments: string[];
  owner: User;
}
export default class Post {
  private images: string[];
  private likes: User[];
  private comments: Comment[];
  private owner: User;
  constructor(props: PostProps) {
    this.images = props.images;
    //this.comments = props.comments;
    //this.likes = props.likes;
    this.owner = props.owner;
  }
  toggleLiked = (currentUserId: string) => {
    this.likes = this.likes.filter(
      (user: User) => user.userId !== currentUserId
    );
  };
  getImages = () => {
    return this.images;
  }
}
