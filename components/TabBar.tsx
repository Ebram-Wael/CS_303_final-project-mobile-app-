import { View, Platform, StyleSheet } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import React from "react";
import HouseIcon from "@/assets/icons/house.svg";
import SearchIcon from "@/assets/icons/search.svg";
import ExploreIcon from "@/assets/icons/explore.svg";
import ProfileIcon from "@/assets/icons/profile.svg";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  const icon = {
    index: (props: any) => <HouseIcon width={30} height={30} {...props} />,
    search: (props: any) => <SearchIcon width={30} height={30} {...props} />,
    explore: (props: any) => <ExploreIcon width={30} height={30} {...props} />,
    profile: (props: any) => <ProfileIcon width={30} height={30} {...props} />,
  };
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

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
            {icon[route.name as keyof typeof icon]({
              color: isFocused ? colors.primary : colors.text,
            })}
            <Text style={{ color: isFocused ? colors.primary : colors.text }}>
              {typeof label === "function"
                ? label({
                    focused: isFocused,
                    color: isFocused ? colors.primary : colors.text,
                    position: "below-icon",
                    children: "",
                  })
                : label}
            </Text>
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
    backgroundColor: "#fff",
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
