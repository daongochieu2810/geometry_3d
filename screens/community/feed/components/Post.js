export default class Post {
  constructor(props) {
    this.postData = props;
    this.isLiked = false;
  }
  test = () => {
    console.log(this.data);
  };
}
