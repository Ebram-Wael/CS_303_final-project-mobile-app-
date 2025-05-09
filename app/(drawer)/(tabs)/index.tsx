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
const pic1 =
  "https://res.cloudinary.com/dynw2az0g/image/upload/v1746736358/homepic4_vdrfxe.jpg";
const pic2 =
  "https://res.cloudinary.com/dynw2az0g/image/upload/v1746736358/homepic3_b0nbta.jpg";
const pic3 =
  "https://res.cloudinary.com/dynw2az0g/image/upload/v1746736357/homepic1_f47e75.jpg";
const pic4 =
  "https://res.cloudinary.com/dynw2az0g/image/upload/v1746736357/homepic2_aluftl.jpg";
import FloatingMenuButton from "@/components/FloatingMenuButton";
import Colors from "@/components/colors";
import { useRouter } from "expo-router";
import { useThemes } from "@/components/themeContext";

export default function index() {
  const { theme } = useThemes();
  const isDark = theme === "dark";

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
    <SafeAreaView
      style={[
        styles.cont,
        {
          backgroundColor: isDark
            ? Colors.darkModeBackground
            : Colors.background,
        },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={isDark ? Colors.darkModePrimary : Colors.primary}
      />
      <FloatingMenuButton />
      <Text
        style={[
          styles.mainHeading,
          {
            backgroundColor: isDark ? Colors.darkModePrimary : Colors.primary,
          },
        ]}
      >
        HOMY
      </Text>
      <ScrollView style={styles.content}>
        <View>
          <Text
            style={[
              styles.head,
              {
                color: isDark ? Colors.darkModeText : Colors.text,
                marginTop: 70,
                width: "90%",
              },
            ]}
          >
            {" "}
            Find the Perfect Apartment for Students
          </Text>
        </View>
        <View>
          <Image source={{ uri: images[index] }} style={styles.img} />
          <Text
            style={[
              styles.txt,
              { color: isDark ? Colors.darkModeText : Colors.text },
            ]}
          >
            Looking for a comfortable and affordable place to stay? Homy makes
            apartment hunting easy for students! Whether you need a shared space
            or a private room, we connect you with the best housing options near
            your university.
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.title,
              { color: isDark ? Colors.darkModeText : Colors.text },
            ]}
          >
            {" "}
            Why Choose Homy?
          </Text>
          <View
            style={[
              styles.underline,
              {
                backgroundColor: isDark
                  ? Colors.darkModePrimary
                  : Colors.primary,
              },
            ]}
          />
          <Text
            style={[
              styles.listText,
              { color: isDark ? Colors.darkModeText : Colors.text },
            ]}
          >
            1: Student-Friendly Listings{"\n"}2: Smart Search Filters {"\n"}
            3: Roommate Matching{"\n"}4: Verified Listings{"\n"}5: Easy
            Communication
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.title,
              { color: isDark ? Colors.darkModeText : Colors.text },
            ]}
          >
            Start Your Search Today!
          </Text>
          <View
            style={[
              styles.underline,
              {
                backgroundColor: isDark
                  ? Colors.darkModePrimary
                  : Colors.primary,
              },
            ]}
          />
          <Text
            style={[
              styles.txt,
              { color: isDark ? Colors.darkModeText : Colors.text },
            ]}
          >
            Join thousands of students who found their perfect home with Homy.
            Sign up now and take the stress out of apartment hunting!
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.title,
              { color: isDark ? Colors.darkModeText : Colors.text },
            ]}
          >
            Your Home, Your Rules – Find it with Homy.
          </Text>
          <View
            style={[
              styles.underline,
              {
                backgroundColor: isDark
                  ? Colors.darkModePrimary
                  : Colors.primary,
              },
            ]}
          />
          <Text
            style={{
              fontSize: 15,
              paddingHorizontal: 12,
              margin: 5,
              color: isDark ? Colors.darkModeText : Colors.text,
            }}
          >
            Learn More about us by clicking the button below
          </Text>
          <Pressable
            style={[
              styles.btn,
              {
                backgroundColor: isDark
                  ? Colors.darkModeSecondary
                  : Colors.assestGreen,
              },
            ]}
            onPress={() => router.push("/(drawer)/AboutUs")}
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
    backgroundColor: Colors.background,
  },
  mainHeading: {
    fontWeight: "bold",
    fontSize: 32,
    textAlign: "center",
    color: Colors.whiteText,
    backgroundColor: Colors.primary,
    marginBottom: 10,
    padding: 12,
    marginTop: -34,
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
    color: Colors.text,
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
    color: Colors.text,
  },
  listText: {
    fontSize: 16,
    marginBottom: 10,
    padding: 5,
  },
  btn: {
    width: 150,
    height: 45,
    backgroundColor: Colors.assestGreen,
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
    backgroundColor: Colors.primary,
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 20,
  },
});
