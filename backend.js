import * as firebase from 'firebase'
import 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyB60nFyTzVgM2kKxehO2kzW5AXSRjPRWGE",
    authDomain: "geometry3d.firebaseapp.com",
    databaseURL: "https://geometry3d.firebaseio.com",
    projectId: "geometry3d",
    storageBucket: "geometry3d.appspot.com",
    messagingSenderId: "101769601503",
    appId: "1:101769601503:web:952cb15cc6a093d807a46a",
    measurementId: "G-FPVN4MCQMZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(error => {
    console.log("Error when setting persistence")
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
    TaskState
}
