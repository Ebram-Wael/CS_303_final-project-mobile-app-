import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import Colors from "@/components/colors";
import { useThemes } from "@/components/themeContext";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [imageurl, setImageUrl] = useState(null);

  const router = useRouter();
  const { theme } = useThemes();
  const isDark = theme === "dark";

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserDetails(userData);
          setName(userData.name);
          setPhone(userData.phone);
          setEmail(userData.email);
          setRole(userData.role);
          setImageUrl(userData.imageurl);
          setLoading(false);
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
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();        
        setUserDetails(data);
        setName(data.name);
        setPhone(data.phone);
        setEmail(data.email);
        setRole(data.role);
        setImageUrl(data.imageurl);
        setLoading(false);
        await AsyncStorage.setItem("userData", JSON.stringify(data));
      }
    }
  };

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      alert("You need to enable camera and media permissions.");
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
      aspect: [5, 5],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const deleteImage = async () => {
    Alert.alert("Delete Profile Picture", "Are you sure you want to delete the profile picture?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          setImageUrl(null);
          try {
            const userDocRef = doc(db, "Users", auth.currentUser?.uid || "");
            await updateDoc(userDocRef, { imageurl: null });
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.clear();
      Alert.alert("Logged out", "You have been logged out.");
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout.");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert("Confirm Deletion", "Are you sure you want to delete your account? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const user = auth.currentUser;
            if (user) {
              const userDocRef = doc(db, "Users", user.uid);
              await updateDoc(userDocRef, { deleted: true });
              await AsyncStorage.clear();
              await user.delete();
              Alert.alert("Deleted", "Your account has been deleted.");
              router.replace("/");
            }
          } catch (error) {
            console.error("Delete account error:", error);
            Alert.alert("Error", "Failed to delete account.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? Colors.darkModeBackground : Colors.background,
      }}
    >
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.assestGreen} />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={[styles.header, { backgroundColor: isDark ? Colors.darkModePrimary : Colors.primary }]}>
            <View style={styles.headerTopRow}>
              <Pressable onPress={handleLogout}>
                <Feather name="log-out" size={24} color="white" />
              </Pressable>
              <Text style={styles.headerText}>{name || "User Name"}</Text>
              <Pressable onPress={handleDeleteAccount}>
                <Feather name="trash-2" size={24} color={Colors.whiteText} />
              </Pressable>
            </View>

            <Pressable onPress={onImagePress}>
              {imageurl ? (
                <Image source={{ uri: imageurl }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profileImage, styles.placeholder]}>
                  <Feather name="camera" size={24} color="#aaa" />
                </View>
              )}
            </Pressable>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Feather name="settings" size={24} color={isDark ? Colors.darkModeText : Colors.text} />
              <Text style={[styles.infoText, { color: isDark ? Colors.darkModeText : Colors.text }]}>{role}</Text>
            </View>

            <View style={styles.infoRow}>
              <Feather name="user" size={24} color={isDark ? Colors.darkModeText : Colors.text} />
              <Text style={[styles.infoText, { color: isDark ? Colors.darkModeText : Colors.text }]}>{name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Feather name="phone" size={24} color={isDark ? Colors.darkModeText : Colors.text} />
              <Text style={[styles.infoText, { color: isDark ? Colors.darkModeText : Colors.text }]}>{phone}</Text>
            </View>

            <View style={styles.infoRow}>
              <Feather name="mail" size={24} color={isDark ? Colors.darkModeText : Colors.text} />
              <Text style={[styles.infoText, { color: isDark ? Colors.darkModeText : Colors.text }]}>{email}</Text>
            </View>

            <Pressable
              style={[styles.editButton, { backgroundColor: isDark ? Colors.darkModePrimary : Colors.primary }]}
              onPress={() => router.push("../../screens/edit-profile")}
            >
              <Text style={styles.buttonText}>Edit profile</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    width: "100%",
    height: "30%",
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    gap: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  infoText: {
    fontSize: 16,
  },
  editButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Profile;
