import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Share,
  Clipboard,
} from "react-native";
import {connect} from 'react-redux';

import GlobalStyles from "../../components/GlobalStyles";
import Container from "../../components/Container";
import Header from "../../components/Header";


import {
  BUTTON,
  FIELD_NAME_FONT_SIZE,
  FIELD_NAME_TEXT,
  FIELD_VALUE_TEXT,
} from "../../components/Items/";

const ReferralScreen = (props) => {
  const [code, setCode] = useState("dummyCode");
  const [email, setEmail] = useState();

  const copyToClipboard = () => {
    Clipboard.setString(code);
  };

  useEffect(() => {
    console.log("Referral screen loaded");
  }, []);

  const onShare = async () => {
    // NOTE: SOMETHING IS WRONG WITH HOW THE LINK DISPLAYS ON THE TEXT MESSAGE :(
    try {
      const result = await Share.share({
        message: `Try Laundr, an app for on-demand laundry service. https://www.laundr.io
          Use this promo code to get a $5 discount on your first order:
          "jcasasmail646"`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Header openDrawer={() => props.navigation.navigate("Home")} name="Referrals" />
      <Container>
        <Text style={FIELD_NAME_TEXT}>Share your referral code!</Text>
        <Text style={styles.bodyText}>
          Both you and your friend get a $10 off coupon when they use your promo
          code at sign up and place their first Laundr order!
        </Text>

        <Text style={[FIELD_VALUE_TEXT, { textAlign: "center" }]}>
          Your code
        </Text>

        <View style={styles.container_Code_Button}>
          <View style={styles.container_Code}>
            <Text style={styles.codeText}>{code}</Text>
          </View>
          <BUTTON
            text="Copy Code"
            onPress={copyToClipboard}
            style={{ width: "40%" }}
            textStyle={{ fontSize: FIELD_NAME_FONT_SIZE * 0.5 }}
          />
        </View>
      </Container>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <BUTTON
          textStyle={{ textAlign: "center" }}
          text="Share code with more humans!"
          onPress={onShare}
        />
      </View>
    </SafeAreaView>
  );
};

// styles.container_Code

const styles = StyleSheet.create({
  bodyText: {
    marginTop: 10,
    ...FIELD_VALUE_TEXT,
    fontWeight: "normal",
    marginBottom: 10,
  },
  container_Code_Button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ededed",
    borderColor: "#ededed",
    borderWidth: 1,
    borderRadius: 15,
  },
  container_Code: {
    marginRight: 20,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    padding: 4,
  },
  codeText: {
    fontWeight: "bold",
  },
});

// export default ReferralScreen;

function mapStateToProps({ auth }) {
  return { token: auth.token };
}

export default connect(mapStateToProps)(ReferralScreen);