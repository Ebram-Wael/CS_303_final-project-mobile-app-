import React from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from "react-native";
import Colors from "@/components/colors";
import { useThemes } from "@/components/themeContext";
import DarkModeIcon from "@/assets/icons/dark_mode.svg";
import FlagIcon from "@/assets/icons/flag_icon.svg";
import MailIcon from "@/assets/icons/mail_icon.svg";
import Privacy from "@/assets/icons/shield_person_icon.svg";
import { useRouter } from "expo-router";
import reportUs from "@/app/screens/reportUs";

const Settings = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useThemes();
  const isDark = theme === "dark";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark
              ? Colors.darkModeBackground
              : Colors.background,
          },
        ]}
      >
        <Text
          style={[
            styles.head,
            { color: isDark ? Colors.whiteText : Colors.text },
          ]}
        >
          Setting
        </Text>
        <Text
          style={[
            styles.text,
            { color: isDark ? Colors.whiteText : Colors.assestGray },
          ]}
        >
          Preferences
        </Text>
        <View style={styles.block}>
          <View style={styles.darkModeStyle}>
            <View style={styles.iconTextRow}>
              <DarkModeIcon width={20} height={20} />
              <Text style={[styles.text, { color: Colors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>
        <Text
          style={[
            styles.text,
            { color: isDark ? Colors.whiteText : Colors.assestGray },
          ]}
        >
          Help
        </Text>
        <View style={styles.block}>
          <Pressable
            onPress={() => router.push("/screens/reportUs")}
            style={styles.iconTextRow}
          >
            <FlagIcon width={20} height={20} />
            <Text style={[styles.text, { color: Colors.text }]}>Report Us</Text>
          </Pressable>
        </View>
        <View style={styles.block}>
          <Pressable
            onPress={() => router.push("../screens/contactUs")}
            style={styles.iconTextRow}
          >
            <MailIcon width={20} height={20} />
            <Text style={[styles.text, { color: Colors.text }]}>
              Contact Us
            </Text>
          </Pressable>
        </View>
        <Text
          style={[
            styles.text,
            { color: isDark ? Colors.whiteText : Colors.assestGray },
          ]}
        >
          Privacy
        </Text>
        <View style={styles.block}>
          <Pressable
            onPress={() => router.push("../screens/privacy")}
            style={styles.iconTextRow}>
            <Privacy width={20} height={20} />
            <Text style={[styles.text, { color: Colors.text }]}>
              Privacy Policy
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 17,
  },
  head: {
    fontSize: 30,
    fontWeight: "bold",
  },
  darkModeStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  block: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 18,
    letterSpacing: 2,
  },
});
