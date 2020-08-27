import fb from '../../backend';
export const deleteItemFireStore = async (item) => {
    await fb.userCollection.doc(fb.auth.currentUser.uid).update({
        scenes: fb.FieldValue.arrayRemove(item)
    })
};
export const clearItemFireStore = async () => {
    await fb.userCollection.doc(fb.auth.currentUser.uid).update({
        scenes: []
    }).catch(e => console.log(e))
};
export const deleteItemStorage = async (fileName) => {
    const storageRef = fb.storage.ref();
    await storageRef.child(`/${fb.auth.currentUser.uid}/scenes/${fileName}.json`).delete().catch(e => console.log(e))
};