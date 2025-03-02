import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  Button,
} from "react-native";
const pic1 = require("../../assets/images/homepic1.jpg");
const pic2 = require("../../assets/images/homepic2.jpg");
const pic3 = require("../../assets/images/homepic3.jpg");
const pic4 = require("../../assets/images/homepic4.jpg");
import { useRouter } from "expo-router";

export default function index() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, [index]);
  const images = [pic1, pic2, pic3, pic4];
  return (
    <View style={styles.cont}>
      <Text style={styles.text}>HOMY</Text>
      <ScrollView>
        <Text style={styles.head}>
          {" "}
          Find the Perfect Apartment for Students
        </Text>
        <Image
          source={images[index]}
          style={{ width: 400, height: 400, marginBottom: 30 }}
        />

        <Text style={styles.h2}>
          Looking for a comfortable and affordable place to stay? Homy makes
          apartment hunting easy for students! Whether you need a shared space
          or a private room, we connect you with the best housing options near
          your university.
        </Text>
        <Text style={styles.ss}> Why Choose Homy?</Text>
        <Text style={styles.s1}> 1: Student-Friendly Listings</Text>
        <Text style={styles.s1}> 2: Smart Search Filters</Text>
        <Text style={styles.s1}> 3: Roommate Matching </Text>
        <Text style={styles.s1}> 4: Verified Listings</Text>
        <Text style={styles.s1}> 5: Easy Communication </Text>

        <Text style={styles.ss}>Start Your Search Today!</Text>
        <Text style={styles.h2}>
          Join thousands of students who found their perfect home with Homy.
          Sign up now and take the stress out of apartment hunting!
        </Text>
        <Pressable
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Text style={styles.btn}>Sign up</Text>
        </Pressable>
        <Text style={styles.cta}>
          {" "}
          Your Home, Your Rules – Find it with Homy.
        </Text>
        <Pressable
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
          onPress={() => router.push("./AboutUs")}
        >
          <Text style={styles.bttn}>To Know More About Us ,Click me!</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f0f0f0",
    margin: 20,
  },
  text: {
    fontWeight: "bold",
    fontSize: 32,
    textAlign: "center",
    color: "#333",
    marginBottom: 30,
  },
  head: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 15,
    marginBottom: 30,
  },
  cta: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
  ss: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  s1: {
    fontSize: 16,
    marginBottom: 10,
  },
  btn: {
    width: 85,
    height: 45,
    backgroundColor: "black",
    borderRadius: 15,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
  },
  bttn: {
    width: 300,
    height: 45,
    backgroundColor: "black",
    borderRadius: 20,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
  },
});
