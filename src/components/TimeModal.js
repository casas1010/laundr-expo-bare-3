import React, { useEffect, useState } from "react";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Modal,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
// import t from "prop-types";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const FONTSIZE = Math.floor((HEIGHT * 0.1) / 3);

const TimeModal = (props) => {
  useEffect(() => {
    console.log("Menu Modal loaded");
  }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={props.modalView}>
      <TouchableOpacity
        onPress={() => {
          props.showModal(!props.modalView);
        }}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position:'relative'
        }}
      >
        <View
          style={{
            position:'absolute',
            bottom:0,
            width: WIDTH * 0.8,
            backgroundColor: "grey",
            margin: 20,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "grey",
            padding: 15,
          }}
        >
          
          {props.children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: "center",
    margin: "5%",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,

    backgroundColor: "red",
    height: 100,
    width: 100,
  },
});

export default TimeModal;
