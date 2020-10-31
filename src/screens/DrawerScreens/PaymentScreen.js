// import React, { PureComponent } from "react";
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
// } from "react-native";
// import { connect } from "react-redux";
// import * as actions from "../../actions";
// import { STRIPE_FRONT_KEY } from "../../key/";
// import stripe from "tipsi-stripe";

// stripe.setOptions({
//   publishableKey: STRIPE_FRONT_KEY,
// });
// import axios from "axios";

// import Header from "../../components/Header";
// import GlobalStyles from "../../components/GlobalStyles";
// import Button from "../../stripe/components/Button";
// //

// class CardFormScreen extends PureComponent {
//   static title = "Card Form";


//   state = {
//     loading: false,
//     token: null,
//   };

//   handleCardPayPress = async () => {
//     try {
//       this.setState({ loading: true, token: null });
//       const token = await stripe.paymentRequestWithCardForm({
//         // Only iOS support this options
//         smsAutofillDisabled: true,
//         requiredBillingAddressFields: "full",
//         prefilledInformation: {
//           billingAddress: {
//             name: "Gunilla Haugeh",
//             line1: "Canary Place",
//             line2: "3",
//             city: "Macon",
//             state: "Georgia",
//             country: "US",
//             postalCode: "31217",
//             email: "ghaugeh0@printfriendly.com",
//           },
//         },
//       });

//       this.setState({ loading: false, token });
//     } catch (error) {
//       this.setState({ loading: false });
//     }
//   };
//   makePayment = () => {
//     this.setState({ loading: true });
//     axios({
//       method: "POST",
//       url:
//         "https://us-central1-laundr-c9c10.cloudfunctions.net/completePaymentWithStripe",
//       data: {
//         amount: 35000, // divide by 100 and you get the correct amount. ex:  amount: 35000 =>  amount: 350.00
//         currency: "usd",
//         token: this.state.token,
//       },
//     }).then((response) => {
//       console.log("make payment response  :", response);
//       this.setState({ loading: false });
//     });
//   };

//   render() {
//     const { loading, token } = this.state;

//     return (
//       <SafeAreaView style={GlobalStyles.droidSafeArea}>
//         <Header openDrawer={this.() => props.navigation.navigate("Home")} name="Account" />

//         <View style={styles.container}>
//           <Text style={styles.header}>Card Form Example</Text>
//           <Text style={styles.instruction}>
//             Click button to show Card Form dialog.
//           </Text>
//           <Button
//             text="Enter you card and pay"
//             loading={loading}
//             onPress={this.handleCardPayPress}
//             // {...testID('cardFormButton')}
//           />
//           <View
//             style={styles.token}
//             // {...testID('cardFormToken')}
//           >
//             {token && (
//               <>
//                 <Text style={styles.instruction}>Token: {token.tokenId}</Text>
//                 <Button
//                   text="Make Payment"
//                   loading={loading}
//                   onPress={this.makePayment}
//                 />
//               </>
//             )}
//           </View>
//         </View>
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     fontSize: 20,
//     textAlign: "center",
//     margin: 10,
//   },
//   instruction: {
//     textAlign: "center",
//     color: "#333333",
//     marginBottom: 5,
//   },
//   token: {
//     height: 20,
//   },
// });

// function mapStateToProps({ auth, user }) {
//   return { token: auth.token, user };
// }

// export default connect(mapStateToProps, actions)(CardFormScreen);

