import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Slider from "@react-native-community/slider";
import Checkbox from "expo-checkbox";
import { useThemes } from "@/components/themeContext";
import Colors from "@/components/colors";

type FilterOption = {
  id: string;
  label: string;
  selected: boolean;
};

type FilterCategory = {
  id: string;
  name: string;
  options: FilterOption[];
};

type FilterComponentProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    priceRange: { min: number; max: number };
    bedrooms: string[];
    locations: string[];
    status: string[];
    propertyType: string[];
    floors: string[];
  }) => void;
  initialFilters: {
    priceRange: { min: number; max: number };
    bedrooms: string[];
    locations: string[];
    status: string[];
    propertyType: string[];
    floors: string[];
  };
  availableLocations?: string[];
  availableFloors?: string[];
};

const Filters: React.FC<FilterComponentProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
  availableLocations = [],
  availableFloors = [],
}) => {
  const { theme } = useThemes();
  const isDark = theme === "dark";
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange);
  const [categories, setCategories] = useState<FilterCategory[]>([]);

  // Initialize categories only once when component mounts or when initialFilters change
  useEffect(() => {
    // Define static categories
    const staticCategories: FilterCategory[] = [
      {
        id: "bedrooms",
        name: "Bedrooms",
        options: [
          {
            id: "1",
            label: "1 Bedroom",
            selected: initialFilters.bedrooms.includes("1"),
          },
          {
            id: "2",
            label: "2 Bedrooms",
            selected: initialFilters.bedrooms.includes("2"),
          },
          {
            id: "3",
            label: "3 Bedrooms",
            selected: initialFilters.bedrooms.includes("3"),
          },
          {
            id: "4+",
            label: "4+ Bedrooms",
            selected: initialFilters.bedrooms.includes("4+"),
          },
        ],
      },
      {
        id: "status",
        name: "Status",
        options: [
          {
            id: "Available",
            label: "Available",
            selected: initialFilters.status.includes("Available"),
          },
          {
            id: "Unavailable",
            label: "Unavailable",
            selected: initialFilters.status.includes("Unavailable"),
          },
          {
            id: "Rented",
            label: "Rented",
            selected: initialFilters.status.includes("Rented"),
          },
        ],
      },
      {
        id: "propertyType",
        name: "Property Type",
        options: [
          {
            id: "Apartment",
            label: "Apartment",
            selected: initialFilters.propertyType.includes("Apartment"),
          },
          {
            id: "House",
            label: "House",
            selected: initialFilters.propertyType.includes("House"),
          },
          {
            id: "Condo",
            label: "Condo",
            selected: initialFilters.propertyType.includes("Condo"),
          },
          {
            id: "Studio",
            label: "Studio",
            selected: initialFilters.propertyType.includes("Studio"),
          },
        ],
      },
      // Add dynamic categories with initial empty options
      {
        id: "locations",
        name: "Locations",
        options: availableLocations.map((location) => ({
          id: location,
          label: location,
          selected: initialFilters.locations.includes(location),
        })),
      },
      {
        id: "floors",
        name: "Floor",
        options: availableFloors.map((floor) => ({
          id: floor,
          label: floor,
          selected: initialFilters.floors.includes(floor),
        })),
      },
    ];

    setCategories(staticCategories);
    setPriceRange(initialFilters.priceRange);
  }, [initialFilters]);

  // Memoize toggleOption to prevent re-creation on every render
  const toggleOption = useCallback((categoryId: string, optionId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? {
            ...category,
            options: category.options.map((option) =>
              option.id === optionId
                ? { ...option, selected: !option.selected }
                : option
            ),
          }
          : category
      )
    );
  }, []);

  const handleApply = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    const selectedFilters = {
      priceRange,
      bedrooms:
        categories
          .find((c) => c.id === "bedrooms")
          ?.options.filter((o) => o.selected)
          .map((o) => o.id) || [],
      propertyType:
        categories
          .find((c) => c.id === "propertyType")
          ?.options.filter((o) => o.selected)
          .map((o) => o.id) || [],
      status:
        categories
          .find((c) => c.id === "status")
          ?.options.filter((o) => o.selected)
          .map((o) => o.id) || [],
      locations:
        categories
          .find((c) => c.id === "locations")
          ?.options.filter((o) => o.selected)
          .map((o) => o.id) || [],
      floors:
        categories
          .find((c) => c.id === "floors")
          ?.options.filter((o) => o.selected)
          .map((o) => o.id) || [],
    };

    onApply(selectedFilters);
    onClose();
  }, [categories, priceRange, onApply, onClose]);

  const handleReset = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    } setPriceRange({ min: 0, max: 10000 });
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        options: category.options.map((option) => ({
          ...option,
          selected: false,
        })),
      }))
    );
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View
        style={[
          styles.filterContainer,
          {
            backgroundColor: isDark
              ? Colors.darkModeBackground
              : Colors.background,
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: isDark ? Colors.darkModeText : Colors.text },
              ]}
            >
              Filter Properties
            </Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Ionicons
                name="close"
                size={24}
                color={isDark ? Colors.darkModeText : Colors.text}
              />
            </Pressable>
          </View>

          {/* Price range */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? Colors.darkModeText : Colors.text },
              ]}
            >
              Price Range (EGP)
            </Text>
            <Text
              style={[
                styles.priceText,
                { color: isDark ? Colors.assestWhite : Colors.primary },
              ]}
            >
              {priceRange.min.toLocaleString()} -{" "}
              {priceRange.max.toLocaleString()}
            </Text>
            <Slider
              minimumValue={0}
              maximumValue={10000}
              minimumTrackTintColor={
                isDark ? Colors.darkIndicator : Colors.primary
              }
              maximumTrackTintColor={
                isDark ? Colors.assestWhite : Colors.secondary
              }
              thumbTintColor={isDark ? Colors.darkIndicator : Colors.primary}
              step={500}
              value={priceRange.max}
              onValueChange={(value) =>
                setPriceRange({ ...priceRange, max: value })
              }
              style={styles.slider}
            />
          </View>

          {/* Filter Categories */}
          {categories.map(
            (category) =>
              // Only show categories that have options
              category.options.length > 0 && (
                <View key={category.id} style={styles.section}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: isDark ? Colors.darkModeText : Colors.text },
                    ]}
                  >
                    {category.name}
                  </Text>
                  <View style={styles.optionsContainer}>
                    {category.options.map((option) => (
                      <Pressable
                        key={option.id}
                        style={({ pressed }) => [
                          styles.option,
                          {
                            backgroundColor: isDark
                              ? Colors.darkModeSecondary
                              : Colors.whiteText,
                          },
                          pressed && styles.pressed,
                          option.selected && styles.optionSelected,
                        ]}
                        onPress={() => toggleOption(category.id, option.id)}
                      >
                        <Checkbox
                          value={option.selected}
                          onValueChange={() =>
                            toggleOption(category.id, option.id)
                          }
                          color={option.selected ? Colors.primary : undefined}
                          style={styles.checkbox}
                        />
                        <Text
                          style={[
                            styles.optionText,
                            {
                              color: isDark
                                ? Colors.darkModeText
                                : Colors.primary,
                            },
                            option.selected && styles.optionTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.resetButton,
              pressed && styles.pressed,
            ]}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>Reset All</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.applyButton,
              {
                backgroundColor: isDark
                  ? Colors.darkModeSecondary
                  : Colors.primary,
              },
              pressed && styles.pressed,
            ]}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Show Results</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(2, 51, 54, 0.5)",
  },
  filterContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  priceText: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Colors.whiteText,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  optionSelected: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.primary,
  },
  checkbox: {
    marginRight: 8,
    borderRadius: 4,
    borderColor: Colors.secondary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.text,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: Colors.whiteText,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  resetButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: Colors.whiteText,
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

export default Filters;
