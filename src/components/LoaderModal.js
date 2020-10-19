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
import Loader from "./Loader";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const FONTSIZE = Math.floor((HEIGHT * 0.1) / 3);

const LoaderModal = (props) => {
  useEffect(() => {
    console.log("Menu Modal loaded");
  }, []);

  return (
    <Modal animationType="fade" transparent={true} visible={props.loading}>
      <TouchableOpacity
        onPress={() => {
        //   props.showModal(!props.modalView);
        }}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View>
          <Loader />
          
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

export default LoaderModal;
