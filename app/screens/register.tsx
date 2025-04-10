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
  ScrollView,
  TouchableOpacity
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
import colors from '@/components/colors';

const reg = require('../../assets/images/join.jpg');

const Register = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState(""); 
  const [image ,setImage] = useState(""); 
  const [university, setUniversity] = useState("");
  

  const [errorName, setErrorName] = useState("");
  // const [errorPhone, setErrorPhone] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [errorEm, setErrorEm] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const [load, setLoad] = useState(false);

  const [borderColor, setBorderColor] = useState(colors.orange);
  const [borderColor1, setBorderColor1] = useState(colors.orange);
  const [borderColor2, setBorderColor2] = useState(colors.orange);
  const [borderColor3, setBorderColor3] = useState(colors.orange);
  const [borderColor4, setBorderColor4] = useState(colors.orange);
  const [borderColor5, setBorderColor5] = useState(colors.orange);
  const [valid, setValid] = useState(false);

  const [selectRole, setSelectRole] = useState("buyer");

  const [touchMail, setTouchMail] = useState(false);
  const [touchPass, setTouchPass] = useState(false);
  const [touchconf , setTouchConf] = useState(false);


  const ChangePassword = () => {
    setShowPassword(!showPassword);
  };
  const ChangeStyleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
   setValid(validateInputs());
  },[ name, email, password, confirmPassword, selectRole]); 

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
    }
     else if (password !== confirmPassword) {
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
      }
        Alert.alert("Your account has been created");
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
          })
        );
        setTimeout(() => router.replace("/(drawer)/(tabs)/profile"), 2000);
      
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setTimeout(() => router.push("/screens/login"), 2000);
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
       <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} 
       keyboardShouldPersistTaps="handled"
       showsVerticalScrollIndicator={false} >
        <Text style={styles.header}>Create Account</Text>
        <View style={styles.txt}>
          <Text style={{ color: colors.background }}>
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
            onFocus={() => setBorderColor(colors.background)}
            onBlur={() => setBorderColor(colors.orange) }
            style={[styles.input, { borderColor }]}
            placeholder="Full Name"
            onChangeText={(text) => {
              setName(text);
            }}

          />
          {touchMail &&errorName ? <Text style={styles.errorText}>{errorName}</Text> : null}
          

          <TextInput
            onFocus={() => {setBorderColor2(colors.background) ;setTouchMail(true)}}
            onBlur={() => setBorderColor2(colors.orange) }
            style={[styles.input, { borderColor: borderColor2 }]}
            placeholder="Email"
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
          {touchPass&&errorEm ? <Text style={styles.errorText}>{errorEm}</Text> : null}

          <View style={[styles.inputContainer, { borderColor: borderColor3 }]}>
            <TextInput
              onFocus={() => {setBorderColor3(colors.background)
                setTouchPass(true); 

              }}
              onBlur={() => {
                setBorderColor3(colors.orange); 
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
              color={colors.gray}
              onPress={ChangePassword}
              style={{}}
            />
          </View>
          {touchconf&&errorPassword ? (
            <Text style={styles.errorText}>{errorPassword}</Text>
          ) : null}

          <View style={[styles.inputContainer, { borderColor: borderColor4 }]}>
            <TextInput
              onFocus={() => {setBorderColor4(colors.background) ;
                setTouchConf(true) }}
              onBlur={() => {
                setBorderColor4(colors.orange); 
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
              color={colors.gray}
              onPress={ChangeStyleConfirmPassword}
            />
          </View>
          {errorConfirmPassword ? (
            <Text style={styles.errorText}>{errorConfirmPassword}</Text>
          ) : null}
        </View>
        <Pressable style={[styles.btn , {opacity: valid ? 1:0.5 } ]} onPress={handleSignup} disabled={!valid}>
          {load ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={{ color: colors.white, fontSize: 18 }}> Sign Up</Text>
          )}
        </Pressable>

        <View style={styles.join}>
          <Text> Already Have an Account?</Text>
          <Pressable onPress={() => router.push("/screens/login")}>
            <Text style={{ color: colors.black, textDecorationLine: "underline" }}>
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
    backgroundColor: colors.background,
    width: 320,
    borderRadius: 5,
  },
  btn: {
    backgroundColor: colors.blue,
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
    backgroundColor: colors.white,
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
    color: colors.background,
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

    backgroundColor: colors.white,
  },
  errorText: {
    color: colors.red,
    marginLeft: 12,
    marginBottom: 5,
  },
  label: {
    color: colors.black,
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
    backgroundColor: colors.white,
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
