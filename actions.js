const setCamera = (data) => ({
  type: "SET_CAMERA",
  camera: data,
});
const setCameraHandler = (data) => ({
  type: "SET_CAMERA_HANDLER",
  cameraHandler: data,
});
const setScene = (data) => ({
  type: "SET_SCENE",
  scene: data,
});
const setRaycaster = (data) => ({
  type: "SET_RAYCASTER",
  raycaster: data,
});
const setIntersects = (data) => ({
  type: "SET_INTERSECTS",
  intersects: data,
});
const setRenderer = (data) => ({
  type: "SET_RENDERER",
  renderer: data,
});
const setPoints = (points) => ({
  type: "SET_POINTS",
  points: points,
});
const addLine = (line) => ({
  type: "ADD_LINE",
  line: line,
});
const setLines = (lines) => ({
  type: "SET_LINES",
  lines: lines,
});
const removeLine = (line) => ({
  type: "REMOVE_LINE",
  line: line,
});
const setShapes = (shapes) => ({
  type: "SET_SHAPES",
  shapes: shapes,
});
const addShape = (shape) => ({
  type: "ADD_SHAPE",
  shape: shape,
});
const removeShape = (shape) => ({
  type: "REMOVE_SHAPE",
  shape: shape,
});
const addSaveItem = (item) => ({
  type: "ADD_SAVE_ITEM",
  item: item,
});
const removeSaveItem = (item) => ({
  type: "REMOVE_SAVE_ITEM",
  item: item,
});
const setSaveItem = (items) => ({
  type: "SET_SAVE_ITEM",
  items: items
});
const setCurrentUser = (data) => ({
  type: "SET_CURRENT_USER",
  user: data
});
const setDisableCamera = (data) => ({
  type: "SET_DISABLE_CAMERA",
  disableCamera: data
});
export default {
  setCamera,
  setCameraHandler,
  setScene,
  setRenderer,
  setPoints,
  addLine,
  setLines,
  removeLine,
  setShapes,
  addShape,
  removeShape,
  addSaveItem,
  removeSaveItem,
  setCurrentUser,
  setSaveItem,
  setDisableCamera,
  setRaycaster,
  setIntersects
};
