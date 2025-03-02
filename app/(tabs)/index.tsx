import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
} from "react-native";
import pic1 from '@/assets/images/homepic1.jpg'
import pic2 from '@/assets/images/homepic2.jpg'
import pic3 from '@/assets/images/homepic3.jpg'
import pic4 from '@/assets/images/homepic4.jpg'

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
      <Text style={styles.text}>HOMY</Text>
      <ScrollView>
        <View>
          <Text style={styles.head}>
            {" "}
            Find the Perfect Apartment for Students
          </Text>
        </View>
        <View>
          <Image
            source={images[index]}
            style={styles.img}
          />
        </View>
        <View style={{padding:12}}>
          <Text style={styles.txt}>
            Looking for a comfortable and affordable place to stay? Homy makes
            apartment hunting easy for students! Whether you need a shared space
            or a private room, we connect you with the best housing options near
            your university.
          </Text>
        </View>
        <View style={{padding:12}}>
          <Text style={styles.title}> Why Choose Homy?</Text>
          <Text style={styles.s1}> 1: Student-Friendly Listings</Text>
          <Text style={styles.s1}> 2: Smart Search Filters</Text>
          <Text style={styles.s1}> 3: Roommate Matching </Text>
          <Text style={styles.s1}> 4: Verified Listings</Text>
          <Text style={styles.s1}> 5: Easy Communication </Text>
        </View>

        <View style={{padding:12}}>
          <Text style={styles.title}>Start Your Search Today!</Text>
          <Text style={styles.txt}>
            Join thousands of students who found their perfect home with Homy.
            Sign up now and take the stress out of apartment hunting!
          </Text>
        </View>
          <Pressable
            style={styles.press}
          >
          <Text style={styles.btn}>Sign up</Text>
          </Pressable>
          <Text style={styles.cta}>
            {" "}
            Your Home, Your Rules – Find it with Homy.
          </Text>
          <Pressable
            style={styles.press}
            onPress={() => router.push("./(tabs)/AboutUs")}
          >
            <Text style={styles.bttn}>To Know More About Us ,Click me!</Text>
          </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f0f0f0",
    marginVertical:30,
  },
  text: {
    fontWeight: "bold",
    fontSize: 32,
    textAlign: "center",
    color: "#333",
    marginBottom: 30,
    padding:10,
  },
  head: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "bold",
  },
  txt: {
    fontSize: 15,
    marginBottom: 20,
  },
  cta: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
  title: {
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
    color: "white",
    display:'flex',
    textAlign: "center",
    justifyContent:'center',
    alignItems:'center',
    textAlignVertical:'center',
  },
  bttn: {
    width: 300,
    height: 45,
    backgroundColor: "black",
    display:'flex',
    color: "white",
    textAlign: "center",
    justifyContent:'center',
    alignItems:'center',
    textAlignVertical:'center',
  },
  img :{
    width:" 100%", 
    height: 400,
    marginBottom: 30, 
  },
  press:{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  }
});
