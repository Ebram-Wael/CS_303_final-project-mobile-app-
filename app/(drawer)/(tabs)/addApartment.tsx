import React from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/services/firebase";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import Colors from "@/components/colors";
import { useThemes } from "@/components/themeContext";

export default function AddApartment() {
  const [loading, setLoading] = useState(false);
  const [unitNum, setunitNum] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("Available");
  const [numBedrooms, setNumBedrooms] = useState("");
  const [features, setFeatures] = useState("");
  const [floor, setFloor] = useState("");
  const [image, setImage] = useState([]);
  const [nearby, setNearby] = useState("");
  const [status, setStatus] = useState("pending");
  const auth = getAuth();
  const user = auth.currentUser;

  const [errorNum, setErorrorNum] = useState("");
  const [errorPrice, setErrorPrice] = useState("");
  const [errorLocation, setErrorLocation] = useState("");
  const [errorNumBedrooms, setErrorNumBedrooms] = useState("");
  const [errorImage, setErrorImage] = useState("");
  const [errorFeatures, setErrorFeatures] = useState("");
  const [errorFloor, setErrorFloor] = useState("");
  const [errorNearby, setErrorNearby] = useState("");

  const router = useRouter();

  const { theme } = useThemes();
  const isDark = theme === "dark";
  useEffect(() => {
    if (user) {
      setSellerId(user.uid);
    }
  }, [user]);

  const validateInputs = () => {
    let isValid = true;
    if (loading) return;
    setLoading(true);
    setErorrorNum("");
    setErrorPrice("");
    setErrorLocation("");
    setErrorNumBedrooms("");
    setErrorImage("");
    setErrorFeatures("");
    setErrorFloor("");
    setErrorNearby;
    if (!unitNum) {
      setErorrorNum("Please enter unit number");
      isValid = false;
    }
    if (!price) {
      setErrorPrice("Please enter price");
      isValid = false;
    }
    if (!location) {
      setErrorLocation("Please enter location");
      isValid = false;
    }
    if (!numBedrooms) {
      setErrorNumBedrooms("Please enter number of bedrooms");
      isValid = false;
    }
    if (image.length === 0) {
      setErrorImage("Please upload an image");
      isValid = false;
    }
    if (!features) {
      setErrorFeatures("Please enter features");
      isValid = false;
    }
    if (!floor) {
      setErrorFloor("Please enter floor");
      isValid = false;
    }
    if (!nearby) {
      setErrorNearby("Please enter nearby");
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      await addDoc(collection(db, "Apartments"), {
        unit_number: unitNum,
        seller_id: sellerId,
        rent: price,
        location: location,
        availability_status: availability,
        num_bedrooms: numBedrooms,
        image: image,
        features: features,
        floor: floor,
        nearby: nearby,
        status: status,
      });
      Alert.alert("we gonna review your apartment and get back to you");
      setLoading(false);
      setunitNum("");
      setPrice("");
      setLocation("");
      setAvailability("Available");
      setNumBedrooms("");
      setImage([]);
      setFeatures("");
      setFloor("");
      setNearby("");
      router.push("/(drawer)/(tabs)/explore");
    } catch (error) {
      console.log("Error adding document: ", error);
    }
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage([...image, ...result.assets.map((img) => img.uri)]);
    }
  };
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? Colors.darkModeBackground
            : Colors.background,
        },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.text}> Add your Apartment </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter unit Number"
          value={unitNum}
          onChangeText={(text) => setunitNum(text)}
        />
        {errorNum && <Text style={styles.error}>{errorNum}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          value={price}
          onChangeText={(text) => setPrice(text)}
          keyboardType="numeric"
        />
        {errorPrice && <Text style={styles.error}>{errorPrice}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          value={location}
          onChangeText={(text) => setLocation(text)}
        />
        {errorLocation && <Text style={styles.error}>{errorLocation}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Enter num bedrooms"
          value={numBedrooms}
          onChangeText={(text) => setNumBedrooms(text)}
          keyboardType="numeric"
        />
        {errorNumBedrooms && (
          <Text style={styles.error}>{errorNumBedrooms}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Enter floor"
          value={floor}
          onChangeText={(text) => setFloor(text)}
          keyboardType="numeric"
        />
        {errorFloor && <Text style={styles.error}>{errorFloor}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Enter nearby"
          value={nearby}
          onChangeText={(text) => setNearby(text)}
        />
        {errorNearby && <Text style={styles.error}>{errorNearby}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Enter features"
          value={features}
          onChangeText={(text) => setFeatures(text)}
          multiline={true}
          textAlignVertical="top"
        />
        {errorFeatures && <Text style={styles.error}>{errorFeatures}</Text>}
        <Pressable style={[styles.pickImageButton,{backgroundColor:isDark?Colors.darkModeSecondary:Colors.assestGreenThree}]} onPress={pickImage}>
          <Text
            style={[
              styles.txt,
              { color: isDark ? Colors.darkModeText : Colors.text },
            ]}
          >
            Upload Image
          </Text>
        </Pressable>
        <ScrollView horizontal>
          {image.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>
        {errorImage && <Text style={styles.error}>{errorImage}</Text>}
        <View style={styles.sub}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Pressable
              disabled={loading}
              style={[
                styles.btn,
                {
                  backgroundColor: isDark
                    ? Colors.darkModeSecondary
                    : Colors.assestGreen,
                },
              ]}
              onPress={async () => await handleSubmit()}
            >
              <Text style={{color:isDark?Colors.darkModeText:Colors.text}}>ADD APARTMENT</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  input: {
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.assestGray,
    backgroundColor: Colors.assestWhite,
    paddingHorizontal: 10,
    width: "100%",
    borderRadius: 8,
    color: Colors.text,
  },
  btn: {
    backgroundColor: Colors.assestGreen,
    width: "100%",
    height: 50,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.secondary,
    textAlign: "center",
  },
  pickImageButton: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: Colors.assestGreenThree,
    borderRadius: 6,
  },
  txt: {
    color: Colors.text,
    fontWeight: "600",
  },
  sub: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  error: {
    color: Colors.warning,
    fontSize: 12,
    marginBottom: 6,
    marginLeft: 4,
  },
});
