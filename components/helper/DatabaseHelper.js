import fb from "../../backend";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const deleteItemFireStore = async (item) => {
  await fb.userCollection.doc(fb.auth.currentUser.uid).update({
    scenes: fb.FieldValue.arrayRemove(item),
  });
};
export const clearItemFireStore = async () => {
  await fb.userCollection
    .doc(fb.auth.currentUser.uid)
    .update({
      scenes: [],
    })
    .catch((e) => console.log(e));
};
export const deleteItemStorage = async (fileName) => {
  const storageRef = fb.storage.ref();
  await storageRef
    .child(`/${fb.auth.currentUser.uid}/scenes/${fileName}.json`)
    .delete()
    .catch((e) => console.log(e));
};
export const formatDateTime = (dateObject) => {
  const year = dateObject.getFullYear();
  const date = dateObject.getDate();
  const monthIndex = dateObject.getMonth();
  const monthName = months[monthIndex];
  const dayIndex = dateObject.getDay();
  const dayName = days[dayIndex];
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const seconds = dateObject.getSeconds();
  return `${hours}:${
    minutes < 10 ? "0" + minutes.toString() : minutes.toString()
  }:${seconds}, ${dayName}, ${date} ${monthName} ${year}`;
};
