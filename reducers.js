import { combineReducers } from "redux";
import * as THREE from "three";
import {createTextGeoFromPosition, drawEdgesFromGeo} from "./components/helper/ShapeHelper";

const convertJSON_to_THREE = (data) => {
  const loader = new THREE.ObjectLoader();
  let lines = [];
  let points = [];
  let shapes = [];
  for(let line of data.lines) {
    lines.push({
      line: loader.parse(line.line),
      text: line.text
    });
  }
  for(let point of data.points) {
    const vertex = point.position;
    const text = createTextGeoFromPosition(vertex, point.trueText);
    points.push({
      text: text,
      trueText: point.trueText
    });
  }
  for(let shape of data.shapes) {
    const object = loader.parse(shape.object);
    const edges = drawEdgesFromGeo(object.geometry);
    shapes.push({
      object: object,
      edges: edges,
      name: shape.name,
      color: shape.color,
      id: shape.id
    });
  }
  return {
    fileName: data.fileName,
    name: data.name,
    lines: lines,
    shapes: shapes,
    points: points,
    isSynced: data.isSynced,
    showOptions: false
  };
};
const initState = {
  scene: null,
  camera: null,
  cameraHandler: null,
  renderer: null,
  points: [],
  lines: [],
  shapes: [],
};
const saveInitState = {
  items: [],
  //each item has shapes, lines, points and name
};
const initCurrentUserState = {
  user: {}
};
const initMiscData = {
  canRetrieve: true
};

const basicComponentsReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_SCENE": {
      state.scene = action.scene;
      return state;
    }
    case "SET_CAMERA": {
      state.camera = action.camera;
      return state;
    }
    case "SET_CAMERA_HANDLER": {
      state.cameraHandler = action.cameraHandler;
      return state;
    }
    case "SET_RENDERER": {
      state.renderer = action.renderer;
      return state;
    }
    case "SET_POINTS": {
      state.points = action.points; //[...state.points,action.point]
      return state;
    }
    case "SET_LINES": {
      state.lines = action.lines;
      return state;
    }
    case "ADD_LINE": {
      if (state.lines == null) state.lines = [];
      state.lines.push(action.line);
      return state;
    }
    case "REMOVE_LINE": {
      state.lines = state.lines.filter((item) => item !== action.line);
      return state;
    }
    case "SET_SHAPES": {
      state.shapes = action.shapes;
      return state;
    }
    case "ADD_SHAPE": {
      if (!state.shapes) state.shapes = [];
      state.shapes.push(action.shape);
      return state;
    }
    case "REMOVE_SHAPE": {
      state.shapes = state.shapes.filter((item) => item !== action.shape);
      return state;
    }
    default: {
      return state;
    }
  }
};
const saveComponentsReducer = (state = saveInitState, action) => {
  switch (action.type) {
    case "ADD_SAVE_ITEM": {
      if (!state.items) state.items = [];
      state.items.push(action.item);
      return {
        ...state,
        items: state.items
      };
    }
    case "REMOVE_SAVE_ITEM": {
      //state.items = state.items.filter((item) => item !== action.item);
      return {
        ...state,
        items: state.items.filter((item) => item !== action.item)
      };
    }
    case "SET_SAVE_ITEM": {
      return {
        ...state,
        items: action.items
      };
    }
    default: {
      return state;
    }
  }
};
const currentUserReducer = (state = initCurrentUserState, action) => {
  switch(action.type) {
      case "SET_CURRENT_USER": {
        state.user = action.user;
          return state;
      }
      default: {
          return state;
      }
  }
};
const miscDataReducer = (state = initMiscData, action) => {
  switch (action.type) {
    case "SET_CAN_RETRIEVE": {
      state.canRetrieve = action.canRetrieve;
      return state;
    }
    default: {
      return state;
    }
  }
};

export default combineReducers({
  basicComponents: basicComponentsReducer,
  saveComponents: saveComponentsReducer,
  currentUser: currentUserReducer,
  miscData: miscDataReducer
});
