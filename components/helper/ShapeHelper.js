import * as THREE from "three";
import { ConvexBufferGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { Object3D, Vector2 } from "three";
const raw_font = require("../../assets/fonts/bebas_neue.typeface");
const font = new THREE.Font(raw_font);
const xAxis = new THREE.Vector3(1, 0, 0);
const yAxis = new THREE.Vector3(0, 1, 0);
const zAxis = new THREE.Vector3(0, 0, 1);
export const getVerticesWithText = (mesh, type, position) => {
  var numVertices = 0;
  switch (type) {
    case "cube": {
      numVertices = 8;
      break;
    }
    case "box": {
      numVertices = 8;
      break;
    }
    case "cone": {
      numVertices = 1;
      break;
    }
    case "sphere": {
      numVertices = -1;
      break;
    }
    case "octahedron": {
      numVertices = 6;
      break;
    }
    case "prism": {
      numVertices = 6;
      break;
    }
    default: {
      break;
    }
  }
  let listOfVerticesWithText = [];
  let positions = mesh.geometry.attributes.position.array;

  var numSkip = 3;
  var pointHolder = null;
  if (type === "sphere") {
    listOfVerticesWithText.push({
      point: position ? position : new THREE.Vector3(0, 0, 0),
      text: "O",
    });
  } else {
    for (let i = 0; i < numVertices; i++) {
      //console.log(position)
      let x = positions[i * numSkip];
      let y = positions[i * numSkip + 1];
      let z = positions[i * numSkip + 2];
      if (position) {
        x += parseFloat(position.x);
        y += parseFloat(position.y);
        z += parseFloat(position.z);
      }
      let point = new THREE.Vector3(x, y, z);
      //console.log(point);
      if (type === "octahedron") {
        if (i === 2) point.x *= -1;
        if (i === 1) point.z *= -1;
      } else if (type === "prism") {
        if (i === 3 && pointHolder) {
          point.x = pointHolder.x;
          point.z = pointHolder.z;
          point.y = -pointHolder.y;
        }
        if (i === 2) {
          pointHolder = point;
        }
      }
      //listOfVertices.push(point);
      listOfVerticesWithText.push({
        point: point,
        text: i.toString(),
      });
    }
  }
  return listOfVerticesWithText;
};
export const createTextGeoFromPosition = (
  vertex,
  trueText,
  rotation,
  position
) => {
  const textGeo = new THREE.TextGeometry(trueText, {
    font: font,
    size: 0.5,
    height: 0.01,
  });

  let textMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  let text = new THREE.Mesh(textGeo, textMaterial);
  text.position.set(vertex.x, vertex.y, vertex.z);
  if (rotation) {
    rotateByPoint(text, position, xAxis, rotation.x);
    rotateByPoint(text, position, yAxis, rotation.y);
    rotateByPoint(text, position, zAxis, rotation.z);
  }
  return text;
};
const rotateByPoint = (obj, pivot, axis, theta) => {
  obj.localToWorld(obj.position);
  obj.position.sub(pivot); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(pivot); // re-add the offset
  obj.worldToLocal(obj.position);
  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
};
export const drawEdgesFromGeo = (geometry, rotation, position) => {
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  if (position) line.position.set(position.x, position.y, position.z);
  if (rotation) line.rotation.set(rotation.x, rotation.y, rotation.z);
  return line;
};
function getCenterPoint(mesh) {
  const meshClone = mesh.clone();
  let geometry = meshClone.geometry;
  geometry.computeBoundingBox();
  let center = geometry.boundingBox.getCenter();
  meshClone.localToWorld(center);
  return center;
}

const addBasicShapes = (
  props,
  type,
  position,
  sizes,
  rotation = null,
  color = null,
  points = null,
  name,
  updatePoints
) => {
  let geometry = null;
  let material = null;
  position.x = parseFloat(position.x);
  position.y = parseFloat(position.y);
  position.z = parseFloat(position.z);
  position = new THREE.Vector3(position.x, position.y, position.z);
  switch (type) {
    case "box": {
      geometry = new THREE.BoxBufferGeometry(
        sizes.width,
        sizes.height,
        sizes.depth
      );
      material = new THREE.MeshBasicMaterial({
        color: color ? new THREE.Color(color) : 0xe7ff37,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
      });
      break;
    }
    case "custom": {
      points = points.map((item) => new THREE.Vector3(item.x, item.y, item.z));
      //console.log("pass1");

      geometry = new ConvexBufferGeometry(points);
      //console.log("pass2");
      material = new THREE.MeshBasicMaterial({
        color: color ? new THREE.Color(color) : 0xe7ff37,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
      });
      break;
    }
    case "sphere": {
      geometry = new THREE.SphereBufferGeometry(
        sizes.radius,
        sizes.radius * 5,
        sizes.radius * 5
      );
      material = new THREE.MeshBasicMaterial({
        color: color ? new THREE.Color(color) : 0xe7ff37,
        opacity: 0.5,
        transparent: true,
      });
      break;
    }
    case "cone": {
      geometry = new THREE.ConeBufferGeometry(
        sizes.radius,
        sizes.height,
        sizes.radius * 7
      );
      material = new THREE.MeshBasicMaterial({
        color: color ? new THREE.Color(color) : 0xe7ff37,
        opacity: 0.5,
        transparent: true,
      });
      break;
    }
    default: {
      break;
    }
  }

  let mesh = new THREE.Mesh(geometry, material);
  //console.log("pass3");
  let edges = new THREE.EdgesGeometry(geometry);
  //console.log("pass4");
  let line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  if (position) {
    mesh.position.set(position.x, position.y, position.z);
    line.position.set(position.x, position.y, position.z);
  }
  if (rotation) {
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    line.rotation.set(rotation.x, rotation.y, rotation.z);
    rotation = new THREE.Vector3(rotation.x, rotation.y, rotation.z);
  }
  const listOfTextGeo = [];
  if (type !== "custom") {
    const listOfVertices = getVerticesWithText(mesh, type, position);
    for (let vertext of listOfVertices) {
      const textGeo = createTextGeoFromPosition(
        vertext.point,
        vertext.text,
        rotation,
        position
      );
      props.basicComponents.scene.add(textGeo);
      //console.log("added")
      listOfTextGeo.push({
        trueText: vertext.text,
        position: vertext.point,
        text: textGeo,
      });
    }
    props.reduxSetPoint([...props.basicComponents.points, ...listOfTextGeo]);
    updatePoints();
  } else {
    //TODO
    /*for (let point of points) {
      listOfTextGeo.push({
      })
    }*/
    position = getCenterPoint(mesh);
  }
  props.basicComponents.scene.add(mesh, line);
  props.reduxAddShape({
    object: mesh,
    edges: line,
    color: color,
    name: name,
    type: type,
    id: props.basicComponents.shapes.length,
    rotation: rotation,
    position: position,
    points: listOfTextGeo,
  });
  props.getShapesCallback(props.basicComponents.shapes);
};
export const addShapes = (props, shapes, updatePoints) => {
  for (let shape of shapes) {
    if (shape.item.type) {
      addBasicShapes(
        props,
        shape.item.type,
        shape.item.position,
        shape.item.sizes,
        shape.item.rotation,
        shape.item.color,
        shape.item.points,
        shape.item.name,
        updatePoints
      );
    }
  }
};

export const removeShapes = (props, shapes) => {
  for (let shape of shapes) {
    props.basicComponents.scene.remove(shape.object, shape.edges);
    props.reduxRemoveShape(shape);
  }
  props.getShapesCallback(props.basicComponents.shapes);
};

export const loadSavedState = (props, scene, updatePoints) => {
  //props.reduxSetControls(new DragControls([], camera));
  const data = props.savedState;
  data.lines = JSON.parse(data.lines);
  data.shapes = JSON.parse(data.shapes);
  data.points = JSON.parse(data.points);
  const loader = new THREE.ObjectLoader();
  for (let line of data.lines) {
    scene.add(loader.parse(line.line));
  }
  let points = [];
  for (let point of data.points) {
    const vertex = point.position;
    const text = createTextGeoFromPosition(vertex, point.trueText, null, null);
    points.push({
      text: text,
      position: vertex,
      trueText: point.trueText,
    });
    scene.add(text);
  }
  props.reduxSetPoint([...points]);
  updatePoints();
  let shapesHolder = [];
  for (let shape of data.shapes) {
    let shapePoints = [];
    const object = loader.parse(shape.object);
    const edges = drawEdgesFromGeo(
      object.geometry,
      shape.rotation,
      shape.type === "custom" ? null : shape.position
    );
    for (let point of shape.points) {
      const vertex = point.position;
      const text = createTextGeoFromPosition(
        vertex,
        point.trueText,
        shape.rotation,
        shape.position
      );
      shapePoints.push({
        text: text,
        position: vertex,
        trueText: point.trueText,
      });
      //scene.add(text);
    }
    //const wrapper = new THREE.Object3D();
    //wrapper.add(object, edges);
    //props.basicComponents.controls.addObject(wrapper);
    scene.add(object, edges);
    shapesHolder.push({
      object: object,
      color: shape.color,
      edges: edges,
      name: shape.name,
      type: shape.type,
      id: shape.id,
      rotation: shape.rotation,
      position: shape.position,
      points: shapePoints,
    });
  }
  props.reduxSetShape(shapesHolder);
  props.getShapesCallback(props.basicComponents.shapes);
};
