export default class UniCameraHandler {
  constructor(camera) {
    this.camera = camera;
    //this.mesh = mesh;

    this.PI_HALF = Math.PI / 2;
    this.distance = 10;
    this.distanceTarget = 10;
    this.prevDist = 0;
    this.camera.position.z = this.distance;
    this.currentCenter = { x: 0, y: 0, z: 0 };
    this.sensitivity = 1;

    this.mouse = { x: 0, y: 0 };
    this.touch = { x: 0, y: 0 };

    this.mouseOnDown = { x: 0, y: 0 };
    this.rotation = { x: 0, y: 0 };

    this.target = { x: (Math.PI * 3) / 2, y: Math.PI / 6.0 };
    this.targetOnDown = { x: 0, y: 0 };
  }

  handlePanResponderGrant = (event) => {
    this.mousedown = true;

    this.touch.x = (event.pageX / window.innerWidth) * 2 - 1;
    this.touch.y = -(event.pageY / window.innerHeight) * 2 + 1;

    this.mouseOnDown.x = -event.pageX;
    this.mouseOnDown.y = event.pageY;

    this.targetOnDown.x = this.target.x;
    this.targetOnDown.y = this.target.y;
  };
  handlePanResponderMove = (event, gestureState) => {
    //if(this.mousedown){
    this.mouse.x = -event.pageX;
    this.mouse.y = event.pageY;

    //var zoomDamp = (this.distance * this.distance) / 100000;
    const touches = event.touches;
    if (touches.length >= 2) {
      const distance = Math.sqrt(
        Math.pow(touches[0].locationX - touches[1].locationX, 2) +
          Math.pow(touches[0].locationY - touches[1].locationY, 2)
      );
      var actualDist = distance / 5;
      if (this.prevDist == 0) this.prevDist = actualDist;
      else {
        this.zoom(actualDist - this.prevDist);
      }
      this.prevDist = actualDist;
    } else {
      this.target.x =
        this.targetOnDown.x +
        (this.mouse.x - this.mouseOnDown.x) / (100 / this.sensitivity);
      this.target.y =
        this.targetOnDown.y +
        (this.mouse.y - this.mouseOnDown.y) / (100 / this.sensitivity);
      this.target.y =
        this.target.y > this.PI_HALF ? this.PI_HALF : this.target.y;
      this.target.y =
        this.target.y < -this.PI_HALF ? -this.PI_HALF : this.target.y;
    }
  };

  handlePanResponderEnd = (event) => {
    this.prevDist = 0;
    this.mousedown = false;
  };

  setCenter = (center) => {
    this.currentCenter = center;
  };
  setSensitivity = (num) => {
    this.sensitivity = num;
  };

  zoom = (delta) => {
    const zoomMin = 2;
    const zoomMax = 200;

    this.distanceTarget -= delta;
    this.distanceTarget =
      this.distanceTarget > zoomMax ? zoomMax : this.distanceTarget;
    this.distanceTarget =
      this.distanceTarget < zoomMin ? zoomMin : this.distanceTarget;
  };

  render(listOfObject) {
    this.rotation.x += (this.target.x - this.rotation.x) * 0.1;
    this.rotation.y += (this.target.y - this.rotation.y) * 0.1;

    this.distance += (this.distanceTarget - this.distance) * 0.3;

    this.camera.position.x =
      this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y);
    this.camera.position.y = this.distance * Math.sin(this.rotation.y);
    this.camera.position.z =
      this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y);
    this.camera.lookAt(
      this.currentCenter.x,
      this.currentCenter.y,
      this.currentCenter.z
    );
    for (let index in listOfObject) {
      let verticeObject = listOfObject[index];
      const text = verticeObject.text;
      //const line = verticeObject.line;
      text.quaternion.copy(this.camera.quaternion);
      //line.quaternion.copy(this.camera.quaternion);
    }
  }
}
