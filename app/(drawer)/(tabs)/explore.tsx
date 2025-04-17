import React, { useEffect, useState, useCallback } from "react";
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
import colors from "@/components/colors";
import { debounce } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultImage = "default.jpg";

const HouseItem = ({ house }) => {
  const router = useRouter();
  const [owner, setOwner] = useState("");
  const [ownerId, setOwnerId] = useState("");

  useEffect(() => {
    const fetchOwner = async () => {
      if (house.seller_id) {
        try {
          const userDocRef = doc(db, "Users",  house.seller_id);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setOwner(userDoc.data().name);
            setOwnerId(userDoc.id);
            await AsyncStorage.setItem("owner" , JSON.stringify({name:userDoc.data().name}))
          } else {
            setOwner("Unknown");
          }
        } catch (error) {
          console.error("Error fetching owner:", error);
          setOwner("Error");
          const data = await AsyncStorage.getItem("owner")
          if(data){
            const parseData =JSON.parse(data)
            setOwner(parseData.name)

          }
        }
      } else {
        setOwner("No seller");
      }
    };

    fetchOwner();
  }, [house.seller_id]);

  return (
    <SafeAreaView>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/screens/[moreview]",
            params: { moreview: house.id },
          })
        }
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {house.availability_status || "No Title"}
          </Text>
          <Text style={styles.address}>
            {house.location || "Unknown Location"}
          </Text>
          <View style={styles.ownerContainer}>
            <Text style={styles.owner}>Owner: </Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/screens/owner",
                  params: { ownerId: ownerId },
                })
              }
            >
              <Text style={{ color: colors.blue }}>{owner || "Unknown"}</Text>
            </Pressable>
          </View>
          <Image
            source={{
              uri: house.image && house.image[0] ? house.image[0] : defaultImage,
            }}
            style={styles.image}
          />
          <Text style={styles.description} numberOfLines={2}>
            Description: {house.features || "No description available"}
          </Text>
          <Text style={styles.price}>
            Price: {house.rent > 0 ? `${house.rent}` : "Invalid Price"} EGP
          </Text>
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

  useEffect(() => {
    const colRef = collection(db, "Apartments");
    const fetchData= async()=>{
    try{
        const fetchHouses = onSnapshot(colRef, async (snapshot) => {
          const houseList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAllHouses(houseList);
          setFilteredHouses(houseList);
          setIsLoading(false);
          await AsyncStorage.setItem("apartmentData",JSON.stringify({houseList})
          )
        });
        return fetchHouses;
      }
      catch(Error){
        const data = await AsyncStorage.getItem("apartmentData")
        if(data){
          const parseData =JSON.parse(data);
          setAllHouses(parseData);
          setFilteredHouses(parseData);
          setIsLoading(false);
        }
        else{
          console.log("no data in local storage");
        }
    }
  }
    const unsubscribe =fetchData ();
    return ()=>{
      if(unsubscribe)unsubscribe.then(unsub=>unsub());
    } 
  }, []);

  const handleSearch = useCallback(
    debounce((query) => {
      if (query === "") {
        setFilteredHouses(allHouses);
        return;
      }

      const searchTerms = query.toLowerCase().trim().split(/\s+/);

      const filtered = allHouses.filter((house) => {
        return searchTerms.some((term) => {
          return (
            (house.location?.toLowerCase() || "").includes(term) ||
            (house.features?.toLowerCase() || "").includes(term) ||
            (house.num_bedrooms || "").includes(term) ||
            (term.startsWith("under-") &&
              parseInt(house.rent || "0") <= parseInt(term.substring(6))) ||
            house.rent === term ||
            (house.availability_status?.toLowerCase() || "").includes(term) ||
            (house.floor || "").includes(term) ||
            (Array.isArray(house.keywords) &&
              house.keywords.some((keyword) =>
                (keyword || "").toLowerCase().includes(term)
              ))
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Houses</Text>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search location, features, price..."
            clearButtonMode="always"
            style={styles.searchBox}
            autoCapitalize="none"
            autoCorrect={false}
            value={searchQuery}
            onChangeText={onChangeText}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.blue} />
          </View>
        ) : filteredHouses.length > 0 ? (
          filteredHouses.map((house) => (
            <HouseItem key={house.id} house={house} />
          ))
        ) : (
          <Text style={styles.loadingText}>No houses found</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Your existing styles
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.black,
  },
  card: {
    backgroundColor: colors.white,
    padding: 15,
    marginBottom: 15,
    borderRadius: 16,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 5,
  },
  owner: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.blue,
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  address: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 5,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: colors.gray,
    marginTop: 20,
  },

  // New styles for search
  searchContainer: {
    marginBottom: 15,
    backgroundColor: colors.white,
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
    paddingVertical: 20,
    alignItems: "center",
  },
});
