import {
  TextInput,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import { debounce } from "lodash";

interface Apartment {
  id: string;
  availability_status: string;
  features: string;
  floor: string;
  image: string[];
  keywords: string[];
  location: string;
  num_bedrooms: string;
  rent: string;
  seller_id: string;
  unit_number: string;
}

const Search = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [fullData, setFullData] = useState<Apartment[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Apartments"));
      const results: Apartment[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Apartment);
      });
      setFullData(results);
      setApartments(results);
      setIsLoading(false);
    } catch (err: any) {
      setError(err);
      setIsLoading(false);
      console.log(err);
    }
  };

  const handleSearch = useCallback(
    debounce((query: string) => {
      const searchTerms = query.toLowerCase().trim().split(/\s+/);

      const filtered = fullData.filter((apartment) => {
        if (query === "") return true;

        return searchTerms.some((term) => {
          return (
            apartment.location.toLowerCase().includes(term) ||
            apartment.features.toLowerCase().includes(term) ||
            apartment.num_bedrooms === term ||
            (term.startsWith("under-") &&
              parseInt(apartment.rent) <= parseInt(term.substring(6))) ||
            apartment.rent === term ||
            apartment.availability_status.toLowerCase().includes(term) ||
            apartment.floor === term ||
            apartment.keywords.some((keyword) =>
              keyword.toLowerCase().includes(term)
            )
          );
        });
      });

      setApartments(filtered);
    }, 300),
    [fullData]
  );

  const onChangeText = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const formatPrice = (price: string) => {
    return `${parseInt(price).toLocaleString()} EGP`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFE91" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search location, features, price, bedrooms..."
          clearButtonMode="always"
          style={styles.searchBox}
          autoCapitalize="none"
          autoCorrect={false}
          value={searchQuery}
          onChangeText={onChangeText}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            An error occurred. Please try again later.
          </Text>
        </View>
      )}

      {apartments.length === 0 && !isLoading && !error && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No apartments found</Text>
        </View>
      )}

      <FlatList
        data={apartments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.apartmentCard}>
            {item.image && item.image.length > 0 && (
              <Image
                source={{ uri: item.image[0] }}
                style={styles.apartmentImage}
                defaultSource={require("@/assets/placeholder.png")} // Add a placeholder image
              />
            )}
            <View style={styles.apartmentDetails}>
              <Text style={styles.apartmentLocation}>{item.location}</Text>
              <Text style={styles.apartmentPrice}>
                {formatPrice(item.rent)}
              </Text>
              <View style={styles.apartmentFeatures}>
                <Text style={styles.apartmentFeature}>
                  {item.num_bedrooms} Bedrooms
                </Text>
                <Text style={styles.apartmentFeature}>Floor {item.floor}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {item.availability_status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBox: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  listContainer: {
    paddingBottom: 20,
  },
  apartmentCard: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  apartmentImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  apartmentDetails: {
    padding: 15,
  },
  apartmentLocation: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  apartmentPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a73e8",
    marginBottom: 8,
  },
  apartmentFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  apartmentFeature: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  statusBadge: {
    backgroundColor: "#e8f0fe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "#1a73e8",
    fontSize: 12,
    fontWeight: "500",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
  },
});

export default Search;
