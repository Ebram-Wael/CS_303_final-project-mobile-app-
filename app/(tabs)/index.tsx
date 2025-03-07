import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import pic1 from "@/assets/images/homepic1.jpg";
import pic2 from "@/assets/images/homepic2.jpg";
import pic3 from "@/assets/images/homepic3.jpg";
import pic4 from "@/assets/images/homepic4.jpg";

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
    <SafeAreaView style={styles.cont}>
      <StatusBar barStyle="light-content" backgroundColor={"#352F44"} />
      <Text style={styles.mainHeading}>HOMY</Text>
      <ScrollView style={styles.content}>
        <View>
          <Text style={styles.head}>
            {" "}
            Find the Perfect Apartment for Students
          </Text>
        </View>
        <View>
          <Image source={images[index]} style={styles.img} />
          <Text style={styles.txt}>
            Looking for a comfortable and affordable place to stay? Homy makes
            apartment hunting easy for students! Whether you need a shared space
            or a private room, we connect you with the best housing options near
            your university.
          </Text>
        </View>
        <View>
          <Text style={styles.title}> Why Choose Homy?</Text>
          <View style={styles.underline} />
          <Text style={styles.listText}>
            1: Student-Friendly Listings{"\n"}2: Smart Search Filters {"\n"}
            3: Roommate Matching{"\n"}4: Verified Listings{"\n"}5: Easy
            Communication
          </Text>
        </View>
        <View>
          <Text style={styles.title}>Start Your Search Today!</Text>
          <View style={styles.underline} />
          <Text style={styles.txt}>
            Join thousands of students who found their perfect home with Homy.
            Sign up now and take the stress out of apartment hunting!
          </Text>
        </View>
        <View>
          <Text style={styles.title}>Sign Up</Text>
          <View style={styles.underline} />
          <Text style={styles.txt}>
            Join thousands of students who found their perfect home with Homy.
            Sign up now and take the stress out of apartment hunting!
          </Text>
          <Pressable
            style={styles.signupButton}
            onPress={() => router.push("../screens/register")}
          >
            <Text style={{ color: "white" }}>Join Now</Text>
          </Pressable>
        </View>
        <View>
          <Text style={styles.title}>
            Your Home, Your Rules – Find it with Homy.
          </Text>
          <View style={styles.underline} />
          <Text style={{ fontSize: 15, paddingHorizontal: 12, margin: 5 }}>
            Learn More about us by clicking the button below
          </Text>
          <Pressable
            style={styles.btn}
            onPress={() => router.push("../screens/AboutUs")}
          >
            <Text style={{ color: "white" }}>Click me!</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#DBD8E3",
  },
  mainHeading: {
    fontWeight: "bold",
    fontSize: 32,
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#352F44",
    marginBottom: 10,
    padding: 12,
  },
  content: {
    padding: 16,
  },
  head: {
    fontSize: 20,
    paddingHorizontal: 5,
    marginBottom: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2A2438",
  },
  txt: {
    fontSize: 15,
    marginBottom: 10,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    padding: 12,
    color: "#2A2438",
  },
  listText: {
    fontSize: 16,
    marginBottom: 10,
    padding: 5,
  },
  btn: {
    width: 150,
    height: 45,
    backgroundColor: "#5C5470",
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    textAlignVertical: "center",
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 25,
  },
  img: {
    width: " 100%",
    height: 400,
    marginBottom: 30,
    borderRadius: 16,
  },
  signupButton: {
    width: 150,
    height: 45,
    backgroundColor: "#5C5470",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  underline: {
    width: 300,
    height: 5,
    backgroundColor: "#2A2438",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 20,
  },
});
