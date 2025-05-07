import { Tabs, useRouter } from "expo-router";
import React from "react";
import TabBar from "@/components/TabBar";
import { View, StyleSheet, Pressable } from "react-native";
import * as Animatable from "react-native-animatable";

import bot from "../../../assets/images/chatbot.png";
const TabLayout = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false, tabBarShowLabel: false }}
      >
        <Tabs.Screen name="index" options={{ headerShown: false }} />
        <Tabs.Screen name="cart" />
        <Tabs.Screen name="addApartment" />
        <Tabs.Screen name="explore" />
        <Tabs.Screen name="approve" />
        <Tabs.Screen name="amount" />
        <Tabs.Screen name="profile" />

      </Tabs>

      <Pressable
        style={styles.floatingButton}
        onPress={() => router.push("../../screens/chatbot")}
      >
        <Animatable.Image
          animation="tada"
          iterationCount="infinite"
          duration={2000}
          source={bot}
          style={{ width: 35, height: 35 }}
        />
      </Pressable>
    </View>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#4DA674",
    borderRadius: 50,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
