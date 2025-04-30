import React, { useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Pressable } from "react-native";
import Swiper from "react-native-swiper";
import Colors from "@/components/colors";
import { useThemes } from '@/components/themeContext'

import pro1 from "@/assets/images/photo_2025-04-11_16-10-28.jpg";
import pro2 from "@/assets/images/photo_2025-01-09_17-47-33.jpg";
import pro3 from "@/assets/images/photo_2025-04-11_16-21-47.jpg";
import pro4 from "@/assets/images/photo_2025-04-11_16-15-25.jpg";
import pro5 from "@/assets/images/photo_2025-04-11_16-15-28.jpg";
import pro6 from "@/assets/images/photo_2025-04-11_16-18-13.jpg";
import pro7 from "@/assets/images/kF6HU0XK.jpg";
import pro8 from "@/assets/images/qEmHD5mC.jpg";


const { width } = Dimensions.get("window");

export default function AboutUs() {
  const swiperRef = useRef<any>(null);

  const goNext = () => swiperRef.current?.scrollBy(1);
  const goPrev = () => swiperRef.current?.scrollBy(-1);

  const { theme } = useThemes();
  const isDark = theme === 'dark';

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? Colors.darkModeBackground : Colors.background }]}>

      <View style={styles.sliderWrapper}>
        <Swiper
          ref={swiperRef}
          autoplay={false}

          showsPagination={true}
          loop={true}
          height={220}
        >
          <Image source={pro1} style={styles.image} />
          <Image source={pro2} style={styles.image} />
          <Image source={pro3} style={styles.image} />
          <Image source={pro4} style={styles.image} />
          <Image source={pro5} style={styles.image} />
          <Image source={pro6} style={styles.image} />
          <Image source={pro7} style={styles.image} />
          <Image source={pro8} style={styles.image} />
        </Swiper>


        <Pressable style={styles.leftArrow} onPress={goPrev}>
          <Text style={styles.arrowText}>‹</Text>
        </Pressable>

        <Pressable style={styles.rightArrow} onPress={goNext}>
          <Text style={styles.arrowText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>Student Housing App</Text>
        <Text style={styles.paragraph}>
          The Student Housing App is a mobile application designed to help students find and rent rooms easily...
        </Text>

        <Text style={styles.subheading}>Features</Text>
        <Text style={styles.paragraph}>
          • User Authentication (Signup/Login) {"\n"}
          • Room Listings with images {"\n"}
          • Search & Filters {"\n"}
          • Booking System {"\n"}
          • Chat System
        </Text>

        <Text style={styles.para}>Team Leader :</Text>
        <Text style={styles.member}>Malak Sobhy</Text>

        <Text style={styles.para}>Team Members :</Text>
        <Text style={styles.member}>
          1- Esraa Hassan{"\n"}
          2- Abanoub Refaat{"\n"}
          3- Ebram Wael{"\n"}
          4- Aya Ali{"\n"}
          5- Walaa Tarek{"\n"}
          6- Youstina Agaiby{"\n"}
          7- Julia Milad
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  sliderWrapper: {
    position: "relative",
    height: 220,
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 10,
  },
  leftArrow: {
    position: "absolute",
    top: "40%",
    left: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 30,
    zIndex: 1,
  },
  rightArrow: {
    position: "absolute",
    top: "40%",
    right: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 30,
    zIndex: 1,
  },
  arrowText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    marginVertical: 15,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 10,
  },
  para: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
  },
  member: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});
