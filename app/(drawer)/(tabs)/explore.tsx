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
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { db } from "@/services/firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { debounce } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemes } from "@/components/themeContext";
import FilterIcon from "@/assets/icons/filter.svg";
import Filters from "@/components/Filters";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import Colors from "@/components/colors";

const COLORS = {
  primaryDark: "#023336",
  primary: "#4DA674",
  primaryLight: "#C1E6B7",
  background: "#EAF8E7",
  text: "#023336",
  textLight: "#4DA674",
  white: "#FFFFFF",
  success: "#81C784",
};

const STORAGE_KEYS = {
  APARTMENTS: "apartmentData",
  OWNER: "owner",
};

import defaultImage from "@/assets/images/default.png";

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
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    router.push({
      pathname: "/screens/[moreview]",
      params: { moreview: house.id },
    });
  };

  const navigateToOwner = () => {
    if (ownerId) {
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
      router.push({
        pathname: "/screens/owner",
        params: { ownerId },
      });
    }
  };

  // Fix: Safely access the image array
  const houseImage =
    house.image && house.image.length > 0 ? house.image[0] : null;

  return (
    <Pressable
      onPress={navigateToDetails}
      style={({ pressed }) => [styles.cardContainer, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? Colors.darkModePrimary : Colors.assestWhite },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text
            style={[
              styles.title,
              { color: isDark ? Colors.assestWhite : Colors.assest },
            ]}
          >
            {house.features || house.property_type || "House"}
          </Text>
        </View>

        <Text
          style={[
            styles.address,
            { color: isDark ? Colors.assestGreenThree : Colors.assestGreenTwo },
          ]}
        >
          {house.location || "Unknown Location"}
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: houseImage || defaultImage }}
            style={styles.image}
            defaultSource={defaultImage}
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MaterialIcons
              name="hotel"
              size={18}
              color={isDark ? Colors.assestGreenThree : Colors.assestGreenTwo}
            />
            <Text
              style={[
                styles.detailText,
                { color: isDark ? Colors.assestGreenThree : Colors.assestGreenTwo },
              ]}
            >
              {house.num_bedrooms || "N/A"} Beds
            </Text>

            <MaterialIcons
              name="layers"
              size={18}
              color={isDark ? Colors.assestGreenThree : Colors.assestGreenTwo}
              style={styles.detailIcon}
            />
            <Text
              style={[
                styles.detailText,
                { color: isDark ? Colors.assestGreenThree : Colors.assestGreenTwo },
              ]}
            >
              Floor {house.floor || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={styles.ownerContainer}>
              <Text
                style={[
                  styles.owner,
                  { color: isDark ? Colors.assestWhite : Colors.assest },
                ]}
              >
                Owner:{" "}
              </Text>
              <Pressable onPress={navigateToOwner}>
                <Text style={{ color: Colors.assestGreenTwo }}>
                  {owner || "Unknown"}
                </Text>
              </Pressable>
            </View>

            {house.availability_status === "Available" && (
              <View
                style={[
                  styles.availabilityBadge,
                  { backgroundColor: isDark ? Colors.assestGreenTwo : Colors.assestGreenTwo },
                ]}
              >
                <Text style={styles.availabilityText}>Available</Text>
              </View>
            )}
          </View>

          <Text
            style={[
              styles.price,
              { color: isDark ? Colors.assestGreenThree : Colors.assestGreenTwo },
            ]}
          >
            {house.rent > 0 ? `${house.rent.toLocaleString()}` : "N/A"} EGP
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default function HouseList() {
  const [allHouses, setAllHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { theme } = useThemes();
  const isDark = theme === "dark";

  const searchParams = useLocalSearchParams();
  const location = searchParams?.location;
  const maxPrice = searchParams?.price;
  const bedrooms = searchParams?.bedrooms;
  const nearby = searchParams?.nearby;

  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 10000 },
    bedrooms: [],
    locations: [],
    status: [],
    nearby: [],
    propertyType: [],
  });

  useEffect(() => {
    if (!isDataLoaded) return;

    if (location || maxPrice || bedrooms || nearby) {
      const newFilters = {
        ...filters, // Keep existing filter values
        locations: location ? [location] : filters.locations,
        priceRange: {
          min: 0,
          max: maxPrice ? Number(maxPrice) : 10000,
        },
        bedrooms: bedrooms
          ? [bedrooms === "4+" ? "4+" : Number(bedrooms)]
          : filters.bedrooms,
        nearby: nearby ? [nearby] : filters.nearby,
      };
      setFilters(newFilters);
    }
  }, [location, maxPrice, bedrooms, nearby, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      handleSearch(searchQuery, filters);
    }
  }, [filters, searchQuery, isDataLoaded]);

  const [showFilters, setShowFilters] = useState(false);

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
          setIsDataLoaded(true);

          const initialFilters = {
            locations: location ? [location] : [],
            priceRange: {
              min: 0,
              max: maxPrice ? Number(maxPrice) : 10000,
            },
            bedrooms: bedrooms
              ? [bedrooms === "4+" ? "4+" : Number(bedrooms)]
              : [],
            status: [],
            propertyType: [],
            nearby: nearby ? [nearby] : [],
          };
          setFilters(initialFilters);
          handleSearch(searchQuery, initialFilters);
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
            setIsDataLoaded(true);
          } else {
            console.log("No data in local storage");
          }
        } catch (storageError) {
          console.error("Error reading from AsyncStorage:", storageError);
        } finally {
          setIsLoading(false);
        }
        return () => { };
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
    debounce((query, currentFilters) => {
      if (!allHouses || !currentFilters) return;

      let results = [...allHouses];

      if (currentFilters.priceRange) {
        results = results.filter((house) => {
          const price = Number(house.rent) || 0;
          return (
            price >= currentFilters.priceRange.min &&
            price <= currentFilters.priceRange.max
          );
        });
      }

      if (currentFilters.bedrooms && currentFilters.bedrooms.length > 0) {
        results = results.filter((house) => {
          const beds = house.num_bedrooms;
          return currentFilters.bedrooms.some((filterBed) => {
            if (filterBed === "4+") return Number(beds) >= 4;
            return beds === filterBed;
          });
        });
      }

      if (
        currentFilters.propertyType &&
        currentFilters.propertyType.length > 0
      ) {
        results = results.filter(
          (house) =>
            house.property_type &&
            currentFilters.propertyType.includes(house.property_type)
        );
      }

      if (currentFilters.status && currentFilters.status.length > 0) {
        results = results.filter(
          (house) =>
            house.availability_status &&
            currentFilters.status.includes(house.availability_status)
        );
      }

      if (currentFilters.locations && currentFilters.locations.length > 0) {
        results = results.filter(
          (house) =>
            house.location && currentFilters.locations.includes(house.location)
        );
      }

      if (currentFilters.nearby && currentFilters.nearby.length > 0) {
        results = results.filter(
          (house) =>
            house.nearby &&
            currentFilters.nearby.some((item) => house.nearby.includes(item))
        );
      }

      if (query && query.trim() !== "") {
        const lowerQuery = query.toLowerCase().trim();
        results = results.filter(
          (house) =>
            (house.location &&
              house.location.toLowerCase().includes(lowerQuery)) ||
            (house.features &&
              house.features.toLowerCase().includes(lowerQuery)) ||
            (house.property_type &&
              house.property_type.toLowerCase().includes(lowerQuery)) ||
            (house.rent && house.rent.toString().includes(lowerQuery))
        );
      }

      setFilteredHouses(results);
    }, 300),
    [allHouses]
  );

  const onChangeText = (query) => {
    setSearchQuery(query);
    if (isDataLoaded) {
      handleSearch(query, filters);
    }
  };

  const applyFilters = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      handleSearch(searchQuery, newFilters);
    },
    [handleSearch, searchQuery]
  );

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <View style={[styles.loadingContainer, { backgroundColor: isDark ? Colors.darkModeBackground : Colors.background }]}>
          <ActivityIndicator size="large" color={isDark ? Colors.darkIndicator : Colors.indicator} />
        </View>
      );
    }

    if (!filteredHouses || filteredHouses.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons
            name="search-off"
            size={48}
            color={isDark ? Colors.assestGreenTwo : Colors.assestGreenThree}
          />
          <Text
            style={[
              styles.loadingText,
              { color: isDark ? Colors.assestGreenThree : Colors.assestGreenTwo },
            ]}
          >
            No houses match your search
          </Text>
        </View>
      );
    }

    return filteredHouses.map((house) => (
      <HouseItem key={house.id} house={house} />
    ));
  }, [isLoading, filteredHouses, isDark]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.darkModeBackground : Colors.background },
      ]}
    >
      <SafeAreaView edges={["top"]} style={styles.headerContainer}>
        <Text
          style={[
            styles.header,
            { color: isDark ? Colors.darkModeText : Colors.assest },
          ]}
        >
          Available Properties
        </Text>
      </SafeAreaView>
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: isDark ? Colors.darkModePrimary : Colors.assestWhite },
        ]}
      >
        <TextInput
          placeholder="Search location, features, price..."
          placeholderTextColor={isDark ? Colors.assestGreenThree : Colors.assestGreenTwo}
          clearButtonMode="while-editing"
          style={[
            styles.searchBox,
            { color: isDark ? Colors.assestWhite : Colors.text },
          ]}
          autoCapitalize="none"
          autoCorrect={false}
          value={searchQuery}
          onChangeText={onChangeText}
          cursorColor={Colors.assestGreenTwo}
        />
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.selectionAsync();
            }
            setShowFilters(true);
          }}
          style={({ pressed }) => [
            styles.filterButton,
            pressed && styles.pressed,
          ]}
        >
          <FilterIcon width={24} height={24} />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderContent}
      </ScrollView>
      <Filters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={applyFilters}
        initialFilters={filters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 15,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  address: {
    fontSize: 14,
    marginBottom: 12,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 4,
  },
  detailIcon: {
    marginLeft: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  owner: {
    fontSize: 14,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availabilityText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchBox: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
