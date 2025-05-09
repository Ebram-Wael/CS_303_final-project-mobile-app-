import React, { useState, useEffect } from "react";
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
  const [image, setImage] = useState<string[]>([]);
  const [nearby, setNearby] = useState("");
  const [status, setStatus] = useState("pending");

  const [errorNum, setErorrorNum] = useState("");
  const [errorPrice, setErrorPrice] = useState("");
  const [errorLocation, setErrorLocation] = useState("");
  const [errorNumBedrooms, setErrorNumBedrooms] = useState("");
  const [errorImage, setErrorImage] = useState("");
  const [errorFeatures, setErrorFeatures] = useState("");
  const [errorFloor, setErrorFloor] = useState("");
  const [errorNearby, setErrorNearby] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;
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

    // Reset all errors
    setErorrorNum("");
    setErrorPrice("");
    setErrorLocation("");
    setErrorNumBedrooms("");
    setErrorImage("");
    setErrorFeatures("");
    setErrorFloor("");
    setErrorNearby("");

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
    if (!validateInputs()) return;

    setLoading(true);
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

      Alert.alert("We will review your apartment and get back to you");

      // Reset form fields
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
    setLoading(false);
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
        <Text style={[styles.text,{color:isDark?Colors.darkModeText:Colors.text}]}> Add your Apartment </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter unit Number"
          value={unitNum}
          onChangeText={setunitNum}
        />
        {errorNum && <Text style={styles.error}>{errorNum}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Enter price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        {errorPrice && <Text style={styles.error}>{errorPrice}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
        />
        {errorLocation && <Text style={styles.error}>{errorLocation}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Enter num bedrooms"
          value={numBedrooms}
          onChangeText={setNumBedrooms}
          keyboardType="numeric"
        />
        {errorNumBedrooms && (
          <Text style={styles.error}>{errorNumBedrooms}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Enter floor"
          value={floor}
          onChangeText={setFloor}
          keyboardType="numeric"
        />
        {errorFloor && <Text style={styles.error}>{errorFloor}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Enter nearby"
          value={nearby}
          onChangeText={setNearby}
        />
        {errorNearby && <Text style={styles.error}>{errorNearby}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Enter features"
          value={features}
          onChangeText={setFeatures}
          multiline={true}
          textAlignVertical="top"
        />
        {errorFeatures && <Text style={styles.error}>{errorFeatures}</Text>}

        <Pressable
          style={[
            styles.pickImageButton,
            {
              backgroundColor: isDark
                ? Colors.darkModeSecondary
                : Colors.assestGreen,
            },
          ]}
          onPress={pickImage}
        >
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
            <Pressable
              key={index}
              onLongPress={() =>
                setImage(image.filter((_, i) => i !== index))
              }
            >
              <Image source={{ uri }} style={styles.image} />
            </Pressable>
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
                    : Colors.assestGreenTwo,
                },
              ]}
              onPress={handleSubmit}
            >
              <Text
                style={{ color: isDark ? Colors.darkModeText : Colors.text }}
              >
                ADD APARTMENT
              </Text>
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
