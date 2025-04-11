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
import {db} from "@/services/firebase"
import {doc ,getDoc} from "firebase/firestore";
import Heart from "@/assets/icons/heart-svgrepo-com.svg";
import RedHeart from "@/assets/icons/heart-svgrepo-com (1).svg";
import TopArrow from "@/assets/icons/top-arrow-5-svgrepo-com.svg";
import DownArrow from "@/assets/icons/down-arrow-5-svgrepo-com.svg";
import colors from '@/components/colors';

const defaultImage = "https://via.placeholder.com/150";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import AsyncStorage from "@react-native-async-storage/async-storage";

const HouseDesc = ({ house }) => {
  const navigation = useNavigation();
  const [owner, setOwner] = useState("");
  
  useEffect(() => {
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
      {house.image.length === 1 ? (
        <Image
          source={{ uri: house.image[0] }}
          style={{
            width: "100%",
            height: windowHeight - 80 ,
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
            style={[styles.detailed, { transform: [{ translateY }] }]}
          >
            <DownArrow width={50} height={50}/>
            <Text style={styles.status}>
              {house.availability_status }
              </Text>
            <Text style={styles.price}>
              {house.rent > 0 ? `${house.rent}` : "Invalid Price"} EGP
            </Text>
            <Text style={styles.address}>
              {house.location || "Unknown Address"}
            </Text>
            <Text style={styles.title}>
               Floor: {house.floor }
              </Text>
            <Text style={styles.title}>
              The Number of the unit: {house.unit_number }
              </Text>
            <Text style={styles.description}>
              Description: {house.features || "No description available"}
            </Text>
            <Text style={styles.NoOfRooms}>
              Number of rooms:{" "}
              {house.num_bedrooms || "Unknown Number Of Rooms"}
            </Text>
            <Text style={styles.owner}>Contact: {owner}</Text>
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
    backgroundColor: colors.background,
  },
  imageContainer: {
    flexGrow: 1,
  },
  scrollStyle: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  detailed: {
    padding: 20,
    backgroundColor: colors.white,
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
    color: colors.black,
    marginBottom: 5,
  },
  status: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.black,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.green,
  },
  description: {
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
  },
  owner: {
    fontSize: 17,
    fontWeight: "500",
    color: colors.blue,
    marginTop: 5,
  },
  NoOfRooms: {
    fontSize: 16,
    color: colors.black,
  },
  address: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
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
    color: colors.black,
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
    backgroundColor: colors.black,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
});
