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
} from "react-native";
import { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/services/firebase";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import Colors from '@/components/colors';
import { useThemes } from '@/components/themeContext'

export default function AddApartment() {
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
  const isDark = theme === 'dark';
  useEffect(() => {
    if (user) {
      setSellerId(user.uid);
    }
  }, [user]);

  const validateInputs = () => {
    let isValid = true;
    setErorrorNum("");
    setErrorPrice("");
    setErrorLocation("");
    setErrorNumBedrooms("");
    setErrorImage("");
    setErrorFeatures("");
    setErrorFloor("");
    setErrorNearby
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

      });
      Alert.alert("Apartment added successfully!");
      setunitNum("");
      setPrice("");
      setLocation("");
      setAvailability("Available");
      setNumBedrooms("");
      setImage([]);
      setFeatures("");
      setFloor("");
      setNearby("");
      router.push("../(drawer)/(tabs)/explore");
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
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.darkModeBackground : Colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.text, { color: isDark ? Colors.darkModeText : Colors.text }]}> Add your Apartment </Text>
        {/* <Image
          style={{ width: 300, height: 200, alignSelf: "center" }}
          source={city}
        /> */}
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
        <Pressable style={styles.pickImageButton} onPress={pickImage}>
          <Text style={[styles.txt, { color: isDark ? Colors.darkModeText : Colors.text }]}>Upload Image</Text>
        </Pressable>
        <ScrollView horizontal>
          {image.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>
        {errorImage && <Text style={styles.error}>{errorImage}</Text>}
        <View style={styles.sub}>
          <Pressable
            style={[styles.btn, { backgroundColor: isDark ? Colors.darkModeSecondary : Colors.assestGreen }]}
            onPress={async () => await handleSubmit()}
          >
            <Text>ADD APARTMENT</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    backgroundColor: "white",
    width: 320,
    borderRadius: 5,
  },
  btn: {
    backgroundColor: Colors.assestGreen,
    width: 200,
    height: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },
  pickImageButton: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  txt: {
    textDecorationLine: "underline",
  },
  sub: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  error: {
    color: Colors.warning,
    fontSize: 12,
    marginLeft: 12,
    marginBottom: 10,
  },
});
