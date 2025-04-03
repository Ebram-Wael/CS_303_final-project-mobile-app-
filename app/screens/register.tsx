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
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
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
const reg = require('../../assets/images/join.jpg');

const Register = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const router = useRouter();
  const [name, setName] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [errorName, setErrorName] = useState("");
  const [errorLast, setErrorLast] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [errorEm, setErrorEm] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const [load, setLoad] = useState(false);

  const [borderColor, setBorderColor] = useState("#F36F27");
  const [borderColor1, setBorderColor1] = useState("#F36F27");
  const [borderColor2, setBorderColor2] = useState("#F36F27");
  const [borderColor3, setBorderColor3] = useState("#F36F27");
  const [borderColor4, setBorderColor4] = useState("#F36F27");
  const [borderColor5, setBorderColor5] = useState("#F36F27");

  const [selectRole, setSelectRole] = useState("buyer");

  const ChangePassword = () => {
    setShowPassword(!showPassword);
  };
  const ChangeStyleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateInputs = () => {
    let isValid = true;

    setErrorName("");
    setErrorLast("");
    setErrorEm("");
    setErrorPhone("");
    setErrorPassword("");
    setErrorConfirmPassword("");

    if (!name) {
      setErrorName("First name is required");
      isValid = false;
    }
    if (!last) {
      setErrorLast("Last name is required");
      isValid = false;
    }
    if (!email) {
      setErrorEm("Email is required");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorEm("Please enter a valid email address");
      isValid = false;
    }

    if (!phone) {
      setErrorPhone("Phone number is required");
      isValid = false;
    } else if (phone.length < 11 || phone.length >= 12) {
      setErrorPhone("Please enter a valid phone number");
      isValid = false;
    }
    if (!password) {
      setErrorPassword("Password is required");
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
    }
    if (!confirmPassword) {
      setErrorConfirmPassword("Confirm password is required");
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
    if (!validateInputs()) return;

    if (load) return;
    setLoad(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          name: `${name} ${last}`,
          phone: phone,
          role: selectRole,
        });
        Alert.alert("Your account has been created");
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
          })
        );
        setTimeout(() => router.push("/(drawer)/(tabs)/profile"), 2000);
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setTimeout(() => router.push("/screens/login"), 2000);
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
       <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} 
       keyboardShouldPersistTaps="handled"
       showsVerticalScrollIndicator={false} >
        <Text style={styles.header}>Create Account</Text>
        <View style={styles.txt}>
          <Text style={{ color: "#26326E" }}>
            Create an Account So You Can Explore Our Apartment{" "}
          </Text>
        </View>
        <Image style={{width:200 ,height:200 ,alignSelf:'center'}} source={reg}/>
        <View style={{ display: "flex", flexDirection: "row", gap: 80 }}>
          <View style={styles.select}>
            <RadioButton.Android
              value="buyer"
              status={selectRole === "buyer" ? "checked" : "unchecked"}
              onPress={() => setSelectRole("buyer")}
              style={{ flex: 0.5 }}
            />
            <Text style={styles.label}>I'm Customer</Text>
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
            onFocus={() => setBorderColor("#26326E")}
            onBlur={() => setBorderColor("#F36F27")}
            style={[styles.input, { borderColor }]}
            placeholder="First Name"
            onChangeText={(text) => {
              setName(text);
            }}
          />
          {errorName ? <Text style={styles.errorText}>{errorName}</Text> : null}
          <TextInput
            onFocus={() => setBorderColor1("#26326E")}
            onBlur={() => setBorderColor1("#F36F27")}
            style={[styles.input, { borderColor: borderColor1 }]}
            placeholder="Last Name"
            onChangeText={(text) => {
              setLast(text);
            }}
          />
          {errorLast ? <Text style={styles.errorText}>{errorLast}</Text> : null}

          <TextInput
            onFocus={() => setBorderColor5("#26326E")}
            onBlur={() => setBorderColor5("#F36F27")}
            style={[styles.input, { borderColor: borderColor5 }]}
            placeholder="phone"
            onChangeText={(text) => {
              setPhone(text);
            }}
            keyboardType="numeric"
          />
          {errorPhone ? (
            <Text style={styles.errorText}>{errorPhone}</Text>
          ) : null}

          <TextInput
            onFocus={() => setBorderColor2("#26326E")}
            onBlur={() => setBorderColor2("#F36F27")}
            style={[styles.input, { borderColor: borderColor2 }]}
            placeholder="Email"
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
          {errorEm ? <Text style={styles.errorText}>{errorEm}</Text> : null}

          <View style={[styles.inputContainer, { borderColor: borderColor3 }]}>
            <TextInput
              onFocus={() => setBorderColor3("#26326E")}
              onBlur={() => setBorderColor3("#F36F27")}
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
              color="#aaa"
              onPress={ChangePassword}
              style={{}}
            />
          </View>
          {errorPassword ? (
            <Text style={styles.errorText}>{errorPassword}</Text>
          ) : null}

          <View style={[styles.inputContainer, { borderColor: borderColor4 }]}>
            <TextInput
              onFocus={() => setBorderColor4("#26326E")}
              onBlur={() => setBorderColor4("#F36F27")}
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
              color="#aaa"
              onPress={ChangeStyleConfirmPassword}
            />
          </View>
          {errorConfirmPassword ? (
            <Text style={styles.errorText}>{errorConfirmPassword}</Text>
          ) : null}
        </View>

        <Pressable style={styles.btn} onPress={handleSignup}>
          {load ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontSize: 18 }}> Sign Up</Text>
          )}
        </Pressable>

        <View style={styles.join}>
          <Text> Already Have an Account?</Text>
          <Pressable onPress={() => router.push("/screens/login")}>
            <Text style={{ color: "#2A2438", textDecorationLine: "underline" }}>
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
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    backgroundColor: "white",
    width: 320,
    borderRadius: 5,
  },
  btn: {
    backgroundColor: "#26326E",
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 20,

  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#26326E",
  },
  txt: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 40,
    justifyContent: "center",
    fontSize: 13,
  },
  screen: {
    display: "none",
    width: 300,
    height: 300,
    zIndex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    position: "absolute",
    bottom: 20,

    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    marginLeft: 12,
    marginBottom: 5,
  },
  label: {
    color: "#2A2438",
    fontSize: 16,
    marginLeft: 5,
  },
  select: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    textAlignVertical: "center",
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
});

export default Register;
