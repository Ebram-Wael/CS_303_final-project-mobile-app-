import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import auth from "@/services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/components/colors";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [borderColor, setBorderColor] = useState("#26326E");
  const [borderColor1, setBorderColor1] = useState("#26326E");
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const ChangePassword = () => {
    setShowPassword(!showPassword);
  };

  async function requestNotificationPermissions() {
    if (Platform.OS !== "web") {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Notification permissions not granted");
      }
    }
  }

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  async function sendWelcomeNotification(username: string) {
    if (Platform.OS !== "web") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Welcome Back!",
          body: `Hello ${username}, it's great to see you again at Homy.`,
          data: { screen: "Home" },
        },
        trigger: null,
      });
    }
  }
  
  useEffect(() => {
    const isEmailValid = email.includes("@");
    const isPasswordValid = password.length >= 8;
    setIsValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  const handleLogIN = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const cardinality = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = cardinality.user;
      const docc = doc(db, "Users", user.uid);
      const userdoc = await getDoc(docc);
      let userName = "";
      if (userdoc.exists()) {
        const data = userdoc.data();
        userName = data.name;
      }
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: name,
          phone: user.phoneNumber,
          imageurl: user.photoURL,
        })
      );
      await AsyncStorage.setItem("user_id", JSON.stringify(user.uid));
      sendWelcomeNotification(userName);
      setTimeout(() => router.replace("/(drawer)/(tabs)/profile"), 500);
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        Alert.alert("Invalid Password or email");
        setLoading(false);
        setEmail("");
        setPassword("");
      } else if (error.code === "auth/missing-password") {
        Alert.alert("Password is required");
      } else {
        Alert.alert("Email is required");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.header}>Login Here</Text>
          <View style={styles.txt}>
            <Text style={{ color: Colors.primary }}>
              Welcome Back You've Been Missed!
            </Text>
          </View>
          <View>
            {/* <Image
              style={{ width: 250, height: 250, alignSelf: "center" }}
              source={log}
            /> */}
            <TextInput
              onFocus={() => setBorderColor(Colors.secondary)}
              onBlur={() => setBorderColor(Colors.primary)}
              style={[styles.input, { borderColor }]}
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
            <View
              style={[styles.inputContainer, { borderColor: borderColor1 }]}
            >
              <TextInput
                onFocus={() => setBorderColor1(Colors.secondary)}
                onBlur={() => setBorderColor1(Colors.primary)}
                style={[styles.inputField]}
                secureTextEntry={showPassword}
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
                value={password}
              />
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color={Colors.assestGray}
                onPress={ChangePassword}
              />
            </View>
          </View>

          <Pressable
            style={[styles.btn, { opacity: isValid ? 1 : 0.5 }]}
            onPress={handleLogIN}
            disabled={!isValid}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={{ color: Colors.whiteText, fontSize: 18 }}>
                Login
              </Text>
            )}
          </Pressable>

          <View style={styles.join}>
            <Text> Create an Account?</Text>
            <Pressable onPress={() => router.push("/register")}>
              <Text
                style={{
                  color: Colors.assestGreen,
                  textDecorationLine: "underline",
                }}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 50,
    margin: 12,
    padding: 10,
    borderWidth: 1,
    backgroundColor: "white",
    width: 320,
    borderRadius: 5,
    borderColor: "#FFFE91",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#023336",
  },
  txt: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 40,
    fontSize: 20,
    justifyContent: "center",
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    width: 250,
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    alignSelf: "center",
  },
  join: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    margin: 12,
    borderWidth: 1,
    backgroundColor: "white",
    width: 320,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputField: {
    flex: 1,
    height: "100%",
  },
  errorText: {
    color: Colors.warning,
    marginLeft: 12,
    marginBottom: 5,
  },
});

export default Login;
