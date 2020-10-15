import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "../screens/DrawerScreens/HomeScreen";
import AccountScreen from "../screens/DrawerScreens/AccountScreen";
import HistoryScreen from "../screens/DrawerScreens/HistoryScreen";
import NotificationsScreen from "../screens/DrawerScreens/NotificationsScreen";
import ReferralScreen from "../screens/DrawerScreens/ReferralScreen";
// import PaymentScreen from "../screens/DrawerScreens/PaymentScreen";
import SubscriptionsScreen from "../screens/DrawerScreens/SubscriptionsScreen";
import HelpScreen from "../screens/DrawerScreens/HelpScreen";
import OrderDetailsScreen from "../screens/DrawerScreens/OrderDetailsScreen";

import DrawerContent from "../screens/DrawerScreens/DrawerContent";
import ChangePasswordScreen from "../screens/DrawerScreens/ChangePasswordScreen";
import NewOrderScreen from "../screens/DrawerScreens/NewOrderScreen";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Drawer.Screen name='New Order Screen' component={NewOrderScreen} />
      <Drawer.Screen name="History" component={HistoryScreen} />
      <Drawer.Screen name="Order Details" component={OrderDetailsScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Referrals" component={ReferralScreen} />
      {/* <Drawer.Screen name="Payment" component={PaymentScreen} /> */}
      <Drawer.Screen name="Subscriptions" component={SubscriptionsScreen} />
      <Drawer.Screen name="Help" component={HelpScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
