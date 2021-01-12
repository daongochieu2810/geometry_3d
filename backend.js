import * as firebase from "firebase";
import "firebase/firestore";
import { SECRETS } from "./secrets";

const firebaseConfig = SECRETS;
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
  console.log("Error when setting persistence");
});
const FieldValue = firebase.firestore.FieldValue;
const TaskEvent = firebase.storage.TaskEvent;
const TaskState = firebase.storage.TaskState;

const userCollection = db.collection("users");
export default {
  userCollection,
  auth,
  storage,
  FieldValue,
  TaskEvent,
  TaskState,
};
