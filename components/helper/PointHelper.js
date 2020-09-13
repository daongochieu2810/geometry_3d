import * as THREE from "three";

export const connectPoints = (props, loadFont, points) => {
  const newPoints = [];
  const actualPoints = points.map((item) => {
    if (item.isNew) {
      newPoints.push(item.item);
    }
    return item.item.point;
  });
  let lineName = "";
  for (let index = 0; index < points.length; index++) {
    let item = points[index];
    lineName += item.item.text;
    if (index !== points.length - 1) lineName += "-";
  }
  loadFont(newPoints);
  let geometry = new THREE.BufferGeometry().setFromPoints(actualPoints);
  let material = new THREE.LineBasicMaterial({ color: 0xffffff });
  let newLine = new THREE.Line(geometry, material);
  props.basicComponents.scene.add(newLine);
  props.reduxAddLine({ line: newLine, text: lineName });
  props.getLinesCallback(props.basicComponents.lines);
};

export const disconnectPoints = (props, lines) => {
  for (let line of lines) {
    let realLine = line.item.line;
    props.basicComponents.scene.remove(realLine);
    props.reduxRemoveLine(line.item);
    props.getLinesCallback(props.basicComponents.lines);
  }
};
export const addPoints = (loadFont, points) => {
  let holder = [];
  for (let point of points) {
    holder.push(point.item);
  }
  loadFont(holder);
};
export const removePoints = (props, updatePoints, points) => {
  for (let point of points) {
    props.basicComponents.scene.remove(point.item.item.text);
    props.reduxSetPoint(
      props.basicComponents.points.filter((item) => item !== point.item.item)
    );
  }
  updatePoints();
};

const raw_font = require("../../assets/fonts/bebas_neue.typeface.json");
const font = new THREE.Font(raw_font);
export const loadTextVertex = (item) => {
  const vertex = item.position;
  const textGeo = new THREE.TextGeometry(item.trueText, {
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
