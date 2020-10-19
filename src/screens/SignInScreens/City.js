import React, { Component, useState, useEffect } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  FlatList,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";



const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

//*
// note 1: discuss how to use auto size text: https://stackoverflow.com/questions/5033012/auto-scale-textview-text-to-fit-within-bounds
//*

const CITIES = [
  { label: "Narnia", value: "Narnia" },
  { label: "Gainsville", value: "Gainsville" },
  { label: "Orlando", value: "Orlando" },
];

const City = (props) => {
  useEffect(() => {
    console.log("City component loaded");
  }, []);

  return (
    <View style={styles.formContainer}>
      <Text style={styles.text}>Select Your City:</Text>
      <MenuModal
        title="Select City Type"
        setCardTypeHelper={setCityHelper}
        showModal={showModalCity}
        modalView={CityModalView}
        data={CityTYPES}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 15,
    flex: 1,
    margin: WIDTH * 0.06,
    padding: 5,
    width: WIDTH * 0.88,
  },
  text: {
    fontSize: 45,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ebebeb",
    borderRadius: 4,
    color: "black",
    backgroundColor: "#f4f4f4",
    marginTop: 15,
    width: 120,
    height: 40,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "#ebebeb",
    borderRadius: 8,
    color: "black",
    backgroundColor: "#f4f4f4",
    marginTop: 15,

    width: 120,
    height: 40,
    marginBottom: 5,
  },
});

export default City;

// import React, { Component, useState, useEffect } from "react";
// import {
//   Button,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   FlatList,
//   Text,
//   TextInput,
//   TouchableWithoutFeedback,
//   View,
//   TouchableOpacity,
//   Dimensions,
//   Image,
// } from "react-native";
// import RNPickerSelect from "react-native-picker-select";
// import { Picker } from "@react-native-community/picker";

// const WIDTH = Dimensions.get("window").width;
// const HEIGHT = Dimensions.get("window").height;

// //*
// // note 1: discuss how to use auto size text: https://stackoverflow.com/questions/5033012/auto-scale-textview-text-to-fit-within-bounds
// //*

// const CITIES = [
//   { label: "Narnia", value: "Narnia" },
//   { label: "Gainsville", value: "Gainsville" },
//   { label: "Orlando", value: "Orlando" },
// ];

// const City = (props) => {
//   const [cityModalView, setCityModalView] = useState(false);
//   // const [userType, setUserType] = useState("User");

//   useEffect(() => {
//     console.log("City component loaded");
//   }, []);

//   return (
//     <View style={styles.formContainer}>
//       {/* note 1 */}
//       <Text style={styles.text}>Select Your City:</Text>

// <MenuModal
//   title="Select City Type"
//   setCardTypeHelper={setCityHelper}
//   showModal={showModalCity}
//   modalView={CityModalView}
//   data={CityTYPES}
// />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   formContainer: {
//     backgroundColor: "white",
//     borderColor: "white",
//     borderWidth: 1,
//     borderRadius: 15,
//     flex: 1,
//     margin: WIDTH * 0.06,
//     padding: 5,
//     width: WIDTH * 0.88,
//   },
//   text: {
//     fontSize: 45,
//   },
// });

// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     fontSize: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderColor: "#ebebeb",
//     borderRadius: 4,
//     color: "black",
//     backgroundColor: "#f4f4f4",
//     marginTop: 15,
//     width: 120,
//     height: 40,
//   },
//   inputAndroid: {
//     fontSize: 16,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderWidth: 0.5,
//     borderColor: "#ebebeb",
//     borderRadius: 8,
//     color: "black",
//     backgroundColor: "#f4f4f4",
//     marginTop: 15,

//     width: 120,
//     height: 40,
//     marginBottom: 5,
//   },
// });

// export default City;
