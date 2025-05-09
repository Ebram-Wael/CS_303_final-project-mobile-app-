import React, { useEffect, useState } from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from "../../services/firebase";
import { db } from "../../services/firebase";
import { setDoc, doc } from "firebase/firestore";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/components/colors";

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Register = () => {
  const navigation = useNavigation();

  async function requestNotificationPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Notification permissions not granted");
    }
  }

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  async function sendWelcomeNotification(username) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Registration Successful! ",
        body: `Welcome to Homy, ${username}! Your account has been created.`,
        data: { screen: "Home" },
      },
      trigger: null,
    });
  }

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [university, setUniversity] = useState("");

  const [errorName, setErrorName] = useState("");
  // const [errorPhone, setErrorPhone] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [errorEm, setErrorEm] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const [load, setLoad] = useState(false);

  const [borderColor, setBorderColor] = useState(Colors.assestGreen);
  const [borderColor1, setBorderColor1] = useState(Colors.assestGreen);
  const [borderColor2, setBorderColor2] = useState(Colors.assestGreen);
  const [borderColor3, setBorderColor3] = useState(Colors.assestGreen);
  const [borderColor4, setBorderColor4] = useState(Colors.assestGreen);
  const [borderColor5, setBorderColor5] = useState(Colors.assestGreen);
  const [valid, setValid] = useState(false);

  const [selectRole, setSelectRole] = useState("buyer");

  const [touchMail, setTouchMail] = useState(false);
  const [touchPass, setTouchPass] = useState(false);
  const [touchconf, setTouchConf] = useState(false);

  const ChangePassword = () => {
    setShowPassword(!showPassword);
  };
  const ChangeStyleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    setValid(validateInputs());
  }, [name, email, password, confirmPassword, selectRole]);

  const validateInputs = () => {
    let isValid = true;

    setErrorName("");
    setErrorEm("");
    // setErrorPhone("");
    setErrorPassword("");
    setErrorConfirmPassword("");

    if (!name) {
      isValid = false;
    }
    if (!email) {
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorEm("Please enter a valid email address");
      isValid = false;
    }
    if (!password) {
      isValid = false;
    } else if (password.length < 8) {
      setErrorPassword("Password must be at least 8 characters");
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      setErrorPassword(
        "Password must contain at least one letter and one number"
      );
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setErrorPassword(
        "Password must contain at least one special character (!@#$%^&*)"
      );
      isValid = false;
    } else if (password !== confirmPassword) {
      setErrorConfirmPassword("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    Keyboard.dismiss();

    if (load) return;
    setLoad(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        const userData = {
          email: user.email,
          name: name,
          phone: phone,
          role: selectRole,
          image: image,
          university: null,
        };

        if (selectRole === "buyer") {
          userData.university = university;
        }

        await setDoc(doc(db, "Users", user.uid), userData);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: name,
            phone: phone,
            role: selectRole,
            image: image,
            university: university,
          })
        );
        await AsyncStorage.setItem("user_id", JSON.stringify(user.uid));
      }
      Alert.alert("Your account has been created");
      sendWelcomeNotification(name);

      setTimeout(() => router.replace("/(drawer)/(tabs)/profile"), 2000);
      sendWelcomeNotification(name);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setTimeout(() => router.push("/login"), 2000);
        console.log(error.code);
        Alert.alert("you already have an account");
      } else {
        Alert.alert("The email address you entered is incorrect, try again.");
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
          <Text style={styles.header}>Create Account</Text>
          <View style={styles.txt}>
            <Text style={{ color: "#023336" }}>
              Create an Account So You Can Explore Our Apartment{" "}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <View style={styles.select}>
              <RadioButton.Android
                value="buyer"
                status={selectRole === "buyer" ? "checked" : "unchecked"}
                onPress={() => setSelectRole("buyer")}
                style={{ flex: 0.5 }}
              />
              <Text style={styles.label}>I'm Student</Text>
            </View>

            <View style={styles.select}>
              <RadioButton.Android
                value="seller"
                status={selectRole === "seller" ? "checked" : "unchecked"}
                onPress={() => setSelectRole("seller")}
              />
              <Text style={styles.label}>I'm Seller</Text>
            </View>
          </View>
          <View>
            <TextInput
              onFocus={() => setBorderColor("white")}
              onBlur={() => setBorderColor(Colors.assestGreen)}
              style={[styles.input, { borderColor }]}
              placeholder="Full Name"
              onChangeText={(text) => {
                setName(text);
              }}
            />
            {touchMail && errorName ? (
              <Text style={styles.errorText}>{errorName}</Text>
            ) : null}

            <TextInput
              onFocus={() => {
                setBorderColor2("white");
                setTouchMail(true);
              }}
              onBlur={() => setBorderColor2(Colors.assestGreen)}
              style={[styles.input, { borderColor: borderColor2 }]}
              placeholder="Email"
              onChangeText={(text) => {
                setEmail(text);
              }}
            />
            {touchPass && errorEm ? (
              <Text style={styles.errorText}>{errorEm}</Text>
            ) : null}

            <View
              style={[styles.inputContainer, { borderColor: borderColor3 }]}
            >
              <TextInput
                onFocus={() => {
                  setBorderColor3("white");
                  setTouchPass(true);
                }}
                onBlur={() => {
                  setBorderColor3(Colors.assestGreen);
                }}
                style={[styles.inputField]}
                secureTextEntry={showPassword}
                placeholder="Password"
                onChangeText={(text) => {
                  setPassword(text);
                }}
              />
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color={Colors.assestGray}
                onPress={ChangePassword}
                style={{}}
              />
            </View>
            {touchconf && errorPassword ? (
              <Text style={styles.errorText}>{errorPassword}</Text>
            ) : null}

            <View
              style={[styles.inputContainer, { borderColor: borderColor4 }]}
            >
              <TextInput
                onFocus={() => {
                  setBorderColor4("white");
                  setTouchConf(true);
                }}
                onBlur={() => {
                  setBorderColor4(Colors.assestGreen);
                }}
                style={[styles.inputField]}
                secureTextEntry={showConfirmPassword}
                placeholder="Confirm Password"
                onChangeText={(text) => {
                  setConfirmPassword(text);
                }}
              />
              <MaterialCommunityIcons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color={Colors.assestGray}
                onPress={ChangeStyleConfirmPassword}
              />
            </View>
            {errorConfirmPassword ? (
              <Text style={styles.errorText}>{errorConfirmPassword}</Text>
            ) : null}
          </View>
          <Pressable
            style={[styles.btn, { opacity: valid ? 1 : 0.5 }]}
            onPress={handleSignup}
            disabled={!valid}
          >
            {load ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: Colors.whiteText, fontSize: 18 }}>
                {" "}
                Sign Up
              </Text>
            )}
          </Pressable>

          <View style={styles.join}>
            <Text> Already Have an Account?</Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text
                style={{
                  color: Colors.assestGreen,
                  textDecorationLine: "underline",
                }}
              >
                {" "}
                Sign In{" "}
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
    paddingTop: 20,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  input: {
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    backgroundColor: Colors.assestWhite,
    width: "100%",
    borderRadius: 8,
    borderColor: Colors.assestGreen,
    color: Colors.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    backgroundColor: Colors.assestWhite,
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputField: {
    flex: 1,
    color: Colors.text,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.assest,
    marginBottom: 10,
  },
  txt: {
    alignItems: "center",
    marginBottom: 30,
  },
  errorText: {
    color: Colors.warning,
    marginLeft: 4,
    marginBottom: 6,
    fontSize: 12,
  },
  label: {
    color: Colors.text,
    fontSize: 16,
    marginLeft: 4,
  },
  select: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: Colors.assestGreenThree,
    borderRadius: 6,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: Colors.assestGreen,
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  join: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
});

export default Register;
