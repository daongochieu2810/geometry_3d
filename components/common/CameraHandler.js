export default class CameraHandler {
  constructor(container, camera, mesh, lines, axesHelper) {
    this.camera = camera;
    this.mesh = mesh;
    this.container = container;
    this.lines = lines;
    this.distance = 300;
    this.distanceTarget = 300;
    this.prevDist = 0;
    this.camera.position.z = 300; //this.distance;
    this.axesHelper = axesHelper;
    this.mouse = { x: 0, y: 0 };
    this.touch = { x: 0, y: 0 };

    this.mouseOnDown = { x: 0, y: 0 };
    this.rotation = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.targetOnDown = { x: 0, y: 0 };

    //  this.container.addEventListener('mousedown', this.onMouseDown, false);
    //  this.container.addEventListener('mousewheel', this.onMouseWheel, false);
    //   this.container.addEventListener('mousemove', this.onTouchMove, false);
  }

  handlePanResponderGrant = (event) => {
    this.mousedown = true;

    this.touch.x = (event.pageX / window.innerWidth) * 2 - 1;
    this.touch.y = -(event.pageY / window.innerHeight) * 2 + 1;

    //console.log(this.mouse.x + "," + this.mouse.y);

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
    if (touches.length == 2) {
      const distance = Math.sqrt(
        Math.pow(touches[0].locationX - touches[1].locationX, 2) +
          Math.pow(touches[0].locationY - touches[1].locationY, 2)
      );
      if (this.prevDist == 0) this.prevDist = distance;
      //if(distance > this.prevDist) {
      //console.log(gestureState)
      //if (gestureState.dx + gestureState.dy > 5 && gestureState.dx && gestureState.dy) {
      if (gestureState.vy * gestureState.vx != 0)
        this.camera.position.z -= (distance - this.prevDist) / 10;
      //} else {
      //  this.camera.position.z += this.pr
      //}
      this.prevDist = distance;
      //}
    } else {
      this.target.x =
        this.targetOnDown.x + (this.mouse.x - this.mouseOnDown.x) * 0.003; //* zoomDamp;
      this.target.y =
        this.targetOnDown.y + (this.mouse.y - this.mouseOnDown.y) * 0.003; //* zoomDamp;
    }

    //console.log(this.target.x + ", " + this.target.y);
    //this.target.y = this.target.y > this.PI_HALF ? this.PI_HALF : this.target.y;
    //this.target.y =
    //this.target.y < -this.PI_HALF ? -this.PI_HALF : this.target.y;
    // }
  };

  handlePanResponderEnd = (event) => {
    //  this.container.removeEventListener('mousemove', this.onMouseMove, false);
    //  this.container.removeEventListener('mouseup', this.onMouseUp, false);
    //  this.container.removeEventListener('mouseout', this.onMouseOut, false);
    this.target.x = 0;
    this.target.y = 0;
    this.prevDist = 0;
    this.mousedown = false;

    // this.container.style.cursor = 'auto';
  };

  onMouseDown = (event) => {
    event.preventDefault();

    //   this.container.addEventListener('mousemove', this.onMouseMove, false);
    //  this.container.addEventListener('mouseup', this.onMouseUp, false);
    //  this.container.addEventListener('mouseout', this.onMouseOut, false);

    this.mousedown = true;
    this.mouseOnDown.x = -event.clientX;
    this.mouseOnDown.y = event.clientY;

    this.targetOnDown.x = this.target.x;
    this.targetOnDown.y = this.target.y;
    this.target.x = 0;
    this.target.y = 0;
    //this.container.style.cursor = 'move';
  };

  onMouseMove = (event) => {
    //if(this.mousedown){
    this.mouse.x = -event.clientX;
    this.mouse.y = event.clientY;

    var zoomDamp = this.distance / 1000;

    this.target.x =
      this.targetOnDown.x + (this.mouse.x - this.mouseOnDown.x) * 0.005; //* zoomDamp;
    this.target.y =
      this.targetOnDown.y + (this.mouse.y - this.mouseOnDown.y) * 0.005; //* zoomDamp;

    // this.target.y = this.target.y > this.PI_HALF ? this.PI_HALF : this.target.y;
    // this.target.y =
    // this.target.y < -this.PI_HALF ? -this.PI_HALF : this.target.y;
    // }
  };

  onMouseUp = (event) => {
    //  this.container.removeEventListener('mousemove', this.onMouseMove, false);
    //  this.container.removeEventListener('mouseup', this.onMouseUp, false);
    //  this.container.removeEventListener('mouseout', this.onMouseOut, false);
    this.target.x = 0;
    this.target.y = 0;
    this.mousedown = false;

    // this.container.style.cursor = 'auto';
  };

  onMouseOut = (event) => {
    //  this.container.removeEventListener('mousemove', this.onMouseMove, false);
    //   this.container.removeEventListener('mouseup', this.onMouseUp, false);
    //   this.container.removeEventListener('mouseout', this.onMouseOut, false);
    this.target.x = 0;
    this.target.y = 0;
    this.mousedown = false;
  };

  onZoomEvent = (event) => {
    this.zoom(Math.log(event.scale) * 2);
    return false;
  };

  onMouseWheel = (event) => {
    event.preventDefault();
    //if (overRenderer) {
    //this.zoom(event.wheelDeltaY * 0.1);
    //}
    return false;
  };

  onSingleTap = (event) => {
    const x = event.pageX;
    const y = event.pageY;

    this.mouse.x = (x / window.innerWidth) * 2 - 1;
    this.mouse.y = -(y / window.innerHeight) * 2 + 1;
  };

  onDoubleTap = () => {
    if (this.distanceTarget > 150) {
      // console.log(this.distanceTarget);
      this.distanceTarget = 120;
    } else if (this.distanceTarget <= 150) this.distanceTarget = 300;
  };

  zoom = (delta) => {
    this.camera.position.z += delta;
  };

  render(listOfVertices) {
    this.rotation.x += (this.target.x - this.rotation.x) * 0.1;
    this.rotation.y += (this.target.y - this.rotation.y) * 0.1;
    this.distance += (this.distanceTarget - this.distance) * 0.3;

    //this.camera.position.x += this.target.x
    //this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y);
    //this.camera.position.y += this.target.y//this.distance * Math.sin(this.rotation.y);
    //this.camera.position.z =
    //this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y);

    //this.camera.lookAt(this.mesh.position);

    //if (this.distance > 0)
    //console.log(this.mesh.rotation);
    if (Math.floor(Math.abs(this.mesh.rotation.x) / 3) % 2 == 0) {
      this.mesh.rotation.y -= this.target.x / 10;
      this.lines.rotation.y -= this.target.x / 10;
      this.axesHelper.rotation.y -= this.target.x / 10;
    } else {
      this.mesh.rotation.y += this.target.x / 10;
      this.lines.rotation.y += this.target.x / 10;
      this.axesHelper.rotation.y += this.target.x / 10;
    }
    this.mesh.rotation.x += this.target.y / 10;
    this.lines.rotation.x += this.target.y / 10;
    this.axesHelper.rotation.x += this.target.y / 10;

    this.mesh.updateMatrix();
    this.mesh.geometry.applyMatrix4(this.mesh.matrix);
    this.mesh.matrix.identity();

    this.lines.updateMatrix();
    this.lines.geometry.applyMatrix4(this.lines.matrix);
    this.lines.matrix.identity();

    this.axesHelper.updateMatrix();
    this.axesHelper.geometry.applyMatrix4(this.axesHelper.matrix);
    this.axesHelper.matrix.identity();
    //this.mesh.position.set(0, 0, 0);
    this.mesh.rotation.set(0, 0, 0);
    //this.lines.position.set(0, 0, 0);
    this.lines.rotation.set(0, 0, 0);
    this.axesHelper.rotation.set(0, 0, 0);
    //mesh.scale.set( 1, 1, 1 );
    //if(this.target.y * this.target.x !=0  ) console.log("mesh rot : " + this.mesh.rotation.x + ", " + this.mesh.rotation.y +" with " + this.target.x +", " +this.target.y)

    var listOfCurrVertices = [];
    let positions = this.mesh.geometry.attributes.position.array;
    let ptCount = positions.length / 3;

    //console.log("ptCount is " + positions.length)
    for (let i = 0; i < ptCount; i++) {
      listOfCurrVertices.push(
        new THREE.Vector3(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        )
      );
    }
    //console.log(listOfCurrVertices.length)
    for (let index in listOfVertices) {
      let verticeObject = listOfVertices[index];
      let currentVertex = listOfCurrVertices[index];
      const text = verticeObject.text;
      const line = verticeObject.line;
      text.position.x = currentVertex.x;
      text.position.y = currentVertex.y;
      text.position.z = currentVertex.z;
      line.position.set(currentVertex.x, currentVertex.y, currentVertex.z);
    }
  }
}
