import React, { useState, useEffect } from "react";
import { View, AsyncStorage, Image, Text } from "react-native";
import _ from "lodash";
// import { AppLoading } from "expo";
import {
  HEIGHT,
  WIDTH,
  KEYBOARD_AWARE_SCROLL_VIEW_STYLE,
} from "../../components/Items/";
import Loader from "../../components/Loader";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import * as actions from "../../actions/";

const AuthScreen = (props) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function locationAndTokenFlow() {
      await props.getUserLocation();
    }
    locationAndTokenFlow();
    props.doAuthLogin(props);
  }, []);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        ...KEYBOARD_AWARE_SCROLL_VIEW_STYLE,
      }}
    >
      <Animatable.View
        animation="zoomIn"
        iterationCount={1}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </Animatable.View>
    </View>
  );
};

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps, actions)(AuthScreen);

/// old stable version

// import React, { useState, useEffect } from "react";
// import { View, AsyncStorage, Image } from "react-native";
// import _ from "lodash";
// // import { AppLoading } from "expo";
// import {
//   HEIGHT,
//   WIDTH,
//   KEYBOARD_AWARE_SCROLL_VIEW_STYLE,
// } from "../../components/Items/";
// import Loader from "../../components/Loader";

// import { connect } from "react-redux";
// import * as actions from "../../actions/";
// import {
//   getUserLocation,
//   getAddressFromLatLong,
// } from "../../components/LocationHelperFunctions/";

// const AuthScreen = (props) => {
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     console.log("AuthScreen useEffect()");
//     startFlow();
//   }, []);

//   const startFlow = async () => {
//     const userLocation = await getUserLocation();
//     props.getUsersLatLong(userLocation); //update store
//     console.log("userLocation: ", userLocation);

//     const getUserAddress = await getAddressFromLatLong(
//       userLocation.latitude,
//       userLocation.longitude
//     );
//     props.getUserAddressFromLatLong(getUserAddress); //update store
//     console.log("getUserAddress: ", getUserAddress);
//     checkToken();
//   };

//   const checkToken = async () => {
//     console.log("checkToken()");
//     console.log("Checking Token initiated");
//     let token = await AsyncStorage.getItem("token");
//     console.log("token1:  ", token);
//     if (token) {
//       console.log("Token is present");
//       setToken(token);
//       setTimeout(() => {
//         console.log("navigating user to drawer");
//         props.navigation.navigate("drawer");
//       }, 3000);
//     } else {
//       console.log("Token is not present");
//       setToken(false);
//       props.navigation.navigate("welcome");
//     }
//   };

//   if (_.isNull(token)) {
//     // console.log("_.isNull(token): ", _.isNull(token));
//     console.log("returning Loader");
//     return (
//       <View
//         style={{
//           alignItems: "center",
//           justifyContent: "center",
//           ...KEYBOARD_AWARE_SCROLL_VIEW_STYLE,
//         }}
//       >
//         <Loader />
//       </View>
//     );
//   }
//   return <View><Loader /> </View>;
// };

// function mapStateToProps({ user }) {
//   return { user };
// }

// export default connect(mapStateToProps, actions)(AuthScreen);
