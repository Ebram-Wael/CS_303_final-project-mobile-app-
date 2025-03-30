import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  Animated,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import HouseData from "@/services/data.json";
import Heart from "@/assets/icons/heart-svgrepo-com.svg";
import RedHeart from "@/assets/icons/heart-svgrepo-com (1).svg";
import TopArrow from "@/assets/icons/top-arrow-5-svgrepo-com.svg";
import DownArrow from "@/assets/icons/down-arrow-5-svgrepo-com.svg";

const defaultImage = "https://via.placeholder.com/150";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import AsyncStorage from "@react-native-async-storage/async-storage";

const HouseDesc = ({ house }) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [press, setPress] = useState(false);
  const [pressHeart, setPressHeart] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorites = await AsyncStorage.getItem('favorites');
        if (favorites) {
          const favoritesArray = JSON.parse(favorites);
          if (favoritesArray.includes(house.id)) {
            setPressHeart(true);
          }
        }
      } catch (error) {
        console.error('Failed to load favorites', error);
      }
    };

    checkFavorite();
  }, [house.id]);

  const handlePress = () => {
    setPress(!press);
    setExpanded(!expanded);
  };

  const handlePressOnHeart = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favoritesArray = favorites ? JSON.parse(favorites) : [];
      let message = "";
      if (pressHeart) {
        favoritesArray = favoritesArray.filter(id => id !== house.id);
        message =  "Item removed from favorites.";
      } else {
        favoritesArray.push(house.id);
        message =   "Item added to favorites.";
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      setPressHeart(!pressHeart);
      Alert.alert("Favorites", message);
    } catch (error) {
      console.error('Failed to update favorites', error);
    }
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [expanded])

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [windowHeight * 0.4, 0],
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.imageContainer}>
        <Image
          source={{ uri: house?.imagesArr?.[0] || defaultImage }}
          style={{
            width: "100%",
            height: press ? windowHeight / 3 : windowHeight / 2,
            borderRadius: 8,
          }}
        />
        <Image
          source={{ uri: house?.imagesArr?.[1] || defaultImage }}
          style={{
            width: "100%",
            height: press ? windowHeight / 3 : windowHeight / 2,
            borderRadius: 8,
          }}
        />
        <Image
          source={{ uri: house?.imagesArr?.[2] || defaultImage }}
          style={{
            width: "100%",
            height: press ? windowHeight / 3 : windowHeight / 2,
            borderRadius: 8,
          }}
        />
      </ScrollView>
      <Pressable onPress={handlePress} style={styles.pressableContainer}>
        {press ? (
          <Animated.View
            style={[styles.detailed, { transform: [{ translateY }] }]}
          >
            <DownArrow width={50} height={50}/>
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
            <View style={styles.buyNowStyles}>
              <Pressable onPress={handlePressOnHeart}>
              { pressHeart ? <RedHeart width={30} height={30} />
              : <Heart width={30} height={30}/>}
              </Pressable>
              <Pressable style={styles.buyNowView}>
                <Text style={styles.buyNowText}>Buy Now!</Text>
              </Pressable>
            </View>
          </Animated.View>
        ) : (
          <View style={styles.moreDetails}>
            <TopArrow width={30} height={30}/>
            <Text style={styles.moreDetailsText}>More Details</Text>
          </View>
        )}
      </Pressable>
    </View>
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
    flexGrow: 1,
  },
  scrollStyle: {
    flex: 1,
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
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
  pressableContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  buyNowStyles: {
    flexDirection: "row",
    columnGap: 10,
    marginTop: 5,
  },
  buyNowView: {
    flex: 2,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: "#352F44",
  },
  buyNowText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
});
