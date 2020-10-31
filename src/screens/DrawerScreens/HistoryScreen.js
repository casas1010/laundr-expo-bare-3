// REVERSE ORDER IN HISTORY, MAKE IT SO IT GOES BY DATE IN ORDER

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  TouchableOpacityBase,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import GlobalStyles from "../../components/GlobalStyles";
import Header from "../../components/Header";
import Container from "../../components/Container";
import { DIVIDER } from "../../components/Items/";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { HEIGHT, WIDTH, SHADOW } from "../../components/Items/";

import { connect } from "react-redux";
import * as actions from "../../actions/index";

import SearchBar from "../../components/SearchBar";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BUTTON_WIDTH = SCREEN_WIDTH * 0.3;

// PULL ALLL IMAGES FROM HERE: https://www.britannica.com/science/human-muscle-system/The-abdomen

const SearchScreen = (props) => {
  const [term, setTerm] = useState("");
  const [DATA, SETDATA] = useState([]);
  const [count, setCount] = useState(1);

  useEffect(() => {
    console.log("SearchScreen");
    // console.log(props.history);

    modifyData();
    console.log(props.history[0]);
  }, []);

  const modifyData = () => {
    let newData = [];
    let uniqueCounter = 1;
    console.log("count prior to mod:  ", props.history.length);
    props.history.forEach((item) => {
      // console.log("element before being modified: ", item.orderInfo.created);
      item.orderInfo.orderID = "0" + uniqueCounter;
      // item.string = JSON.stringify(item).toLocaleLowerCase();
      // console.log("element after being modified: ", item.orderInfo.created);

      newData.push(item);
      uniqueCounter++;
    });

    SETDATA([...newData]);
  };

  const filterHistoriesByName = (name) => {
    name = name.toLowerCase();
    let localCount = 1;
    // console.log('localCount:  ',localCount)
    // console.log('filterHistoriesByName props.history.length:  ',props.history.length)
    return DATA.filter((item) => {
      // console.log('inside filter: localCount ',localCount);
      // localCount++

      if (item.string.includes(name)) {
        return item;
      }
    });
  };

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Header openDrawer={() => props.navigation.navigate("Home")} name="History" />

      <SearchBar
        term={term}
       
        onTermChange={setTerm}
        placeholder='Search History'

        onTermSubmit={() => {
          console.log(`term searched is ${term}`);
        }}
      />
      <>
        <FlatList
          horizontal={false}
          // extraData={props.history}
          showsHorizontalScrollIndicator={false}
          // data={DATA}
          // data={props.history}
          data={filterHistoriesByName(term)}
          keyExtractor={(item) => item.orderInfo.orderID}
          renderItem={({ item }) => {
            return (
              <>
                <Container style={{ padding: 0, position: "relative" }}>
                  {/*  */}
                  <View
                    style={[
                      styles.fieldContainer,
                      {
                        backgroundColor: "#5bcae2",
                        borderTopEndRadius: 15,
                        borderTopStartRadius: 15,
                        paddingTop: 16,
                        paddingBottom: 16,
                        position: "absolute",
                        top: -10,
                      },
                    ]}
                  >
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Order ID</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {item.orderInfo.orderID}
                      </Text>
                    </View>
                  </View>
                  {/*  */}

                  {/*  */}
                  <View style={[styles.fieldContainer, { paddingTop: 50 }]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Order Date</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {item.orderInfo.created.slice(0, 10)}
                        {/* {item.orderInfo.created} */}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldNameContainer}>
                      {/* <Text style={styles.fieldNameTxT}>{item.card.cardType}</Text> */}
                    </View>
                    <View style={styles.fieldValueContainer}>
                      {/* <Text style={styles.fieldValueTxT}>{item.card.charge}</Text> */}
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Status</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {item.orderInfo.status == "7"
                          ? "Cancelled"
                          : "Complete"}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  <DIVIDER />
                  {/*  */}
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Address</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <View style={{ flexDirection: "column" }}>
                        <View style={styles.addressCustomContainer}>
                          <Text style={styles.fieldValueTxT}>
                            {item.orderInfo.address}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Pick-Up Time</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <View style={{ flexDirection: "column" }}>
                        <Text style={styles.fieldValueTxT}>
                          {item.pickupInfo.date}
                        </Text>
                        <Text style={styles.fieldValueTxT}>
                          {item.pickupInfo.time}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Delivery Time</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {item.dropoffInfo.time}
                      </Text>
                      <Text style={styles.fieldValueTxT}>
                        {item.dropoffInfo.date}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  <DIVIDER />
                  {/*  */}
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Preference</Text>
                    </View>
                    <View
                      style={[
                        styles.fieldValueContainer,
                        { flexDirection: "column", alignItems: "flex-end" },
                      ]}
                    >
                      <Text style={styles.fieldValueTxT}>
                        {
                          (item.washerInfo.delicates = true
                            ? "delicates"
                            : null)
                        }
                      </Text>
                      <Text style={styles.fieldValueTxT}>
                        {(item.washerInfo.scented = true ? "scented" : null)}
                      </Text>
                      <Text style={styles.fieldValueTxT}>
                        {(item.washerInfo.separate = true ? "separate" : null)}
                      </Text>
                      <Text style={styles.fieldValueTxT}>
                        {
                          (item.washerInfo.towelsSheets = true
                            ? "towelsSheets"
                            : null)
                        }
                      </Text>
                      <Text style={styles.fieldValueTxT}>
                        {item.washerInfo.towelsSheets.prefs}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Weight</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {item.orderInfo.weight}
                      </Text>
                    </View>
                  </View>
          
                  {/*  */}
                  <DIVIDER />
                  {/*  */}
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Cost</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        $ {item.orderInfo.cost}
                      </Text>
                    </View>
                  </View>
                </Container>
              </>
            );
          }}
        />
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBoxContainer: {
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#f9f9f9",
    backgroundColor: "#f9f9f9",
    ...SHADOW,
  },
  icon: {
    width: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  addressTextInput: {
    width: "85%",
    height: 45,
    paddingLeft: 10,
  },
  fieldContainer: {
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 5,
  },
  fieldNameContainer: {
    width: "35%",
  },
  fieldNameTxT: {
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  fieldValueContainer: {
    width: "65%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  fieldValueTxT: {
    fontSize: 12,
    fontWeight: "bold",
    paddingRight: 10,
  },
  addressCustomContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  dividerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    width: "95%",
    backgroundColor: "grey",
  },
});

function mapStateToProps({ history }) {
  return { history };
}

export default connect(mapStateToProps, actions)(SearchScreen);
