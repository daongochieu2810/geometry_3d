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
  onDocumentMouseMove(_mouse) {
	try {
	this._raycaster.setFromCamera(_mouse, this._camera);
    if (this._selected) {
      if (this._raycaster.ray.intersectPlane(this._plane, this._intersection)) {
        this._selected.position.copy(
          this._intersection.sub(this._offset).applyMatrix4(this._inverseMatrix)
        );
      }
      return;
    }

    this._intersections.length = 0;

    this._raycaster.setFromCamera(_mouse, this._camera);
    this._raycaster.intersectObjects(this._objects, true, this._intersections);

    if (this._intersections.length > 0) {
      this.object = this._intersections[0].object;
      this._plane.setFromNormalAndCoplanarPoint(
        this._camera.getWorldDirection(this._plane.normal),
        this._worldPosition.setFromMatrixPosition(object.matrixWorld)
      );
	}
} catch(e) {}
  }

  onDocumentMouseDown(_mouse) {
    try {
      this._intersections.length = 0;

      this._raycaster.setFromCamera(_mouse, this._camera);
      this._raycaster.intersectObjects(
        this._objects,
        true,
        this._intersections
      );

      if (this._intersections.length > 0) {
        this._selected = this._intersections[0].object;

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
      }
    } catch (e) {}
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
        this._selected = this._intersections[0].object;

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
      }
    } catch (e) {}
  }
}
