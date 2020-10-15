import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Image,
  Easing,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  FIELD_VALUE_FONT_SIZE,
  FIELD_NAME_TEXT,
  HEIGHT,
  WIDTH,
} from "../components/Items/";

const SAME_HEIGHT = HEIGHT * 0.05;
const Header = (props) => {
  useEffect(() => {
    console.log("Header loaded");
  }, []);

  const value = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];

  useEffect(() => {
    moveBar();
  }, []);

  function moveBar() {
    Animated.timing(value, {
      toValue: { x: -WIDTH, y: 0 },
      duration: 20000,
      useNativeDriver: false,
      easing: Easing.cubic,
    }).start(() => {
      Animated.timing(value, {
        toValue: { x: 0, y: 0 },
        duration: 20000,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start(() => {
        moveBar();
      });
    });
  }

  return (
    <View style={[styles.container]}>
      <View
        style={{
          top: -50,
          height: 50,
          width: WIDTH,
          position: "absolute",
          backgroundColor: "#21D0E5",
        }}
      />
      <Animated.View style={value.getLayout()}>
        <Image
          source={require("../assets/sectionBorderWhite.png")}
          style={{
            width: WIDTH * 2,
            zIndex: -4,
            position: "absolute",
            left: 0,
            height: SAME_HEIGHT
          }}
        />
         </Animated.View>
          <TouchableOpacity
            style={styles.container_Button}
            onPress={() => props.openDrawer()}
          >
            <Icon
              name="arrow-left"
              color={"black"}
              size={SAME_HEIGHT}
              style={{ top: -2 }}
            />
          </TouchableOpacity>

          <View style={styles.container_Text}>
            <Text style={FIELD_NAME_TEXT}>{props.name}</Text>
          </View>
       
     
    </View>
  );
};
Header.defaultProps = {
  name: "default",
};

const styles = StyleSheet.create({
  container: {
    height: SAME_HEIGHT,
    width: WIDTH,
    backgroundColor: "#5bcae2",
    flexDirection: "row",
    position: "relative",
  },
  image: {
    // flex: 1,
    width: "100%",
    // resizeMode: "cover",
    // justifyContent: "center",
    flexDirection: "row",
  },
  container_Button: {
    position: "absolute",
    left: 10,
    zIndex: 2,
  },
  container_Text: {
    justifyContent: "center",
    alignItems: "center",
    width: WIDTH,
  },
});

export default Header;

// const App = (props) => (
//   <View style={styles.container}>
// <ImageBackground
//   source={require("../assets/sectionBorderWhite.png")}
//   style={styles.image}
// >
//       <TouchableOpacity
//         style={styles.container_Button}
//         onPress={() => {
//           props.openDrawer();
//           console.log("prerere");
//         }}
//       >
//         <Icon
//           name="arrow-left"
//           color={"black"}
//           size={SAME_HEIGHT}
//           style={{ top: -2 }}
//         />
//       </TouchableOpacity>
//       <View style={styles.container_Text}>
//         <Text style={FIELD_NAME_TEXT}>{props.name}</Text>
//       </View>
//     </ImageBackground>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     height: SAME_HEIGHT,
//     width: "100%",
//     // backgroundColor: "#5bcae2",
//     backgroundColor: "red",
//     flexDirection: "row",
//     position: "relative",
//   },
// image: {
//   // flex: 1,
//   width: "100%",
//   // resizeMode: "cover",
//   // justifyContent: "center",
//   flexDirection: "row",
// },
//   text: {
//     color: "grey",
//     fontSize: 30,
//     fontWeight: "bold",
//   },
//   container_Button: {
//     position: "absolute",
//     left: 10,
//     zIndex: 2,
//     backgroundColor: "red",
//   },
//   container_Text: {
//     justifyContent: "center",
//     alignItems: "center",
//     width: WIDTH,
//     zIndex: 5,
//   },
// });

// export default App;













/// NEW 











// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ImageBackground,
//   Animated,
//   Easing,
// } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import {
//   FIELD_VALUE_FONT_SIZE,
//   FIELD_NAME_TEXT,
//   HEIGHT,
//   WIDTH,
// } from "../components/Items/";

// const SAME_HEIGHT = HEIGHT * 0.05;
// const Header = (props) => {
//   useEffect(() => {
//     console.log("Header loaded");
//   }, []);

//   const value = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];

//   useEffect(() => {
//     moveBar();
//   }, []);

//   function moveBar() {
//     Animated.timing(value, {
//       toValue: { x: -WIDTH, y: 0 },
//       duration: 20000,
//       useNativeDriver: false,
//       easing: Easing.cubic,
//     }).start(() => {
//       Animated.timing(value, {
//         toValue: { x: 0, y: 0 },
//         duration: 20000,
//         useNativeDriver: false,
//         easing: Easing.linear,
//       }).start(() => {
//         moveBar();
//       });
//     });
//   }

//   return (
//     <View style={[styles.container]}>
//       <View
//         style={{
//           top: -50,
//           height: 50,
//           width: WIDTH,
//           position: "absolute",
//           backgroundColor: "#21D0E5",
//         }}
//       />
//       <Animated.View style={value.getLayout()}>
//         <ImageBackground
//           source={require("../assets/sectionBorderWhite.png")}
//           style={styles.image}
//         >
//           <TouchableOpacity
//             style={styles.container_Button}
//             onPress={() => props.openDrawer()}
//           >
//             <Icon
//               name="arrow-left"
//               color={"black"}
//               size={SAME_HEIGHT}
//               style={{ top: -2 }}
//             />
//           </TouchableOpacity>

//           <View style={styles.container_Text}>
//             <Text style={FIELD_NAME_TEXT}>{props.name}</Text>
//           </View>
//         </ImageBackground>
//       </Animated.View>
//     </View>
//   );
// };
// Header.defaultProps = {
//   name: "default",
// };

// const styles = StyleSheet.create({
//   container: {
//     height: SAME_HEIGHT,
//     width: WIDTH,
//     backgroundColor: "#5bcae2",
//     flexDirection: "row",
//     position: "relative",
//   },
//   image: {
//     // flex: 1,
//     width: "100%",
//     // resizeMode: "cover",
//     // justifyContent: "center",
//     flexDirection: "row",
//   },
//   container_Button: {
//     position: "absolute",
//     left: 10,
//     zIndex: 2,
//   },
//   container_Text: {
//     justifyContent: "center",
//     alignItems: "center",
//     width: WIDTH,
//   },
// });

// export default Header;

// // const App = (props) => (
// //   <View style={styles.container}>
// // <ImageBackground
// //   source={require("../assets/sectionBorderWhite.png")}
// //   style={styles.image}
// // >
// //       <TouchableOpacity
// //         style={styles.container_Button}
// //         onPress={() => {
// //           props.openDrawer();
// //           console.log("prerere");
// //         }}
// //       >
// //         <Icon
// //           name="arrow-left"
// //           color={"black"}
// //           size={SAME_HEIGHT}
// //           style={{ top: -2 }}
// //         />
// //       </TouchableOpacity>
// //       <View style={styles.container_Text}>
// //         <Text style={FIELD_NAME_TEXT}>{props.name}</Text>
// //       </View>
// //     </ImageBackground>
// //   </View>
// // );

// // const styles = StyleSheet.create({
// //   container: {
// //     height: SAME_HEIGHT,
// //     width: "100%",
// //     // backgroundColor: "#5bcae2",
// //     backgroundColor: "red",
// //     flexDirection: "row",
// //     position: "relative",
// //   },
// // image: {
// //   // flex: 1,
// //   width: "100%",
// //   // resizeMode: "cover",
// //   // justifyContent: "center",
// //   flexDirection: "row",
// // },
// //   text: {
// //     color: "grey",
// //     fontSize: 30,
// //     fontWeight: "bold",
// //   },
// //   container_Button: {
// //     position: "absolute",
// //     left: 10,
// //     zIndex: 2,
// //     backgroundColor: "red",
// //   },
// //   container_Text: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //     width: WIDTH,
// //     zIndex: 5,
// //   },
// // });

// // export default App;























































// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ImageBackground,
//   Animated,
//   Easing,
// } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import {
//   FIELD_VALUE_FONT_SIZE,
//   FIELD_NAME_TEXT,
//   HEIGHT,
//   WIDTH,
// } from "../components/Items/";

// const SAME_HEIGHT = HEIGHT * 0.05;
// const Header = (props) => {
//   useEffect(() => {
//     console.log("Header loaded");
//   }, []);

//   const value = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];

//   useEffect(() => {
//     moveBar();
//   }, []);

//   function moveBar() {
//     Animated.timing(value, {
//       toValue: { x: -WIDTH, y: 0 },
//       duration: 20000,
//       useNativeDriver: false,
//       easing: Easing.cubic,
//     }).start(() => {
//       Animated.timing(value, {
//         toValue: { x: 0, y: 0 },
//         duration: 20000,
//         useNativeDriver: false,
//         easing: Easing.linear,
//       }).start(() => {
//         moveBar();
//       });
//     });
//   }

//   return (
//     <View style={[styles.container]}>
//       <View
//         style={{
//           top: -50,
//           height: 50,
//           width: WIDTH,
//           position: "absolute",
//           backgroundColor: "#21D0E5",
//         }}
//       />
//       <Animated.View style={value.getLayout()}>
//         <ImageBackground
//           source={require("../assets/sectionBorderWhite.png")}
//           style={styles.image}
//         >
//           <TouchableOpacity
//             style={styles.container_Button}
//             onPress={() => props.openDrawer()}
//           >
//             <Icon
//               name="arrow-left"
//               color={"black"}
//               size={SAME_HEIGHT}
//               style={{ top: -2 }}
//             />
//           </TouchableOpacity>

//           <View style={styles.container_Text}>
//             <Text style={FIELD_NAME_TEXT}>{props.name}</Text>
//           </View>
//         </ImageBackground>
//       </Animated.View>
//     </View>
//   );
// };
// Header.defaultProps = {
//   name: "default",
// };

// const styles = StyleSheet.create({
//   container: {
//     height: SAME_HEIGHT,
//     width: WIDTH,
//     backgroundColor: "#5bcae2",
//     flexDirection: "row",
//     position: "relative",
//   },
//   image: {
//     // flex: 1,
//     width: "100%",
//     // resizeMode: "cover",
//     // justifyContent: "center",
//     flexDirection: "row",
//   },
//   container_Button: {
//     position: "absolute",
//     left: 10,
//     zIndex: 2,
//   },
//   container_Text: {
//     justifyContent: "center",
//     alignItems: "center",
//     width: WIDTH,
//   },
// });

// export default Header;

// // const App = (props) => (
// //   <View style={styles.container}>
// // <ImageBackground
// //   source={require("../assets/sectionBorderWhite.png")}
// //   style={styles.image}
// // >
// //       <TouchableOpacity
// //         style={styles.container_Button}
// //         onPress={() => {
// //           props.openDrawer();
// //           console.log("prerere");
// //         }}
// //       >
// //         <Icon
// //           name="arrow-left"
// //           color={"black"}
// //           size={SAME_HEIGHT}
// //           style={{ top: -2 }}
// //         />
// //       </TouchableOpacity>
// //       <View style={styles.container_Text}>
// //         <Text style={FIELD_NAME_TEXT}>{props.name}</Text>
// //       </View>
// //     </ImageBackground>
// //   </View>
// // );

// // const styles = StyleSheet.create({
// //   container: {
// //     height: SAME_HEIGHT,
// //     width: "100%",
// //     // backgroundColor: "#5bcae2",
// //     backgroundColor: "red",
// //     flexDirection: "row",
// //     position: "relative",
// //   },
// // image: {
// //   // flex: 1,
// //   width: "100%",
// //   // resizeMode: "cover",
// //   // justifyContent: "center",
// //   flexDirection: "row",
// // },
// //   text: {
// //     color: "grey",
// //     fontSize: 30,
// //     fontWeight: "bold",
// //   },
// //   container_Button: {
// //     position: "absolute",
// //     left: 10,
// //     zIndex: 2,
// //     backgroundColor: "red",
// //   },
// //   container_Text: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //     width: WIDTH,
// //     zIndex: 5,
// //   },
// // });

// // export default App;













// /// NEW 











// // import React, { useEffect, useState } from "react";
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TouchableOpacity,
// //   ImageBackground,
// //   Animated,
// //   Easing,
// // } from "react-native";
// // import Icon from "react-native-vector-icons/FontAwesome";
// // import {
// //   FIELD_VALUE_FONT_SIZE,
// //   FIELD_NAME_TEXT,
// //   HEIGHT,
// //   WIDTH,
// // } from "../components/Items/";

// // const SAME_HEIGHT = HEIGHT * 0.05;
// // const Header = (props) => {
// //   useEffect(() => {
// //     console.log("Header loaded");
// //   }, []);

// //   const value = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];

// //   useEffect(() => {
// //     moveBar();
// //   }, []);

// //   function moveBar() {
// //     Animated.timing(value, {
// //       toValue: { x: -WIDTH, y: 0 },
// //       duration: 20000,
// //       useNativeDriver: false,
// //       easing: Easing.cubic,
// //     }).start(() => {
// //       Animated.timing(value, {
// //         toValue: { x: 0, y: 0 },
// //         duration: 20000,
// //         useNativeDriver: false,
// //         easing: Easing.linear,
// //       }).start(() => {
// //         moveBar();
// //       });
// //     });
// //   }

// //   return (
// //     <View style={[styles.container]}>
// //       <View
// //         style={{
// //           top: -50,
// //           height: 50,
// //           width: WIDTH,
// //           position: "absolute",
// //           backgroundColor: "#21D0E5",
// //         }}
// //       />
// //       <Animated.View style={value.getLayout()}>
// //         <ImageBackground
// //           source={require("../assets/sectionBorderWhite.png")}
// //           style={styles.image}
// //         >
// //           <TouchableOpacity
// //             style={styles.container_Button}
// //             onPress={() => props.openDrawer()}
// //           >
// //             <Icon
// //               name="arrow-left"
// //               color={"black"}
// //               size={SAME_HEIGHT}
// //               style={{ top: -2 }}
// //             />
// //           </TouchableOpacity>

// //           <View style={styles.container_Text}>
// //             <Text style={FIELD_NAME_TEXT}>{props.name}</Text>
// //           </View>
// //         </ImageBackground>
// //       </Animated.View>
// //     </View>
// //   );
// // };
// // Header.defaultProps = {
// //   name: "default",
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     height: SAME_HEIGHT,
// //     width: WIDTH,
// //     backgroundColor: "#5bcae2",
// //     flexDirection: "row",
// //     position: "relative",
// //   },
// //   image: {
// //     // flex: 1,
// //     width: "100%",
// //     // resizeMode: "cover",
// //     // justifyContent: "center",
// //     flexDirection: "row",
// //   },
// //   container_Button: {
// //     position: "absolute",
// //     left: 10,
// //     zIndex: 2,
// //   },
// //   container_Text: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //     width: WIDTH,
// //   },
// // });

// // export default Header;

// // // const App = (props) => (
// // //   <View style={styles.container}>
// // // <ImageBackground
// // //   source={require("../assets/sectionBorderWhite.png")}
// // //   style={styles.image}
// // // >
// // //       <TouchableOpacity
// // //         style={styles.container_Button}
// // //         onPress={() => {
// // //           props.openDrawer();
// // //           console.log("prerere");
// // //         }}
// // //       >
// // //         <Icon
// // //           name="arrow-left"
// // //           color={"black"}
// // //           size={SAME_HEIGHT}
// // //           style={{ top: -2 }}
// // //         />
// // //       </TouchableOpacity>
// // //       <View style={styles.container_Text}>
// // //         <Text style={FIELD_NAME_TEXT}>{props.name}</Text>
// // //       </View>
// // //     </ImageBackground>
// // //   </View>
// // // );

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     height: SAME_HEIGHT,
// // //     width: "100%",
// // //     // backgroundColor: "#5bcae2",
// // //     backgroundColor: "red",
// // //     flexDirection: "row",
// // //     position: "relative",
// // //   },
// // // image: {
// // //   // flex: 1,
// // //   width: "100%",
// // //   // resizeMode: "cover",
// // //   // justifyContent: "center",
// // //   flexDirection: "row",
// // // },
// // //   text: {
// // //     color: "grey",
// // //     fontSize: 30,
// // //     fontWeight: "bold",
// // //   },
// // //   container_Button: {
// // //     position: "absolute",
// // //     left: 10,
// // //     zIndex: 2,
// // //     backgroundColor: "red",
// // //   },
// // //   container_Text: {
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     width: WIDTH,
// // //     zIndex: 5,
// // //   },
// // // });

// // // export default App;
