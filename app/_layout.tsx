import React from "react";
import { Redirect, Stack } from "expo-router";

const _layout = () => {
  return (
    <>
      {/* <Redirect href="/screens/firstpage" /> */}
      <Stack>
        <Stack.Screen
          name="firstpage"
          options={{ title: "firstpage", headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default _layout;
