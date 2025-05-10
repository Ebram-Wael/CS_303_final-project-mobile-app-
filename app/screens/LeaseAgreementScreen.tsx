import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Colors from "@/components/colors";
import { useThemes } from "@/components/themeContext";

interface LeaseAgreementScreenRouteParams {
  sellerid?: string;
  name?: string;
  apartmentid?: string;
  totalPrice?: string;
  semester?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
}

const LeaseAgreementScreen: React.FC = () => {
  const {
    sellerid,
    name,
    apartmentid,
    totalPrice,
    semester,
    startDate,
    endDate,
    paymentMethod,
  } = useLocalSearchParams() as LeaseAgreementScreenRouteParams;

  const handleBack = () => {
    Alert.alert(
      "Warning",
      "If you go back, you will not be able to see this agreement again . Are you sure you want to go back?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Go Back", onPress: () => router.back() },
      ]
    );
  };
  const { theme } = useThemes();
  const isDark = theme === "dark";
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.container, { backgroundColor: isDark ? Colors.darkModeBackground : Colors.background }]}>
      <Text style={[styles.title, { color: isDark ? Colors.darkModeText : Colors.text }]}>Lease Agreement</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parties</Text>
        <Text style={styles.itemText}>
          Landlord (Party 1): <Text style={styles.boldText}>{sellerid}</Text>
        </Text>
        <Text style={styles.itemText}>
          Tenant (Party 2): <Text style={styles.boldText}>{name}</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        <Text style={styles.itemText}>
          Unit Number: <Text style={styles.boldText}>{apartmentid}</Text>
        </Text>
        <Text style={styles.itemText}>
          Monthly Total Rent:{" "}
          <Text style={styles.boldText}>{totalPrice} EGP</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lease Term</Text>
        <Text style={styles.itemText}>
          Semester: <Text style={styles.boldText}>{semester}</Text>
        </Text>
        <Text style={styles.itemText}>
          Start Date: <Text style={styles.boldText}>{startDate}</Text>
        </Text>
        <Text style={styles.itemText}>
          End Date: <Text style={styles.boldText}>{endDate}</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Terms</Text>
        <Text style={styles.itemText}>
          Payment Method: <Text style={styles.boldText}>{paymentMethod}</Text>
        </Text>
      </View>

      <View style={styles.signatures}>
        <View style={styles.signatureLine}>
          <Text style={[styles.signatureLabel, { color: isDark ? Colors.assestWhite : Colors.assest }]}>Landlord's Signature</Text>
          <View style={styles.signatureBorder}></View>
        </View>
        <View style={styles.signatureLine}>
          <Text style={[styles.signatureLabel, { color: isDark ? Colors.assestWhite : Colors.assest }]}>Tenant's Signature</Text>
          <View style={styles.signatureBorder}></View>
        </View>
      </View>

      <Pressable style={[styles.backButton, { backgroundColor: isDark ? Colors.darkModeSecondary : Colors.primary }]} onPress={handleBack}>
        <Text style={styles.backButtonText}>Back to Form</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  itemText: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.assest,
  },
  boldText: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  signatures: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  signatureLine: {
    marginBottom: 15,
  },
  signatureLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  signatureBorder: {
    borderBottomWidth: 1,
    borderColor: "#bbb",
    paddingVertical: 10,
  },
  backButton: {
    backgroundColor: Colors.assestGreenTwo,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LeaseAgreementScreen;
