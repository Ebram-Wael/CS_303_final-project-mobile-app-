import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

interface Apartment {
  id: string;
  rent: string;
  location: string;
  num_bedrooms: number;
  features: string;
  floor: number;
  nearby: string;
}

interface EditApartmentModalProps {
  visible: boolean;
  onClose: () => void;
  apartment: Apartment;
  onSave: () => void;
}

export default function EditApartmentModal({
  visible,
  onClose,
  apartment,
  onSave,
}: EditApartmentModalProps) {
  const [form, setForm] = useState({
    rent: "",
    location: "",
    num_bedrooms: "",
    features: "",
    floor: "",
    nearby: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (apartment) {
      setForm({
        rent: apartment.rent,
        location: apartment.location,
        num_bedrooms: apartment.num_bedrooms.toString(),
        features: apartment.features,
        floor: apartment.floor.toString(),
        nearby: apartment.nearby,
      });
      setErrors({});
    }
  }, [apartment]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: "" });
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.rent || isNaN(Number(form.rent)))
      newErrors.rent = "Rent must be a number";
    if (!form.location) newErrors.location = "Location is required";
    if (!form.num_bedrooms || isNaN(Number(form.num_bedrooms)))
      newErrors.num_bedrooms = "Bedrooms must be a number";
    if (!form.features) newErrors.features = "Features are required";
    if (!form.floor || isNaN(Number(form.floor)))
      newErrors.floor = "Floor must be a number";
    if (!form.nearby) newErrors.nearby = "Nearby is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const ref = doc(db, "Apartments", apartment.id);
      await updateDoc(ref, {
        rent: form.rent,
        location: form.location,
        num_bedrooms: parseInt(form.num_bedrooms),
        features: form.features,
        floor: parseInt(form.floor),
        nearby: form.nearby,
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Failed to update apartment:", error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Edit Apartment</Text>

          {[
            {
              key: "rent",
              label: "Rent",
              placeholder: "Rent",
              keyboardType: "numeric",
            },
            { key: "location", label: "Location", placeholder: "Location" },
            {
              key: "num_bedrooms",
              label: "Number of Bedrooms",
              placeholder: "Number of Bedrooms",
              keyboardType: "numeric",
            },
            {
              key: "features",
              label: "Features",
              placeholder: "Features",
            },
            {
              key: "floor",
              label: "Floor",
              placeholder: "Floor",
              keyboardType: "numeric",
            },
            { key: "nearby", label: "Nearby", placeholder: "e.g. Metro, Mall" },
          ].map(({ key, label, placeholder, keyboardType }) => (
            <View key={key} style={{ marginBottom: 10 }}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                keyboardType={keyboardType as any}
                value={form[key as keyof typeof form]}
                onChangeText={(text) =>
                  handleChange(key as keyof typeof form, text)
                }
              />
              {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
            </View>
          ))}

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  error: {
    color: "red",
    marginTop: 2,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  saveBtn: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  cancelBtn: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
