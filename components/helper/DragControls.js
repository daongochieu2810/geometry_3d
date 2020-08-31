import { Matrix4, Plane, Raycaster, Vector2, Vector3 } from "three";

export default class DragControls {
  constructor(_objects, _camera) {
    this._objects = _objects;
    this._camera = _camera;
    this._plane = new Plane();
    this._raycaster = new Raycaster();

    _mouse = new Vector2();
    this._offset = new Vector3();
    this._intersection = new Vector3();
    this._worldPosition = new Vector3();
    this._inverseMatrix = new Matrix4();
    this._intersections = [];

    this._selected = null;
  }

  getWrapper(selected) {
    for(let object of this._objects) {
      for(let child of object.children) {
        if(selected == child) {
          //console.log("found");
          return object;
        }
      }
    }
    return null;
  }

  addObject(object) {
    this._objects.push(object);
  } 

  /*updateChildPosition() {
    const group = this._selected ? this._selected : this.object;
    const groupVec = group.position;
    for(let child of group.children) {
      const childVec = child.position;
      const newPos = {
        x: childVec.x + groupVec.x,
        y: childVec.y + groupVec.y,
        z: childVec.z + groupVec.z
      };
      //console.log(child.position)
    }
  }*/

  onDocumentMouseMove(_mouse) {
	try {
	this._raycaster.setFromCamera(_mouse, this._camera);
    if (this._selected) {
      if (this._raycaster.ray.intersectPlane(this._plane, this._intersection)) {
        this._selected.position.copy(
          this._intersection.sub(this._offset).applyMatrix4(this._inverseMatrix)
        );
        this._selected.updateMatrixWorld();
      }
      return;
    }

    this._intersections.length = 0;

    this._raycaster.setFromCamera(_mouse, this._camera);
    this._raycaster.intersectObjects(this._objects, true, this._intersections);

    if (this._intersections.length > 0) {
      this.object = this.getWrapper(this._intersections[0].object);
      this.object = this.object ? this.object : this._intersection[0].object;
      this._plane.setFromNormalAndCoplanarPoint(
        this._camera.getWorldDirection(this._plane.normal),
        this._worldPosition.setFromMatrixPosition(this.object.matrixWorld)
      );
      this.object.updateMatrixWorld();
	}
} catch(e) {}
  }

  onDocumentMouseCancel() {
    if (this._selected) {
      this._selected = null;
    }
  }

  onDocumentTouchStart(_mouse) {
    try {
      this._intersections.length = 0;

      this._raycaster.setFromCamera(_mouse, this._camera);
      this._raycaster.intersectObjects(
        this._objects,
        true,
        this._intersections
      );

      if (this._intersections.length > 0) {
        //this._selected = this._objects[0]//this._intersections[0].object;
        this._selected = this.getWrapper(this._intersections[0].object);
      this._selected = this.object ? this._selected : this._intersection[0].object;
        this._plane.setFromNormalAndCoplanarPoint(
          this._camera.getWorldDirection(this._plane.normal),
          this._worldPosition.setFromMatrixPosition(this._selected.matrixWorld)
        );

        if (
          this._raycaster.ray.intersectPlane(this._plane, this._intersection)
        ) {
          this._inverseMatrix.getInverse(this._selected.parent.matrixWorld);
          this._offset
            .copy(this._intersection)
            .sub(
              this._worldPosition.setFromMatrixPosition(
                this._selected.matrixWorld
              )
            );
        }
        this._selected.updateMatrixWorld();
      }
    } catch (e) {}
  }
}
