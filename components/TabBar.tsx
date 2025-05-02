import { View, Platform, StyleSheet } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { PlatformPressable } from "@react-navigation/elements";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import React from "react";
import HouseIcon from "@/assets/icons/house-01-svgrepo-com.svg";
import HouseFilledIcon from "@/assets/icons/house-filled.svg";
import CartIcon from "@/assets/icons/cart-svgrepo-com.svg";
import CartFilledIcon from "@/assets/icons/cart-3-svgrepo-com.svg";
import ExploreIcon from "@/assets/icons/explore-svgrepo-com.svg";
import ExploreFilledIcon from "@/assets/icons/explore-fillled.svg";
import ProfileIcon from "@/assets/icons/profile-svgrepo-com.svg";
import ProfileFilledIcon from "@/assets/icons/profile-filled.svg";
import Colors from "@/components/colors";
import { useThemes } from "@/components/themeContext";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  const { theme } = useThemes();
  const isDark = theme === "dark";

  const icons = {
    index: {
      outline: (props: any) => <HouseIcon width={30} height={30} {...props} />,
      filled: (props: any) => (
        <HouseFilledIcon width={30} height={30} {...props} />
      ),
    },
    cart: {
      outline: (props: any) => <CartIcon width={30} height={30} {...props} />,
      filled: (props: any) => (
        <CartFilledIcon width={30} height={30} {...props} />
      ),
    },
    explore: {
      outline: (props: any) => (
        <ExploreIcon width={30} height={30} {...props} />
      ),
      filled: (props: any) => (
        <ExploreFilledIcon width={30} height={30} {...props} />
      ),
    },
    profile: {
      outline: (props: any) => (
        <ProfileIcon width={30} height={30} {...props} />
      ),
      filled: (props: any) => (
        <ProfileFilledIcon width={30} height={30} {...props} />
      ),
    },
  };

  return (
    <View
      style={[
        styles.tabbar,
        { backgroundColor: isDark ? Colors.darkModePrimary : Colors.primary },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
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

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const IconComponent = isFocused
          ? icons[route.name as keyof typeof icons]?.filled
          : icons[route.name as keyof typeof icons]?.outline;

        return (
          <PlatformPressable
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
            key={route.key}
          >
            {IconComponent &&
              IconComponent({
                color: isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
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
    paddingVertical: 12,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
});
