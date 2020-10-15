// import React from "react";
// import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
// import KeyboardSpacer from "react-native-keyboard-spacer";
// import PaymentFormView from "./PaymentFormView";
// import Header from "./Header";
// import GlobalStyles from "./GlobalStyles";

// /**
//  * The class renders a view with PaymentFormView
//  */
// export default class AddSubscriptionView extends React.Component {
//   render() {
//     return (
//       <SafeAreaView style={GlobalStyles.droidSafeArea}>
//         <View style={styles.container}>
//           <ScrollView
//             style={styles.container}
//             ref={(ref) => (this.scrollViewRef = ref)}
//           >
//             <View style={styles.cardFormWrapper}>
//               <PaymentFormView {...this.props} />
//             </View>
//           </ScrollView>
//           {/* Scrolls to the payment form */}
//           <KeyboardSpacer
//             onToggle={() => {
//               setTimeout(
//                 () => this.scrollViewRef.scrollToEnd({ animated: true }),
//                 0
//               );
//             }}
//           />
//         </View>
//       </SafeAreaView>
//     );
//   }
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   textWrapper: {
//     margin: 10,
//   },
//   infoText: {
//     fontSize: 18,
//     textAlign: "center",
//   },
//   cardFormWrapper: {
//     padding: 10,
//     margin: 10,
//   },
// });
