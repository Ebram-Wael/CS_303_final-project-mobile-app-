import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import RequestsListScreen from "./RequestsListScreen";
import NewRequestScreen from "./NewRequestScreen";
import Colors from "@/components/colors";
import { useThemes } from "@/components/themeContext";

const reportUs: React.FC = () => {
  const { theme } = useThemes();
  const isDark = theme === "dark";
  const [showNewRequest, setShowNewRequest] = useState<boolean>(false);
  const [requests, setRequests] = useState<any[]>([]);

  const handleNavigateToNewRequest = () => {
    setShowNewRequest(true);
  };

  const handleNavigateBackToList = () => {
    setShowNewRequest(false);
  };

  const handleNewRequestSubmitted = (newRequest: any) => {
    setRequests([newRequest, ...requests]);
    setShowNewRequest(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:isDark?Colors.darkModeBackground: Colors.background }}>
      <View style={{ flex: 1 }}>
        {!showNewRequest ? (
          <RequestsListScreen
            onNavigateToNewRequest={handleNavigateToNewRequest}
          />
        ) : (
          <NewRequestScreen
            onNavigateBack={handleNavigateBackToList}
            onNewRequestSubmitted={handleNewRequestSubmitted}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default reportUs;
