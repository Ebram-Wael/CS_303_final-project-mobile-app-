import {
  TextInput,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";

const Search = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [fullData, setFullData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "yourCollection")); // replace with your collection name
      const results: any[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setFullData(results);
      setData(results);
      setIsLoading(false);
    } catch (err: any) {
      setError(err);
      console.log(err);
    }
  };

  const handelSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = fullData.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setData(filtered);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color="#FFFE91" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TextInput
        placeholder="search"
        clearButtonMode="always"
        style={styles.searchBox}
        autoCapitalize="none"
        autoCorrect={false}
        value={searchQuery}
        onChangeText={handelSearch}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ padding: 10 }}>{item.name}</Text>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
  },
});

export default Search;
