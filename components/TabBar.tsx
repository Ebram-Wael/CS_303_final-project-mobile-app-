import {
  View,
  Platform,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { PlatformPressable } from "@react-navigation/elements";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import HouseIcon from "@/assets/icons/house-01-svgrepo-com.svg";
import HouseFilledIcon from "@/assets/icons/house-filled.svg";
import CartIcon from "@/assets/icons/cart-svgrepo-com.svg";
import CartFilledIcon from "@/assets/icons/cart-3-svgrepo-com.svg";
import ExploreIcon from "@/assets/icons/explore-svgrepo-com.svg";
import ExploreFilledIcon from "@/assets/icons/explore-fillled.svg";
import ProfileIcon from "@/assets/icons/profile-svgrepo-com.svg";
import ProfileFilledIcon from "@/assets/icons/profile-filled.svg";
import CheckIcon from "@/assets/icons/check.svg";
import CheckIconFilled from "@/assets/icons/check-filled.svg";
import AmountIcon from "@/assets/icons/money.svg";
import AmountIconFilled from "@/assets/icons/money-filled.svg";
import AddIcon from "@/assets/icons/add.svg";
import AddIconFilled from "@/assets/icons/add-filled.svg";
import Colors from "@/components/colors";
import { useThemes } from "@/components/themeContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import auth, { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { theme } = useThemes();
  const isDark = theme === "dark";

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setLoading(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        setLoading(true);

        if (authUser) {
          const userDocRef = doc(db, "Users", authUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User role found:", userData?.role);
            setRole(userData?.role || "buyer");
          } else {
            // console.log("No user document found");
            setRole("buyer");
          }
        } else {
          // console.log("No auth user - setting default role");
          setRole("buyer");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole("buyer");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };

    getUserRole();

    return () => {};
  }, [authUser]);

  const icons = {
    index: {
      outline: (props) => <HouseIcon width={30} height={30} {...props} />,
      filled: (props) => <HouseFilledIcon width={30} height={30} {...props} />,
    },
    explore: {
      outline: (props) => <ExploreIcon width={30} height={30} {...props} />,
      filled: (props) => (
        <ExploreFilledIcon width={30} height={30} {...props} />
      ),
    },
    cart: {
      outline: (props) => <CartIcon width={30} height={30} {...props} />,
      filled: (props) => <CartFilledIcon width={30} height={30} {...props} />,
    },
    profile: {
      outline: (props) => <ProfileIcon width={30} height={30} {...props} />,
      filled: (props) => (
        <ProfileFilledIcon width={30} height={30} {...props} />
      ),
    },
    addApartment: {
      outline: (props) => <AddIcon width={30} height={30} {...props} />,
      filled: (props) => <AddIconFilled width={30} height={30} {...props} />,
    },
    approve: {
      outline: (props) => <CheckIcon width={30} height={30} {...props} />,
      filled: (props) => <CheckIconFilled width={30} height={30} {...props} />,
    },
    amount: {
      outline: (props) => <AmountIcon width={30} height={30} {...props} />,
      filled: (props) => <AmountIconFilled width={30} height={30} {...props} />,
    },
  };

  const defaultTabs = ["index", "explore", "profile"];

  const visibleTabs = (role) => {
    if (role === "admin") {
      return ["amount", "approve", "profile"];
    }
    if (role === "buyer") {
      return ["index", "explore", "cart", "profile"];
    }
    if (role === "seller") {
      return ["index", "explore", "addApartment", "profile"];
    }
    return defaultTabs;
  };

  const tabsToShow = loading ? defaultTabs : visibleTabs(role);
  const filteredRoutes = state.routes.filter((route) =>
    tabsToShow.includes(route.name)
  );

  return (
    <View
      style={[
        styles.tabbar,
        {
          backgroundColor: isDark ? Colors.darkModePrimary : Colors.primary,
          paddingBottom: Platform.OS === "ios" ? 20 : 0,
        },
      ]}
    >
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={Colors.background} size="small" />
        </View>
      )}
      {filteredRoutes.map((route, index) => {
        const originalIndex = state.routes.findIndex(
          (r) => r.key === route.key
        );
        const isFocused = state.index === originalIndex;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const IconComponent = isFocused
          ? icons[route.name]?.filled
          : icons[route.name]?.outline;

        return (
          <PlatformPressable
            key={route.key}
            onPress={onPress}
            style={styles.tabbarItem}
          >
            {IconComponent && (
              <IconComponent
                color={isFocused ? Colors.background : Colors.primary}
              />
            )}
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    position: "relative",
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 4,
    borderRadius: 10,
    margin: 4,
    zIndex: 100,
  },
});
