import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import PasswordGenerator from "./components/PasswordGenerator";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <PasswordGenerator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
});