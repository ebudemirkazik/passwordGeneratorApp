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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Şifre Oluşturucu</Text>

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
          <Text style={styles.result}>{password}</Text>
        </>
      )}
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
    color: "#007bff",
  },
});