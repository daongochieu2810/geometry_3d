import * as THREE from "three";
import { ConvexBufferGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
const raw_font = require("../../assets/fonts/bebas_neue.typeface");
const font = new THREE.Font(raw_font);
export const getVerticesWithText = (mesh, type) => {
  var numVertices = 0;
  switch (type) {
    case "cube": {
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
  var listOfChars = ["A", "B", "D", "C", "A'", "B'", "D'", "C'"];
  var numSkip = 3;
  var pointHolder = null;
  if (type === "sphere") {
    listOfVerticesWithText.push({
      point: new THREE.Vector3(0, 0, 0),
      text: "O",
    });
  } else {
    for (let i = 0; i < numVertices; i++) {
      let point = new THREE.Vector3(
        positions[i * numSkip],
        positions[i * numSkip + 1],
        positions[i * numSkip + 2]
      );
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
        text: listOfChars[i],
      });
    }
  }
  return listOfVerticesWithText;
};
export const createTextGeoFromPosition = (vertex, trueText) => {
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
  return text;
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
const addBasicShapes = (
  props,
  type,
  position,
  sizes,
  rotation = null,
  color = null,
  points = null,
  name
) => {
  let geometry = null;
  let material = null;
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
      geometry = new ConvexBufferGeometry(points);
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
  let edges = new THREE.EdgesGeometry(geometry);
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
  }
  /*const wrapper = new THREE.Object3D();
  wrapper.add(mesh, line);
  props.basicComponents.controls.addObject(wrapper);
  props.basicComponents.scene.add(wrapper);*/
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
  });
  props.getShapesCallback(props.basicComponents.shapes);
};
export const addShapes = (props, shapes) => {
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
        shape.item.name
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
    const text = createTextGeoFromPosition(vertex, point.trueText);
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
    const object = loader.parse(shape.object);
    const edges = drawEdgesFromGeo(
      object.geometry,
      shape.rotation,
      shape.position
    );
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
    });
  }
  props.reduxSetShape(shapesHolder);
  props.getShapesCallback(props.basicComponents.shapes);
}
