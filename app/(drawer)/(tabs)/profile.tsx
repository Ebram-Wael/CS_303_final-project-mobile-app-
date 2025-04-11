import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

const Profile: React.FC = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [imageurl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserDetails(userData);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };
    getUserDetails();
    getUser();
    requestPermissions();
  }, []);

  const getUser = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserDetails(data);
          setName(data.name);
          setPhone(data.phone);
          setEmail(data.email);
          setImageUrl(data.imageurl);
          setLoading(false);
        }
      }
    });
  };

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      alert("You need to enable camera and media permissions.");
    }
  };

  const validateInputs = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Name cannot be empty.");
      return false;
    }
    if (!phone.match(/^\d{11}$/)) {
      Alert.alert("Validation Error", "Phone number must be 11 digits.");
      return false;
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      Alert.alert("Validation Error", "Invalid email format.");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!userDetails || !validateInputs()) return;
    try {
      const userDocRef = doc(db, "Users", auth.currentUser?.uid || "");
      await updateDoc(userDocRef, {
        name,
        phone,
        email,
        imageurl,
      });
      Alert.alert("Success", "Profile updated successfully!");
      setUserDetails({ ...userDetails, name, phone, email, imageurl });
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const deleteImage = async () => {
    Alert.alert("Delete Profile Picture", "Are you sure you want to delete the profile picture?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          setImageUrl(null); 
          try {
            const userDocRef = doc(db, "Users", auth.currentUser?.uid || "");
            await updateDoc(userDocRef, {
              imageurl: null, 
            });
            Alert.alert("Success", "Profile picture deleted successfully!");
          } catch (error) {
            console.error("Error deleting image:", error);
            Alert.alert("Error", "Failed to delete profile picture.");
          }
        },
      },
    ]);
  };

  const onImagePress = () => {
    Alert.alert("Change Profile Picture", "Select an option", [
      { text: "Choose from Gallery", onPress: selectImage },
      { text: "Take a Photo", onPress: takePhoto },
      { text: "Delete Photo", onPress: deleteImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={{ alignItems: "center" }}>
          <Pressable onPress={onImagePress}>
            {imageurl ? (
              <Image source={{ uri: imageurl }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImage, styles.placeholder]}>
                <Text style={{ color: "#aaa" }}>Add Photo</Text>
              </View>
            )}
          </Pressable>

          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            editable={editing}
          />

          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={editing}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            editable={editing}
            keyboardType="phone-pad"
          />

          {editing ? (
            <Pressable style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.button} onPress={() => setEditing(true)}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  label: {
    width: 300,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    width: 300,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "rgb(8 50 106)",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: 300,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 50,
  },
  placeholder: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
