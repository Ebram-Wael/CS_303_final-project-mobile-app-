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
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Heart from "@/assets/icons/heart-svgrepo-com.svg";
import RedHeart from "@/assets/icons/heart-svgrepo-com (1).svg";
import TopArrow from "@/assets/icons/top-arrow-5-svgrepo-com.svg";
import DMTopArrow from "@/assets/icons/top-arrow-5-svgrepo-com (1).svg";
import DMDownArrow from "@/assets/icons/top-arrow-5-svgrepo-com_down.svg";
import DownArrow from "@/assets/icons/down-arrow-5-svgrepo-com.svg";
import DMHeart from '@/assets/icons/favorite_dark_mode.svg';

import * as Notifications from "expo-notifications";
import Colors from "@/components/colors";
import { useThemes } from '@/components/themeContext';

const defaultImage = "https://via.placeholder.com/150";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Notification permissions not granted");
  }
}

const HouseDesc = ({ house }) => {
  const navigation = useNavigation();
  const [owner, setOwner] = useState("");
  const { theme } = useThemes();
  const isDark = theme === 'dark';

  useEffect(() => {
    requestNotificationPermissions();
    const fetchOwner = async () => {
      if (house.seller_id) {
        try {
          const userDocRef = doc(db, "Users", house.seller_id);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setOwner(userDoc.data().name);
          } else {
            setOwner("Unknown");
          }
        } catch (error) {
          console.error("Error fetching owner:", error);
          setOwner("Error");
        }
      } else {
        setOwner("No seller");
      }
    };

    fetchOwner();
  }, [house.seller_id]);

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
        const favorites = await AsyncStorage.getItem("favorites");
        if (favorites) {
          const favoritesArray = JSON.parse(favorites);
          if (favoritesArray.includes(house.id)) {
            setPressHeart(true);
          }
        }
      } catch (error) {
        console.error("Failed to load favorites", error);
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
      const favorites = await AsyncStorage.getItem("favorites");
      let favoritesArray = favorites ? JSON.parse(favorites) : [];
      let message = "";
      if (pressHeart) {
        favoritesArray = favoritesArray.filter((id) => id !== house.id);
        message = "Item removed from favorites.";
      } else {
        favoritesArray.push(house.id);
        message = "Item added to favorites.";
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
      setPressHeart(!pressHeart);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "favorite",
          body: message,
          sound: "default",
          data: { type: "favorite" },
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Failed to update favorites", error);
    }
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [expanded]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [windowHeight * 0.4, 0],
  });

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.darkModeBackground : Colors.background }]}>
      <ScrollView style={styles.imageContainer}>
        {house.image.length === 1 ? (
          <Image
            source={{ uri: house.image[0] }}
            style={{
              width: "100%",
              height: windowHeight - 80,
            }}
          />
        ) : (
          house.image.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={{
                width: "100%",
                height: press ? windowHeight / 3 : windowHeight / 2,
                borderRadius: 8,
              }}
            />
          ))
        )}
      </ScrollView>
      <Pressable onPress={handlePress} style={styles.pressableContainer}>
        {press ? (
          <Animated.View
            style={[styles.detailed, { transform: [{ translateY }], backgroundColor: isDark ? Colors.darkModeBackground : "white" }]}
          >
            {isDark ? <DMDownArrow width={50} height={50} color={isDark ? Colors.darkModeText : "white"} />
              : <DownArrow width={50} height={50} color={isDark ? Colors.darkModeText : "white"} />}

            <Text style={[styles.status, { color: isDark ? Colors.darkModeText : Colors.text }]}>{house.availability_status}</Text>
            <Text style={[styles.price, { color: isDark ? Colors.assestBlue : Colors.assestGreen }]}>
              {house.rent > 0 ? `${house.rent}` : "Invalid Price"} EGP
            </Text>
            <Text style={[styles.address, { color: isDark ? Colors.darkModeText : Colors.text }]}>
              {house.location || "Unknown Address"}
            </Text>
            <Text style={[styles.title, { color: isDark ? Colors.darkModeText : Colors.text }]}>Floor: {house.floor}</Text>
            <Text style={[styles.title, { color: isDark ? Colors.darkModeText : Colors.text }]}>
              The Number of the unit: {house.unit_number}
            </Text>
            <Text style={[styles.description, { color: isDark ? Colors.darkModeText : Colors.text }]}>
              Description: {house.features || "No description available"}
            </Text>
            <Text style={[styles.NoOfRooms, { color: isDark ? Colors.darkModeText : Colors.text }]}>
              Number of rooms:{" "}
              {house.num_bedrooms || "Unknown Number Of Rooms"}
            </Text>
            <Text style={[styles.owner, { color: isDark ? Colors.assestGreen : Colors.assestBlue }]}>Contact: {owner}</Text>
            <View style={styles.buyNowStyles}>
              <Pressable onPress={handlePressOnHeart}>
                {pressHeart ? (
                  <RedHeart width={30} height={30} />
                ) : (
                  isDark ?
                    (<DMHeart width={30} height={30} />)
                    : <Heart width={30} height={30} />
                )}
              </Pressable>
              <Pressable style={[styles.buyNowView, { backgroundColor: isDark ? Colors.assestBlue : Colors.text }]}>
                <Text style={styles.buyNowText}>Buy Now!</Text>
              </Pressable>
            </View>
          </Animated.View>
        ) : (
          <View style={[styles.moreDetails, , { backgroundColor: isDark ? Colors.darkModeBackground : "white" }]}>
            {isDark ? <DMTopArrow width={30} height={30} />
              : <TopArrow width={30} height={30} />
            }
            <Text style={[styles.moreDetailsText, , { color: isDark ? Colors.darkModeText : Colors.text }]}>More Details</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default function moreView() {
  const moreview = useLocalSearchParams<{ moreview: string }>();
  const houseId = moreview?.moreview;
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const docRef = doc(db, "Apartments", houseId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHouses([{ id: docSnap.id, ...docSnap.data() }]);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching house: ", error);
      }
    };

    fetchHouse();
  }, [houseId]);

  return (
    <Animated.ScrollView contentContainerStyle={styles.scrollStyle}>
      {houses.map((house) => (
        <HouseDesc key={house.id} house={house} />
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    flexGrow: 1,
  },
  scrollStyle: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },
  detailed: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: -4 },
    // shadowRadius: 6,
    elevation: 5,
    rowGap: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 5,
  },
  status: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.assestGreen,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
  },
  owner: {
    fontSize: 17,
    fontWeight: "500",
    color: Colors.assestBlue,
    marginTop: 5,
  },
  NoOfRooms: {
    fontSize: 16,
    color: Colors.text,
  },
  address: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  moreDetails: {
    backgroundColor: "white",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 12,
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowOffset: { width: 0, height: -2 },
    // shadowRadius: 4,
    elevation: 3,
  },
  moreDetailsText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 5,
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
    alignItems: "center",
    justifyContent: "center",
    columnGap: 15,
    marginTop: 10,
  },
  buyNowView: {
    flex: 1,
    backgroundColor: Colors.text,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.whiteText,
  },
});
