import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {Dimensions, View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, SafeAreaView} from "react-native";
import { connect } from "react-redux";
import actions from "../../actions";
import { useNavigation } from "react-navigation-hooks";
import { NavigationActions } from "react-navigation";
import fb from '../../backend';
import Spinner from "../../Spinner";
import Toast from 'react-native-toast-message';
import Dialog, {
  SlideAnimation,
  DialogButton,
  DialogFooter,
} from "react-native-popup-dialog";
import {deleteItemFireStore, deleteItemStorage, clearItemFireStore} from '../../components/helper/DatabaseHelper';
const mapDispatchToProps = (dispatch) => {
  return {
      reduxSetSaveItem: (items) => {
        dispatch(actions.setSaveItem(items));
      },
      reduxAddSaveItem: (item) => {
        dispatch(actions.addSaveItem(item));
      }
  };
};
const mapStateToProps = (state) => {
  return {
    saveComponents: state.saveComponents,
      miscData: state.miscData
  };
};
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default connect(mapStateToProps, mapDispatchToProps)(SavedItemScreen);
function SavedItemScreen(props) {
    const saveItemsHolder = [...props.saveComponents.items];
  const navigation = useNavigation();
  const [saveItems, setSaveItems] = useState(saveItemsHolder.map(item => ({...item, showOptions: false})));
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [newScene,setNewScene] = useState(null);
  const [chosenItem, setChosenItem] = useState(null);
  const [newName, setNewName] = useState("");
    useEffect(() => {
        if(newScene) {
            setSaveItems(() => [newScene, ...saveItems]);
            props.reduxAddSaveItem(newScene);
        }
    },[newScene]);
    const ifExist = (fileName) => {
        for(let item of saveItems) {
            if(item.fileName === fileName) return true;
        }
        return false;
    };
    const retrieveSyncedItems = () => {
        setIsLoading(() => true);
        fb.userCollection.doc(fb.auth.currentUser.uid).get().then(doc => {
            const data = doc.data();
            setUserData(() => {
                uid: data.uid
            });
            for(let url of data.scenes) {
                fetch(url)
                    .then(res => {
                        return res.json();
                    })
                    .then((data) => {
                        let newItem = {
                            fileName: data.fileName,
                            name: data.name,
                            lines: data.lines,
                            shapes: data.shapes,
                            points: data.points,
                            isSynced: true,
                            showOptions: false,
                            url: url
                        };
                        if(!ifExist(newItem.fileName)) {
                            setNewScene(() => (newItem));
                        }

            })
            .catch(err => {
                console.log(err);
            });
            }
            setIsLoading(() => false);
        }).catch(e => {
            setIsLoading(() => false);
            console.log(e);
        })
    };


    const syncSavedItems = () => {
        setIsLoading(() => true);
        const currUser = fb.auth.currentUser;
        const storageRef = fb.storage.ref();
        let _saveItems = [];

        for(let item of saveItems) {
            if(!item.isSynced) {
                item.isSynced = true;
                _saveItems.push(item);
            }
        }
        if(_saveItems.length === 0) {
            Toast.show({
                type: "error",
                position: "top",
                text1: "All items synced",
                text2: "Try adding more items",
                visibilityTime: 3000,
                autoHide: true,
            });
            setIsLoading(() => false);
            return;
        }
        let counter = 0;
        for(let item of _saveItems) {
            const refScene = storageRef.child(`/${currUser.uid}/scenes/${item.fileName}.json`);
            let json = JSON.stringify(item);
            let fileBlob = new Blob([json], {type: 'application/json'});
            refScene.put(fileBlob).then((snapshot) => {
                snapshot.ref.getDownloadURL().then(url => {
                    item.url = url;
                    fb.userCollection.doc(fb.auth.currentUser.uid)
                    .update({scenes: fb.FieldValue.arrayUnion(url)})
                });
                counter++;
                if(counter === _saveItems.length) {
                    Toast.show({
                        type: "success",
                        position: "top",
                        text1: "All items synced",
                        text2: "Success",
                        visibilityTime: 3000,
                        autoHide: true,
                    });
                    setIsLoading(() => false);
                }
            }).catch(e => {
                //console.log(e);
                counter++;
                if(counter === _saveItems.length) {
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: "Something wrong happened",
                        text2: "Success",
                        visibilityTime: 3000,
                        autoHide: true,
                    });
                    setIsLoading(() => false);
                }
            });
        }

    };
  return isLoading ? (<View><Spinner visible={true}/></View>) :(
    <SafeAreaView style={{marginTop: 10, marginHorizontal: 20}}>
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 20 }}>Saved items</Text>
        <TouchableOpacity
          style={{
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "red",
            backgroundColor: 'red',
            borderRadius: 5,
          }}
          disabled={saveItems.length <= 0}
          onPress={() => {
            if(saveItems.length > 0) setVisible(true)
          }}
        >
          <Text style={{ color: "white" }}>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{
          marginTop: 10,
            maxHeight: SCREEN_HEIGHT / 1.6
        }}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        data={saveItems}
        extraData={saveItems}
        keyExtractor={(item) => `${item.fileName}`}
        renderItem={({ index, item }) => (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 10,
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 5,
                marginBottom: 10,
                marginRight: 10
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => `${index} save items`}
              onPress={() => {
                navigation.navigate(
                  "Objects",
                  {},
                  NavigationActions.navigate({
                    routeName: "BaseLayoutScreen",
                    params: {
                      shapes: JSON.stringify(item.shapes),
                      lines: JSON.stringify(item.lines),
                      points: JSON.stringify(item.points),
                        fileName: item.fileName
                    },
                  })
                );
              }}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          <TouchableOpacity style={{
              padding: 10,
              borderWidth: 1,
              borderColor: "#f34aff",
              borderRadius: 5,
              marginBottom: 10,
          }} onPress={() => {
              setChosenItem(() => item);
              setVisible(() => true);
          }}>
              <Ionicons name="ios-cog" size={24} color={"#f34aff"}/>
          </TouchableOpacity>
          </View>
        )}
      />
        {saveItems.length > 0 && fb.auth.currentUser && <TouchableOpacity style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#53ff40'
        }} onPress={() => {
            //props.reduxSetCanRetrieve(false);
            syncSavedItems();
        }}>
            <Text style={{textAlign: 'center'}}>Sync with online account</Text>
        </TouchableOpacity>}
        { fb.auth.currentUser && <TouchableOpacity style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#34c6eb',
            marginTop: 10
        }}
                          onPress={() => {
            retrieveSyncedItems();
        }}>
            <Text style={{textAlign: 'center', color: 'black'}}>Retrieve synced items</Text>
        </TouchableOpacity>}
       <Dialog
        visible={visible}
        dialogAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        width={SCREEN_WIDTH * 0.8}
        onHardwareBackPress={() => true}
        footer={
          <DialogFooter>
            <DialogButton
              text={chosenItem ? "CANCEL" : "NO"}
              onPress={() => {
                setVisible(false);
                setChosenItem(() => null);
                setNewName(() => "");
              }}
              textStyle={{
                fontSize: 15,
                color: "red",
              }}
            />
            <DialogButton
              text={chosenItem ? "DONE" : "YES"}
              onPress={() => {
                  setVisible(() => false);
                  if(!chosenItem) {
                      props.reduxSetSaveItem([]);
                      setSaveItems(() => []);
                      clearItemFireStore();
                  } else {
                      if(newName !== "") {
                          const filtered = saveItems.map(item => {
                              if(item === chosenItem) {
                                  item.name = newName
                              }
                              return item;
                          });
                          setSaveItems(() => saveItems);
                          props.reduxSetSaveItem(filtered);
                      }
                      setChosenItem(() => null);
                      setNewName(() => "");
                  }
              }}
              textStyle={{
                fontSize: 15,
                color: "green",
              }}
            />
          </DialogFooter>
        }
      >
           {chosenItem ? <View style={{
           paddingHorizontal: 15,
               paddingVertical: 10
           }}>
               <View style={{
                   marginLeft: 5,
                   flexDirection: 'row'
               }}>
                   <Text style={{marginTop: 10}}>Rename</Text>
                   <TextInput
                       style={styles.input}
                       onChangeText={(text) => {
                           setNewName(() => text);
                       }}
                       value={newName}
                   />
               </View>
           <TouchableOpacity style={{
                paddingVertical: 5,
               paddingHorizontal: 10,
               borderColor: "red",
               borderWidth: 1,
               borderRadius: 5,
               marginTop: 20
           }} onPress={() => {
               setVisible(() => false);
               const filtered = saveItems.filter(item => item !== chosenItem);
               setSaveItems(() => filtered);
               props.reduxSetSaveItem(filtered);
               if(chosenItem.url !== "") {
                   deleteItemFireStore(chosenItem.url).then(() => {
                       deleteItemStorage(chosenItem.fileName).then(() => {
                           setChosenItem(() => null);
                       })
                   });
               } else {
                   setChosenItem(() => null);
               }
           }
           }><Text style={{color: 'red', textAlign: 'center'}}>Delete</Text></TouchableOpacity>
           </View> : <Text style={{fontSize: 20, textAlign: 'center', marginVertical: 20}}>Are you sure ?</Text>}
      </Dialog>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    input: {
        marginRight: 10,
        width: SCREEN_WIDTH * 0.5,
        borderBottomColor: "#8a8a8a",
        borderBottomWidth: StyleSheet.hairlineWidth,
        fontSize: 15,
        marginLeft: 10
    },
})
