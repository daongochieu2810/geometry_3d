import * as THREE from 'three';

export default class Shape {
  constructor(
    object,
    edges,
    color,
    name,
    id,
    rotation = null,
    position = null
  ) {
    const raw_font = require("../../assets/fonts/bebas_neue.typeface.json");
    this.font = new THREE.Font(raw_font);
    this.object = object;
    this.color = color;
    this.edges = edges;
    this.name = name;
    this.id = id;
    this.rotation = rotation;
    this.position = position;
    this.vertices = null;
  }
  loadFont(listOfVertices, props) {
    let listOfObjects = [];
    for (let item of listOfVertices) {
      const vertex = item.point;
      const textGeo = new THREE.TextGeometry(item.text, {
        font: font,
        size: 0.5,
        height: 0.01,
      });
      let textMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      let text = new THREE.Mesh(textGeo, textMaterial);
      //props.basicComponents.scene.add(text);
      text.position.set(vertex.x, vertex.y, vertex.z);
      text.quaternion.copy(props.basicComponents.camera.quaternion);
      this.object.add(text);
      let point = {
        text: text,
        position: vertex,
        trueText: item.text,
      };
      listOfObjects.push(point);
    }
    let holder =
      props.basicComponents.points == null ? [] : props.basicComponents.points;
    props.reduxSetPoint([...listOfObjects, ...holder]);
  }
}
