import React, { useEffect, useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
// FUTURE IMPROVEMENT
import Header from "../../components/Header";

const DATA = [
  {
    orderId: "1307",
    orderDate: "09/18/2020",
    status: "Cancelled",
    address: {
      street: "978 SW 2n Ave",
      city: "Gainsville",
      state: "FL",
      zipCode: "32601",
      country: "USA",
    },
    pickUpData: { date: "09/18/2020", time: "7:34:29 PM" },
    deliveryTime: "",
    preference: "Delicates",
    weight: "30.00 lbs",
    card: { cardType: "Visa", charge: "$3.00" },
  },
  {
    orderId: "999",
    orderDate: "09/18/2020",
    status: "Cancelled",
    address: {
      street: "978 SW 2n Ave",
      city: "Gainsville",
      state: "FL",
      zipCode: "32601",
      country: "USA",
    },
    pickUpData: { date: "09/18/2020", time: "7:34:29 PM" },
    deliveryTime: "",
    preference: "Delicates",
    weight: "30.00 lbs",
    card: { cardType: "Visa", charge: "$3.00" },
  },
];

const DIVIDER = () => {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.divider} />
    </View>
  );
};

const OrderDetailsScreen = (props) => {
  return (
    <View>
      <Header openDrawer={() => props.navigation.navigate("Home")} name="History" />
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.orderId}
        horizontal={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          return (
            <View style={styles.cardContainer}>
              {/*  */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldNameContainer}>
                  <Text style={styles.fieldNameTxT}>Order ID</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValueTxT}>{item.orderId}</Text>
                </View>
              </View>
              {/*  */}
              <DIVIDER />
              {/*  */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldNameContainer}>
                  <Text style={styles.fieldNameTxT}>Order Date</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValueTxT}>{item.orderDate}</Text>
                </View>
              </View>
              {/*  */}
              {/*  */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldNameContainer}>
                  <Text style={styles.fieldNameTxT}>Status</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValueTxT}>{item.status}</Text>
                </View>
              </View>
              {/*  */}
              {/*  */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldNameContainer}>
                  <Text style={styles.fieldNameTxT}>Address</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <View style={{ flexDirection: "column" }}>
                    <View style={styles.addressCustomContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {item.address.street}
                      </Text>
                    </View>

                    <View style={styles.addressCustomContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {item.address.city},{item.address.state},
                        {item.address.zipCode}
                      </Text>
                    </View>

                    <View style={styles.addressCustomContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {item.address.country}
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
                      {item.pickUpData.date}
                    </Text>
                    <Text style={styles.fieldValueTxT}>
                      {item.pickUpData.time}
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
                  <Text style={styles.fieldValueTxT}>{item.deliveryTime}</Text>
                </View>
              </View>
              {/*  */}
              <DIVIDER />
              {/*  */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldNameContainer}>
                  <Text style={styles.fieldNameTxT}>Preference</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValueTxT}>{item.preference}</Text>
                </View>
              </View>
              {/*  */}
              {/*  */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldNameContainer}>
                  <Text style={styles.fieldNameTxT}>Weight</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValueTxT}>{item.weight}</Text>
                </View>
              </View>
              {/*  */}
              {/*  */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldNameContainer}>
                  <Text style={styles.fieldNameTxT}>{item.card.cardType}</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValueTxT}>{item.card.charge}</Text>
                </View>
              </View>
              {/*  */}
              {/*  */}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 15,
    margin: WIDTH * 0.06,
    paddingTop: 10,
    paddingBottom: 10,
    width: WIDTH * 0.88,
  },
  fieldContainer: {
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 5,
    // height: 17,
  },
  fieldNameContainer: {
    // backgroundColor: "red",
    width: "35%",
  },
  fieldNameTxT: {
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  fieldValueContainer: {
    // backgroundColor: "green",
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
export default OrderDetailsScreen;
