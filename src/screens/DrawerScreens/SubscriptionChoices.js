// MAKE A LOADING SCREEN
/*

if status === active || status === cancelled : show screen with subscription details
else : show current screen





*/

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import * as actions from "../../actions";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import GlobalStyles from "../../components/GlobalStyles";
import Container from "../../components/Container";
import {
  BUTTON,
  FIELD_VALUE_FONT_SIZE,
  FIELD_NAME_FONT_SIZE,
  WIDTH,
  FIELD_VALUE_TEXT,
  FIELD_NAME_TEXT,
} from "../../components/Items/";
import { PLANS } from "../../components/Data";

const SubscriptionsChoices = (props) => {
  const [itemsIconColor, setItemsIconColor] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState();

  useEffect(() => {
    console.log("SubscriptionsChoices loaded");
    setItemsColor();
    setLoading(false);
  }, []);

  const setItemsColor = () => {
    console.log("Setting the colors");
    let arr = {};

    for (element of PLANS) {
      let ele = {
        iconColorDisplay: "transparent",
      };

      arr[element.name] = ele;
    }
    // console.log('setItemsColor() arr:   ',arr)
    setItemsIconColor({ ...arr });
  };

  const toggleItemInCart = (item) => {
    let itemInCart = null;

    if (!props.cart.length) {
      console.log("first item in the cart");
      itemInCart = item;
      props.addItemToCart(item);
    } else if (item.name === props.cart[0].name) {
      console.log("item is duplicate, removing item from cart");
      props.removeItemFromCart(item);
    } else {
      props.removeItemFromCart(props.cart[0]);
      props.addItemToCart(item);
      itemInCart = item;
    }
    toggleIconColor(itemInCart);
    console.log("Cart: ", itemInCart);
  };

  const toggleIconColor = (item) => {
    let obj = { ...itemsIconColor };

    for (itemName in obj) {
      if (item === null) {
        //   console.log('shopping cart empty')
        obj[itemName]["iconColorDisplay"] = "transparent";
        // console.log('item:  ',itemName)
        // console.log(' icon color for  not-match item is :', obj[itemName]['iconColorDisplay']);
      } else if (itemName == item.name) {
        // console.log('match name: ', itemName);
        // console.log('old icon color for the match item is :', obj[itemName]['iconColorDisplay']);
        obj[itemName]["iconColorDisplay"] = "black";
        // console.log('new icon color for the match item is :', obj[itemName]['iconColorDisplay']);
      } else {
        obj[itemName]["iconColorDisplay"] = "transparent";
        // console.log('item:  ',itemName)
        // console.log(' icon color for  not-match item is :', obj[itemName]['iconColorDisplay']);
      }
    }
  };

  const checkoutButton = () => {
    if (props.cart.length) {
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <BUTTON
            style={{ backgroundColor: "green" }}
            onPress={() => {
              console.log(props.cart);
              props.navigation.navigate("Payment");
            }}
            text="Proceed to checkout"
          />
        </View>
      );
    }
    return null;
  };

  const viewDecider = () => {
    const { subscription } = props;
    console.log("subscription.status:  ", subscription.status);
    if (
      subscription.status === "Active" ||
      subscription.status === "Cancelled"
    ) {
      setView(1);
      return;
    }
    setView(2)
  };

  return loading ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader />
    </View>
  ) : (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Header openDrawer={() => props.navigation.navigate("Home")} name="Subscriptions" />
      <FlatList
        horizontal={false}
        data={PLANS}
        ListFooterComponent={checkoutButton}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          if (item.name !== "Student") {
            return (
              <TouchableOpacity
                onPress={() => {
                  toggleItemInCart(item);
                  console.log(itemsIconColor[item.name]["iconColorDisplay"]);
                }}
              >
                <Container
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Icon
                    name="check"
                    color={itemsIconColor[item.name]["iconColorDisplay"]}
                    size={36}
                    style={{ position: "absolute", left: "5%" }}
                  />

                  <Text style={FIELD_NAME_TEXT}>{item.name}</Text>
                  <Text
                    style={[
                      FIELD_VALUE_TEXT,
                      { textAlign: "center", color: "#01c9e2" },
                    ]}
                  >
                    ${item.price} /Week
                  </Text>
                  <Text style={styles.cardDetails}>
                    {item.weight} lbs monthly
                  </Text>
                </Container>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              style={styles.studentCardContainer}
              onPress={() => toggleItemInCart(item)}
            >
              <Icon
                name="check"
                color={itemsIconColor[item.name]["iconColorDisplay"]}
                size={36}
                style={{ position: "absolute", left: "5%" }}
              />
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text style={styles.footerTitle}>Student</Text>
                <Text style={[styles.footerDetails]}>{item.price}/wk</Text>
                <Text style={[styles.footerDetails]}>
                  with valid student ID
                </Text>
              </View>

              <View style={styles.studentImageContainer}>
                <Image
                  style={styles.studentImage}
                  resizeMode="contain"
                  source={require("../../assets/Minimalist.png")}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardPrice: {
    fontWeight: "bold",
    color: "#01c9e2",
    fontSize: 15,
  },
  cardDetails: {},
  studentCardContainer: {
    backgroundColor: "#01c9e2",
    borderColor: "#01c9e2",
    borderWidth: 1,
    borderRadius: 15,
    margin: WIDTH * 0.06,
    width: WIDTH * 0.88,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  innerFooter: {},
  footerTitle: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
  },
  footerDetails: {},
  studentImageContainer: {
    width: "30%",
    height: 90,
  },
  studentImage: {
    height: "100%",
    width: "100%",
  },
  checkoutButton: {
    backgroundColor: "red",
    height: 80,
    width: 80,
    borderRadius: 80,
    backgroundColor: "green",
  },
});

function mapStateToProps({ cart, subscription }) {
  return { cart, subscription };
}

export default connect(mapStateToProps, actions)(SubscriptionsChoices);
