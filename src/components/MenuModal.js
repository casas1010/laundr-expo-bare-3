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

const MenuModal = (props) => {
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
        }}
      >
        <View
          style={{
            width: WIDTH * 0.8,
            backgroundColor: "grey",
            margin: 20,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "grey",
            padding: 15,
          }}
        >
          <FlatList
            data={props.data}
            ListHeaderComponent={() => (
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                {props.title}
              </Text>
            )}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#01c9e2",
                }}
              />
            )}
            keyExtractor={(item) => item.value}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    props.setCardTypeHelper(item.value)
                  }
                  // style={{ backgroundColor: "#ededed" }}
                >
                  <Text style={{ color: "black", padding: 20 }}>
                    {item.value}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          {/* {props.children} */}
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

export default MenuModal;
