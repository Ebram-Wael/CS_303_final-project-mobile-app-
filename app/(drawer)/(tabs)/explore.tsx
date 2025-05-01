import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { db } from "@/services/firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import Colors from "@/components/colors";
import { debounce } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemes } from "@/components/themeContext";

const STORAGE_KEYS = {
  APARTMENTS: "apartmentData",
  OWNER: "owner",
};

import defaultImage from "@/assets/images/default.jpg";

const HouseItem = ({ house }) => {
  const { theme } = useThemes();
  const isDark = theme === "dark";
  const router = useRouter();
  const [owner, setOwner] = useState("");
  const [ownerId, setOwnerId] = useState("");

  useEffect(() => {
    const fetchOwner = async () => {
      if (!house.seller_id) {
        setOwner("No seller");
        return;
      }

      try {
        const userDocRef = doc(db, "Users", house.seller_id);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setOwner(userDoc.data().name);
          setOwnerId(userDoc.id);
        } else {
          setOwner("Unknown");
        }
      } catch (error) {
        console.error("Error fetching owner:", error);
        setOwner("Error");

        try {
          const data = await AsyncStorage.getItem(STORAGE_KEYS.OWNER);
          if (data) {
            const parseData = JSON.parse(data);
            setOwner(parseData.name);
          }
        } catch (storageError) {
          console.error("Error retrieving owner from storage:", storageError);
        }
      }
    };

    fetchOwner();
  }, [house.seller_id]);

  const navigateToDetails = () => {
    router.push({
      pathname: "/screens/[moreview]",
      params: { moreview: house.id },
    });
  };

  const navigateToOwner = () => {
    if (ownerId) {
      router.push({
        pathname: "/screens/owner",
        params: { ownerId },
      });
    }
  };

  return (
    <SafeAreaView>
      <Pressable onPress={navigateToDetails}>
        <View
          style={[styles.card, { backgroundColor: isDark ? "#333" : "white" }]}
        >
          <Text
            style={[styles.title, { color: isDark ? "#fff" : Colors.text }]}
          >
            {house.title || house.property_type || "House"}
          </Text>
          <Text
            style={[
              styles.address,
              { color: isDark ? "#bbb" : Colors.assestGray },
            ]}
          >
            {house.location || "Unknown Location"}
          </Text>
          <View style={styles.ownerContainer}>
            <Text
              style={[styles.owner, { color: isDark ? "#fff" : Colors.text }]}
            >
              Owner:{" "}
            </Text>
            <Pressable onPress={navigateToOwner}>
              <Text style={{ color: Colors.assestBlue }}>
                {owner || "Unknown"}
              </Text>
            </Pressable>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  house.image && house.image[0] ? house.image[0] : defaultImage,
              }}
              style={styles.image}
              defaultSource={defaultImage}
            />
          </View>
          <Text
            style={[
              styles.description,
              { color: isDark ? "#bbb" : Colors.assestGray },
            ]}
            numberOfLines={2}
          >
            Description: {house.features || "No description available"}
          </Text>
          <View style={styles.priceContainer}>
            <Text
              style={[
                styles.price,
                { color: isDark ? "#80b3ff" : Colors.assestBlue },
              ]}
            >
              Price: {house.rent > 0 ? `${house.rent}` : "Invalid Price"} EGP
            </Text>
            {house.availability_status === "Available" && (
              <View style={styles.availabilityBadge}>
                <Text style={styles.availabilityText}>Available</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default function HouseList() {
  const [allHouses, setAllHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useThemes();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, "Apartments");
        const unsubscribe = onSnapshot(colRef, async (snapshot) => {
          const houseList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setAllHouses(houseList);
          setFilteredHouses(houseList);
          setIsLoading(false);

          try {
            await AsyncStorage.setItem(
              STORAGE_KEYS.APARTMENTS,
              JSON.stringify(houseList)
            );
          } catch (storageError) {
            console.error("Error saving to AsyncStorage:", storageError);
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching apartments:", error);
        try {
          const data = await AsyncStorage.getItem(STORAGE_KEYS.APARTMENTS);
          if (data) {
            const parseData = JSON.parse(data);
            setAllHouses(parseData);
            setFilteredHouses(parseData);
          } else {
            console.log("No data in local storage");
          }
        } catch (storageError) {
          console.error("Error reading from AsyncStorage:", storageError);
        } finally {
          setIsLoading(false);
        }
        return () => {};
      }
    };

    const unsubscribePromise = fetchData();

    return () => {
      if (unsubscribePromise) {
        unsubscribePromise
          .then((unsubscribe) => {
            if (typeof unsubscribe === "function") {
              unsubscribe();
            }
          })
          .catch((err) => console.error("Error unsubscribing:", err));
      }
    };
  }, []);

  const handleSearch = useCallback(
    debounce((query) => {
      if (!query.trim()) {
        setFilteredHouses(allHouses);
        return;
      }

      const searchTerms = query.toLowerCase().trim().split(/\s+/);

      const filtered = allHouses.filter((house) => {
        return searchTerms.some((term) => {
          const location = (house.location || "").toLowerCase();
          const features = (house.features || "").toLowerCase();
          const status = (house.availability_status || "").toLowerCase();
          const bedrooms = String(house.num_bedrooms || "");
          const floor = String(house.floor || "");
          const price = String(house.rent || "");

          const isUnderPrice =
            term.startsWith("under-") &&
            parseInt(price) <= parseInt(term.substring(6));

          const hasMatchingKeyword =
            Array.isArray(house.keywords) &&
            house.keywords.some((keyword) =>
              (keyword || "").toLowerCase().includes(term)
            );

          return (
            location.includes(term) ||
            features.includes(term) ||
            bedrooms.includes(term) ||
            isUnderPrice ||
            price === term ||
            status.includes(term) ||
            floor.includes(term) ||
            hasMatchingKeyword
          );
        });
      });

      setFilteredHouses(filtered);
    }, 300),
    [allHouses]
  );

  const onChangeText = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.assestBlue} />
        </View>
      );
    }

    if (filteredHouses.length === 0) {
      return (
        <Text
          style={[
            styles.loadingText,
            { color: isDark ? "#bbb" : Colors.assestGray },
          ]}
        >
          No houses found
        </Text>
      );
    }

    return filteredHouses.map((house) => (
      <HouseItem key={house.id} house={house} />
    ));
  }, [isLoading, filteredHouses, isDark]);

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? Colors.darkModeBackground
            : Colors.background,
        },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text
        style={[
          styles.header,
          { color: isDark ? Colors.darkModeText : Colors.text },
        ]}
      >
        Houses
      </Text>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: isDark ? "#333" : "white" },
        ]}
      >
        <TextInput
          placeholder="Search location, features, price..."
          placeholderTextColor={isDark ? "#999" : "#666"}
          clearButtonMode="always"
          style={[styles.searchBox, { color: isDark ? "#fff" : "#000" }]}
          autoCapitalize="none"
          autoCorrect={false}
          value={searchQuery}
          onChangeText={onChangeText}
        />
      </View>

      {renderContent}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.text,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 15,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 5,
  },
  owner: {
    fontSize: 14,
    color: Colors.text,
  },
  description: {
    fontSize: 14,
    color: Colors.assestGray,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.assestBlue,
  },
  availabilityBadge: {
    backgroundColor: "#81C784",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 10,
  },
  availabilityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    color: Colors.assestGray,
    marginBottom: 5,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.assestGray,
    marginTop: 40,
  },
  searchContainer: {
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchBox: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 16,
    fontSize: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
});
