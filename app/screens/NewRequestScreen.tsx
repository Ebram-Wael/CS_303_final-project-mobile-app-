import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "@/services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Calendar } from "react-native-calendars";
import { Camera } from "expo-camera";
import auth from "@/services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
interface Request {
  id: string;
  issueType: string;
  description: string;
  imageUrl: string;
  userId: string;
  userName: string;
  createdAt: string;
  preferredDate: string;
}

interface NewRequest {
  issueType: string;
  description: string;
  imageUrl: string;
  preferredDate: string;
}

interface NewRequestScreenProps {
  onNavigateBack: () => void;
  onNewRequestSubmitted: (newRequest: Request) => void;
}

const NewRequestScreen: React.FC<NewRequestScreenProps> = ({
  onNavigateBack,
  onNewRequestSubmitted,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showcalendar, setShowCalendar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isImagePickerModalVisible, setIsImagePickerModalVisible] =
    useState(false);
  const [newRequest, setNewRequest] = useState<NewRequest>({
    issueType: "",
    description: "",
    imageUrl: "",
    preferredDate: "",
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await Camera.requestCameraPermissionsAsync();
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      alert("You need to enable camera and media permissions.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        Alert.alert("Login Required", "Please login to submit a request");
      }
    });
    requestPermissions();
    return unsubscribe;
  }, []);

  const takePhoto = async () => {
    setIsImagePickerModalVisible(true);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setNewRequest({ ...newRequest, imageUrl: result.assets[0].uri });
    }
  };
  const selectImage = async () => {
    setIsImagePickerModalVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setNewRequest({ ...newRequest, imageUrl: result.assets[0].uri });
    }
  };

  const handleImageUpload = async (): Promise<void> => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }
    setIsImagePickerModalVisible(true);
  };

  const submitRequest = async (): Promise<void> => {
    try {
      setSubmitting(true);
      if (!currentUser?.uid) {
        alert("Please login to submit a request");
        return;
      }
      if (!newRequest.issueType || !newRequest.description) {
        alert("Please fill all required fields");
        return;
      }

      const requestData: Omit<Request, "id"> = {
        ...newRequest,
        userId: currentUser.uid,
        userName:
          currentUser.displayName || currentUser.email || "Anonymous User",
        createdAt: new Date().toISOString(),
        preferredDate: selectedDate,
      };

      const docRef = await addDoc(collection(db, "requests"), requestData);
      onNewRequestSubmitted({ id: docRef.id, ...requestData } as Request);

      Alert.alert("Success", "Request submitted successfully!", [
        { text: "OK", onPress: onNavigateBack },
      ]);
      setNewRequest({
        issueType: "",
        description: "",
        imageUrl: "",
        preferredDate: "",
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setNewRequest({
      ...newRequest,
      preferredDate: day.dateString,
    });
    setShowCalendar(false);
  };
  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.header}>Report an Issue</Text>
      <Text style={styles.label}>
        Issue Type <Text style={styles.star}>*</Text>
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={newRequest.issueType}
          onValueChange={(itemValue) =>
            setNewRequest({ ...newRequest, issueType: itemValue })
          }
        >
          <Picker.Item label="Select issue type" value="" />
          <Picker.Item label="Electrical Issue" value="Electrical" />
          <Picker.Item label="Plumbing Issue" value="Plumbing" />
          <Picker.Item label="HVAC Issue" value="HVAC" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <Text style={styles.label}>
        Description <Text style={styles.star}>*</Text>
      </Text>
      <TextInput
        style={styles.descriptionInput}
        multiline
        numberOfLines={4}
        placeholder="Describe the issue in detail..."
        placeholderTextColor="#aaa"
        value={newRequest.description}
        onChangeText={(text) =>
          setNewRequest({ ...newRequest, description: text })
        }
      />

      <Text style={styles.label}>Upload Photo (optional)</Text>
      <Pressable style={styles.uploadButton} onPress={handleImageUpload}>
        <Icon name="upload" size={24} color="#5E5E5E" />
        <Text style={styles.loadimage}>Tap to upload photo</Text>
        {newRequest.imageUrl && (
          <Image
            source={{ uri: newRequest.imageUrl }}
            style={styles.previewImage}
          />
        )}
      </Pressable>

      <Text style={styles.label}>Preferred Date (optional)</Text>
      <Pressable
        style={styles.dateInputContainer}
        onPress={() => setShowCalendar(!showcalendar)}
      >
        <TextInput
          style={styles.dateInput}
          placeholder="Select Date"
          placeholderTextColor="#aaa"
          value={selectedDate}
          editable={false}
        />
        <Icon
          name="calendar"
          size={20}
          color="#5E5E5E"
          style={styles.calendarIcon}
        />
      </Pressable>

      {showcalendar && (
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            [selectedDate]: { selected: true, disableTouchEvent: true},
          }}
        />
      )}

      <Pressable
        style={[styles.submitButton, submitting && styles.disabledButton]}
        onPress={submitRequest}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Submitting..." : "Submit Request"}
        </Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={onNavigateBack}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isImagePickerModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Choose an option</Text>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={selectImage}
            >
              <Text style={styles.textStyle}>Choose from Gallery</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={takePhoto}
            >
              <Text style={styles.textStyle}>Take a Photo</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setIsImagePickerModalVisible(false)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 13,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#333",
  },
  pickerContainer: {
    backgroundColor:"white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },

  descriptionInput: {
    backgroundColor:"white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
    minHeight: 100,
    fontSize: 12,
  },
  uploadButton: {
    backgroundColor:"white",
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 5,
    borderStyle: "dashed",
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
  datetimeRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: "#023336",
    padding: 10,
    borderRadius: 5,
    marginTop: 30,
  },
  backButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "#4DA674",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    alignContent: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
  loadimage: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
  star: {
    color: "#e74c3c",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  dateInput: {
    backgroundColor:"white",
    flex: 1,
    paddingVertical: 10,
    fontSize: 12,
  },
  calendarIcon: {
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
    width: 200,
    alignItems: "center",
  },
  buttonOpen: {
    backgroundColor: "#023336",
  },
  buttonClose: {
    backgroundColor: "#4DA674",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NewRequestScreen;
