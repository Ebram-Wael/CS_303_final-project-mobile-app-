import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import HouseData from "@/services/data.json";
import arrow from "@/assets/images/arrow.png";

const defaultImage = "https://via.placeholder.com/150";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const HouseDesc = ({ house }) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [press, setPress] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    setPress(!press);
    Animated.timing(animatedValue, {
      toValue: expanded ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [windowHeight * 0.4, 0],
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: house?.imagesArr?.[0] || defaultImage }}
          style={{
            width: "100%",
            height: press ? windowHeight / 5 : windowHeight / 3,
            borderRadius: 8,
          }}
        />
        <Image
          source={{ uri: house?.imagesArr?.[1] || defaultImage }}
          style={{
            width: "100%",
            height: press ? windowHeight / 5 : windowHeight / 3,
            borderRadius: 8,
          }}
        />
        <Image
          source={{ uri: house?.imagesArr?.[2] || defaultImage }}
          style={{
            width: "100%",
            height: press ? windowHeight / 5 : windowHeight / 5,
            borderRadius: 8,
          }}
        />
      </View>
      <Pressable onPress={handlePress}>
        {press ? (
          <Animated.View
            style={[styles.detailed, { transform: [{ translateY }] }]}
          >
            <Image source={arrow} style={styles.arrow} />
            <Text style={styles.price}>
              {house.price > 0 ? `${house.price}` : "Invalid Price"} EGP
            </Text>
            <Text style={styles.address}>
              {house.address || "Unknown Address"}
            </Text>
            <Text style={styles.title}>{house.title || "No Title"}</Text>
            <Text style={styles.description}>
              Description: {house.description || "No description available"}
            </Text>
            <Text style={styles.NoOfRooms}>
              Number of rooms:{" "}
              {house.numberOfRooms || "Unknown Number Of Rooms"}
            </Text>
            <Text style={styles.owner}>Contact: {house.owner}</Text>
          </Animated.View>
        ) : (
          <View style={styles.moreDetails}>
            {/* <Text style={styles.arrow}> ▲ </Text> */}
            <Text style={styles.moreDetailsText}>More Details</Text>
          </View>
        )}
      </Pressable>
    </ScrollView>
  );
};

export default function moreView() {
  const moreview = useLocalSearchParams<{ moreview: string }>();
  const houseId = Number(moreview?.moreview) || 0;
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const houseWithid = HouseData.find((e) => Number(e.id) === houseId);
    setHouses(houseWithid ? [houseWithid] : []);
  }, [houseId]);

  return (
    <ScrollView contentContainerStyle={styles.scrollStyle}>
      {houses.map((house) => (
        <HouseDesc key={house.id} house={house} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DBD8E3",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 5,
    rowGap: 3,
  },
  scrollStyle: {
    backgroundColor: "#DBD8E3",
  },
  detailed: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    rowGap: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  price: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#28a745",
  },
  description: {
    fontSize: 20,
    color: "#555",
    marginTop: 5,
  },
  owner: {
    fontSize: 20,
    fontWeight: "500",
    color: "#007AFF",
    marginTop: 5,
  },
  NoOfRooms: {
    fontSize: 20,
    color: "#444",
    marginTop: 5,
  },
  address: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 5,
  },
  moreDetails: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 4,
  },
  moreDetailsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#352F44",
  },
  arrow: {
    width: windowWidth / 6,
    height: windowHeight / 40,
  },
});
