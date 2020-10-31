import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
// import {HEIGHT} from '../components/Items/'

const SearchBar = ({
  term,
  onTermChange,
  onTermSubmit,
  backgroundStyle,
  inputStyle,
  searchIconStyle,
  xIconStyle,
  onFocus,
  onBlur,
  placeholder,
  clear,
}) => {
  return (
    <View style={[styles.backgroundStyle, { ...backgroundStyle }]}>
      <Feather
        name="search"
        style={[styles.iconStyle, { ...searchIconStyle }]}
      />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.inputStyle, { ...inputStyle }]}
        placeholder={placeholder}
        placeholderTextColor="white"
        // multiline={true}
        value={term}
        onChangeText={(term) => {
          onTermChange(term);
          // onTermSubmit(term);
        }}
        onEndEditing={onTermSubmit}
        onFocus={() => onFocus()}
        onBlur={() => onBlur()}
      />
      <TouchableOpacity
        style={{ alignItems: "center", justifyContent: "center" }}
        onPress={() => {
          clear();
        }}
      >
        <Feather
          name="x"
          size={24}
          color="white"
          style={{ paddingRight: 10, ...xIconStyle }}
        />
      </TouchableOpacity>
    </View>
  );
};

SearchBar.defaultProps = {
  onBlur: () => console.log("onBlur fired"),
  onFocus: () => console.log("onFocus fired"),
};

const styles = StyleSheet.create({
  backgroundStyle: {
    marginTop: 10,
    backgroundColor: "#21D0E5",
    height: 60,
    // height:HEIGHT * 0.06,
    borderRadius: 5,
    marginHorizontal: 15,
    flexDirection: "row",
    marginBottom: 10,
  },
  inputStyle: {
    width: "70%",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  iconStyle: {
    fontSize: 20,
    alignSelf: "center",
    marginHorizontal: 15,
    color: "#e0eff2",
  },
});

export default SearchBar;
