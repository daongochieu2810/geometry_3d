import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {Dimensions, View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet} from "react-native";
import { connect } from "react-redux";
import actions from "../../actions";
import { useNavigation } from "react-navigation-hooks";
import { NavigationActions } from "react-navigation";
import fb from '../../backend';
import Spinner from "../../Spinner";
import * as THREE from 'three';
import Toast from 'react-native-toast-message';
import {getJSON} from '../../components/common/GetJSONFromURL'
import Dialog, {
  SlideAnimation,
  DialogButton,
  DialogFooter,
} from "react-native-popup-dialog";
import {createTextGeoFromPosition, drawEdgesFromGeo} from '../../components/helper/ShapeHelper'
const mapDispatchToProps = (dispatch) => {
  return {
    reduxRemoveSaveItem: (item) => {
      dispatch(actions.removeSaveItem(item));
    },
      reduxSetSaveItem: (items) => {
        dispatch(actions.setSaveItem(items));
      },
      reduxAddSaveItem: (item) => {
        dispatch(actions.addSaveItem(item));
      },
      reduxSetCanRetrieve: (data) => {
        dispatch(actions.setCanRetrieve(data));
      }
  };
};
const mapStateToProps = (state) => {
  return {
    saveComponents: state.saveComponents,
      miscData: state.miscData
  };
};
const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

export default connect(mapStateToProps, mapDispatchToProps)(SavedItemScreen);
function SavedItemScreen(props) {
   // console.log(props)
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
        if(newScene) setSaveItems(() => [newScene, ...saveItems]);
    },[newScene]);
    const ifExist = (fileName) => {
        for(let item of saveItems) {
            if(item.fileName === fileName) return true;
        }
        return false;
    };
    const retrieveSyncedItems = () => {
        setIsLoading(() => true);
        //setSyncedItems(() => []);
        let counter = 0;
        fb.userCollection.doc(fb.auth.currentUser.uid).get().then(doc => {
            const data = doc.data();
            setUserData(() => {
                uid: data.uid
            });
            //const loader = new THREE.ObjectLoader();
            for(let url of data.scenes) {
                fetch(url)
                    .then(res => {
                        //console.log(url);
                        return res.json();
                    })
                    .then((data) => {
                       /* let lines = [];
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
                                trueText: point.trueText,
                                position: vertex
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
                }*/
                        let newItem = {
                            fileName: data.fileName,
                            name: data.name,
                            lines: data.lines,
                            shapes: data.shapes,
                            points: data.points,
                            isSynced: true,
                            showOptions: false
                        };
                        if(!ifExist(newItem.fileName)) {
                            setNewScene(() => (newItem));
                            props.reduxAddSaveItem(newItem);
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
        const _saveItems = [];

        for(let item of saveItems) {
            //item.isSynced = true;
            if(!item.isSynced) {
                item.isSynced = true;
                _saveItems.push({...item});
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
            const refScene = storageRef.child(`/${currUser.uid}/scenes/${item.name}.json`);
                /*item.points = item.points.map(item => ({
                    position: item.text.position,
                    trueText: item.trueText
                }));*/
            var json = JSON.stringify(item);
            var fileBlob = new Blob([json], {type: 'application/json'});
            refScene.put(fileBlob).then((snapshot) => {
                snapshot.ref.getDownloadURL().then(url => fb.userCollection.doc(fb.auth.currentUser.uid)
                    .update({scenes: fb.FieldValue.arrayUnion(url)}));
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
                console.log(e);
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
    <View style={{marginTop: 25, marginHorizontal: 20 }}>
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
            maxHeight: SCREEN_HEIGHT / 1.7
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
                      points: JSON.stringify(item.points)
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
        {saveItems.length > 0 && <TouchableOpacity style={{
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
        <TouchableOpacity style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: props.miscData.canRetrieve ? '#34c6eb' : '#a1a1a1',
            marginTop: 10
        }} //disabled={!props.miscData.canRetrieve}
                          onPress={() => {
            retrieveSyncedItems();
            props.reduxSetCanRetrieve(false);
        }}>
            <Text style={{textAlign: 'center', color: props.miscData.canRetrieve ? 'black' : '#a1a1a1'}}>Retrieve synced items</Text>
        </TouchableOpacity>
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
                  if(!chosenItem) {
                      props.reduxSetSaveItem([]);
                      setSaveItems(() => []);
                      setVisible(() => false);
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
                      setVisible(() => false);
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
               const filtered = saveItems.filter(item => item !== chosenItem);
               setSaveItems(() => filtered);
               props.reduxSetSaveItem(filtered);
               setChosenItem(() => null);
               setVisible(() => false);
           }
           }><Text style={{color: 'red', textAlign: 'center'}}>Delete</Text></TouchableOpacity>
           </View> : <Text style={{fontSize: 20, textAlign: 'center', marginVertical: 20}}>Are you sure ?</Text>}
      </Dialog>
    </View>
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
