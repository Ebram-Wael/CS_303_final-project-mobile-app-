import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Alert,
  Text,
} from "react-native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";
import { db } from "../services/firebase";
interface AddCommentProps {
  apartmentId: string;
  userId: string;
}

const AddComment: React.FC<AddCommentProps> = ({ apartmentId, userId }) => {
  const [commentText, setCommentText] = useState<string>("");

  const handleSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const commentsRef = collection(db, "Apartments", apartmentId, "comments");
      await addDoc(commentsRef, {
        userId: userId,
        text: commentText.trim(),
        createdAt: serverTimestamp(),
      });

      setCommentText("");
    } catch (error) {
      console.error("Error adding comment: ", error);
      Alert.alert("Error", "Failed to add comment.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="add comment here"
        value={commentText}
        onChangeText={setCommentText}
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Feather name="send" size={20} color="black" />
      </Pressable>
    </View>
  );
};

export default AddComment;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    marginRight: 10,
  },
  button: {
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    
  },
});
