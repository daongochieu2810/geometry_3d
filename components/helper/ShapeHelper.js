import * as THREE from "three";
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
  var pointHolder = null
  // /if(numVertices == 6) numSkip = 4
  if (type === "sphere") {
    listOfVerticesWithText.push({
      point: new THREE.Vector3(0, 0, 0),
      text: "O",
    });
  } else {
    for (let i = 0; i < numVertices; i++) {
      var point = new THREE.Vector3(
        positions[i * numSkip],
        positions[i * numSkip + 1],
        positions[i * numSkip + 2]
      );
      if (type === "octahedron") {
        if (i == 2) point.x *= -1;
        if (i == 1) point.z *= -1;
      } else if (type === "prism") {
        if (i == 3 && pointHolder) {
          point.x = pointHolder.x
          point.z = pointHolder.z
          point.y = -pointHolder.y
        }
        if(i == 2) {
          pointHolder = point
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
  var textMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  var text = new THREE.Mesh(textGeo, textMaterial);
  text.position.set(vertex.x, vertex.y, vertex.z);
  return text;
};
export const drawEdgesFromGeo = (geometry) => {
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  return line;
};
export const createTetraHedron = (scene) => {
  let s_8_9 = Math.sqrt(8 / 9),
    s_2_9 = Math.sqrt(2 / 9),
    s_2_3 = Math.sqrt(2 / 3);
  let v = [
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(s_8_9, 0, -1 / 3),
    new THREE.Vector3(-s_2_9, s_2_3, -1 / 3),
    new THREE.Vector3(-s_2_9, -s_2_3, -1 / 3),
  ];
  let pointOnEdge = (pt1, pt2, t) =>
    new THREE.Vector3().lerpVectors(pt1, pt2, t);
  let computeOffsetPts = (pts, d) => {
    let offsetPts = [];
    for (let i = 0; i < pts.length; ++i) {
      let va = pointOnEdge(pts[i], pts[(i + 1) % 3], d);
      let vb = pointOnEdge(pts[i], pts[(i + 2) % 3], d);
      offsetPts.push(new THREE.Vector3().lerpVectors(va, vb, 0.5));
    }
    return offsetPts;
  };
  const facesColors = [
    0xffff00, // yellow
    0xff0000, // red
    0x0000ff, // blue
    0x008000, // green
  ];
  let faces = [
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 1],
    [1, 3, 2],
  ];
  let newTriangle = (pts, color, d) => {
    let innerPts = computeOffsetPts(pts, d);
    let material = new THREE.MeshBasicMaterial({ color: color });
    let geometry = new THREE.Geometry();
    geometry.vertices.push(...innerPts);
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    return new THREE.Mesh(geometry, material);
  };

  const d = 0.05;
  for (let i = 0; i < 4; ++i) {
    let color = facesColors[i];
    let pts = [v[faces[i][0]], v[faces[i][1]], v[faces[i][2]]];
    let centerPt = new THREE.Vector3()
      .addVectors(pts[0], pts[1])
      .add(pts[2])
      .divideScalar(3);
    let hexagonPts = [];
    for (let j = 0; j < 3; ++j) {
      hexagonPts.push(
        pointOnEdge(pts[j], pts[(j + 1) % 3], 1 / 3),
        pointOnEdge(pts[j], pts[(j + 1) % 3], 2 / 3)
      );
    }

    for (let j = 0; j < 3; ++j) {
      let topPts = [pts[j], hexagonPts[j * 2], hexagonPts[(j * 2 + 5) % 6]];
      let face = newTriangle(topPts, color, d);
      scene.add(face);
    }
    for (let j = 0; j < hexagonPts.length; ++j) {
      let innerPts = [
        centerPt,
        hexagonPts[j],
        hexagonPts[(j + 1) % hexagonPts.length],
      ];
      let face = newTriangle(innerPts, color, d);
      scene.add(face);
    }
  }
};
