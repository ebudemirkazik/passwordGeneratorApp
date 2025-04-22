import * as Clipboard from "expo-clipboard";
import ClipboardIcon from "./ClipboardIcon";
import { Pressable } from "react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  StyleSheet,
  Alert,
} from "react-native";

export default function PasswordGenerator() {
  const [length, setLength] = useState("12");
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const generatePassword = () => {
    const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
    const NUMBER_CHARS = "0123456789";
    const SYMBOL_CHARS = "!@#$%^&*()_+{}[]<>?";

    let characters = "";

    if (includeUppercase) characters += UPPERCASE_CHARS;
    if (includeLowercase) characters += LOWERCASE_CHARS;
    if (includeNumbers) characters += NUMBER_CHARS;
    if (includeSymbols) characters += SYMBOL_CHARS;

    if (characters === "") {
      Alert.alert("Uyarı", "Lütfen en az bir karakter tipi seçin.");

      return;
    }

    let result = "";
    for (let i = 0; i < parseInt(length); i++) {
      const randIndex = Math.floor(Math.random() * characters.length);
      result += characters[randIndex];
    }

    setPassword(result);
  };

  const copyToClipboard = () => {
    Clipboard.setStringAsync(password);
    Alert.alert("Kopyalandı!", "Şifre panoya başarıyla kopyalandı.");
  };

  const resetHandler = () => {
    setPassword("");
    setLength("12");
    setIncludeUppercase(true);
    setIncludeLowercase(true);
    setIncludeNumbers(true);
    setIncludeSymbols(false);
  };

  return (
    <View
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      <Text style={[styles.label, isDarkMode && { color: "#fff" }]}>
        Şifre Uzunluğu:
      </Text>

      <View style={styles.optionRow}>
        <Text>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      <Text style={styles.label}>Şifre Uzunluğu:</Text>
      <TextInput
        style={styles.input}
        value={length}
        onChangeText={setLength}
        keyboardType="numeric"
      />
      <View style={styles.optionRow}>
        <Text>Büyük Harf</Text>
        <Switch value={includeUppercase} onValueChange={setIncludeUppercase} />
      </View>
      <View style={styles.optionRow}>
        <Text>Küçük Harf</Text>
        <Switch value={includeLowercase} onValueChange={setIncludeLowercase} />
      </View>
      <View style={styles.optionRow}>
        <Text>Rakam</Text>
        <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
      </View>
      <View style={styles.optionRow}>
        <Text>Sembol</Text>
        <Switch value={includeSymbols} onValueChange={setIncludeSymbols} />
      </View>
      <Button title="Şifre Oluştur" onPress={generatePassword} />
      {password !== "" && (
        <>
          <Pressable onPress={copyToClipboard} style={styles.copyRow}>
            <View style={styles.passwordContainer}>
              <Text style={styles.result}>{password}</Text>
              <View style={styles.iconWrapper}>
                <ClipboardIcon size={22} color="#109010" />
              </View>
            </View>
          </Pressable>
        </>
      )}
      <Button title="Resetle" onPress={resetHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 40,
  },

  darkContainer: {
    backgroundColor: "#1e1e1e",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  result: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FF0000",
    textAlign: "center",
    marginBottom: 15,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center", // işte bu hizayı düzeltir
    justifyContent: "center",
    gap: 8,
  },

  iconWrapper: {
    marginTop: 1, // İsteğe bağlı: 1-2px yukarı/aşağı kaydırmak için
  },

  labelDark: {
    color: "#ffffff",
  },
});
