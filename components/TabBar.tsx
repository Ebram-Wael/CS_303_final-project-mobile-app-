import { View, Platform, StyleSheet, Text } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { PlatformPressable } from "@react-navigation/elements";
import {
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import HouseIcon from "@/assets/icons/house-01-svgrepo-com.svg";
import HouseFilledIcon from "@/assets/icons/house-filled.svg";
import CartIcon from "@/assets/icons/cart-svgrepo-com.svg";
import CartFilledIcon from "@/assets/icons/cart-3-svgrepo-com.svg";
import ExploreIcon from "@/assets/icons/explore-svgrepo-com.svg";
import ExploreFilledIcon from "@/assets/icons/explore-fillled.svg";
import ProfileIcon from "@/assets/icons/profile-svgrepo-com.svg";
import ProfileFilledIcon from "@/assets/icons/profile-filled.svg";
import CheckIcon from "@/assets/icons/check-to-slot-solid.svg";
import Amount from "@/assets/icons/money-check-dollar-solid.svg"
import Add from "@/assets/icons/plus-solid.svg"
import Colors from "@/components/colors";
import { useThemes } from "@/components/themeContext";
import { getAuth } from "firebase/auth";
import auth, { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";


export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { theme } = useThemes();
  const isDark = theme === "dark";

  const [role, setRole] = useState();

  const getUserRole = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userDocRef);
      setRole(userDoc.data()?.role);
      if(role === "admin") {
        console.log("User role is admin");
      }
      if(role === "buyer") {  
        console.log("User role is buyer");
      }
      if(role === "seller") {
        console.log("User role is seller");
      } 
    }
  }
  useEffect(() => {
    getUserRole();
  }, []);


  const icons = {
    index: {
      outline: (props: any) => <HouseIcon width={24} height={24} {...props} />,
      filled: (props: any) => <HouseFilledIcon width={24} height={24} {...props} />,
    },
    explore: {
      outline: (props: any) => <ExploreIcon width={24} height={24} {...props} />,
      filled: (props: any) => <ExploreFilledIcon width={24} height={24} {...props} />,
    },
    cart: {
      outline: (props: any) => <CartIcon width={24} height={24} {...props} />,
      filled: (props: any) => <CartFilledIcon width={24} height={24} {...props} />,
    },
    profile: {
      outline: (props: any) => <ProfileIcon width={24} height={24} {...props} />,
      filled: (props: any) => <ProfileFilledIcon width={24} height={24} {...props} />,
    },
    addApartment: {
      outline: (props: any) => <Add width={24} height={24} {...props} />,
      filled: (props: any) => <Add width={24} height={24} {...props} />,
    },
    approve: {
      outline: (props: any) => <CheckIcon width={24} height={24} {...props} />,  
      filled: (props: any) => <CheckIcon width={24} height={24} {...props} />,
    },
    amount: {
      outline: (props: any) => <Amount width={24} height={24} {...props} />,  
      filled: (props: any) => <Amount width={24} height={24} {...props} />,
    },
  };

  const filteredRoutes = state.routes.filter(route => {
    if (role === "admin") {
      return ["amount", "approve","profile"].includes(route.name);
    }
    if (role === "buyer") {
      return ["index", "explore", "cart", "profile"].includes(route.name);
    }
    if (role === "seller") {
      return ["index", "explore", "addApartment", "profile"].includes(route.name);
    }
    
    return false;
  });



  return (
    <View style={[
      styles.tabbar, 
      { 
        backgroundColor: isDark ? Colors.darkModePrimary : Colors.primary,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0
      }
    ]}>
      {filteredRoutes.map((route, index) => {
        const isFocused = state.index === index;

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
          ? icons[route.name as keyof typeof icons]?.filled 
          : icons[route.name as keyof typeof icons]?.outline;


        return (
          <PlatformPressable
            key={route.key}
            onPress={onPress}
            style={styles.tabbarItem}
          >
              {IconComponent &&
               IconComponent({
                color: isFocused ? Colors.assestWhite : Colors.assestGray,
              })}
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
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
});