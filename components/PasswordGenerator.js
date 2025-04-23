import * as Clipboard from "expo-clipboard";
import ClipboardIcon from "./ClipboardIcon";
import { Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { StatusBar } from "react-native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { FlatList } from "react-native";
import { Modal } from "react-native";
import { Alert } from 'react-native';

import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  StyleSheet,
} from "react-native";

export default function PasswordGenerator() {
  const [length, setLength] = useState("12");
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

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

  const copyFavorite = (text) => {
    Clipboard.setStringAsync(text);
    Alert.alert("Kopyalandı", "Şifre panoya kopyalandı.");
  };

  function addToFavorites() {
    // 1. Şifre boşsa ya da "Please select" gibi geçersizse → ekleme
    if (!password || password === "Password" || password.startsWith("Please")) {
      alert("Geçerli bir şifre oluşturmalısınız.");
      return;
    }
    // 2. Daha önce eklenmişse → tekrar ekleme
    if (favorites.includes(password)) {
      alert("Bu şifre zaten favorilere eklenmiş.");
      return;
    }
    // 3. Değilse → favorites dizisine ekle
    const updatedFavorites = [...favorites, password];
    setFavorites(updatedFavorites);

    Alert.alert("Başarılı", "Şifre favorilere eklendi!");

    // 4. Kalıcı olsun diye AsyncStorage'e kaydet (bunu birazdan ekleyeceğiz)
    console.log("Favorilere eklendi:", password);
  }

  const removeFromFavorites = (itemToRemove) => {
    Alert.alert(
      "Favoriden Sil",
      `"${itemToRemove}" şifresini silmek istiyor musunuz?`,
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Sil",
          style: "destructive",
          onPress: () => {
            const updated = favorites.filter((item) => item !== itemToRemove);
            setFavorites(updated);
          },
        },
      ]
    );
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
    <View style={[styles.fullScreen, isDarkMode && styles.darkContainer]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={[styles.container, isDarkMode && styles.darkContainer]}
        >
          <StatusBar
            barStyle={isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={isDarkMode ? "#1e1e1e" : "#f2f2f2"}
          />
          <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <View style={styles.optionRow}>
              <Text style={[isDarkMode && { color: "#fff" }]}>Dark Mode</Text>
              <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>

            <Text style={[styles.label, isDarkMode && { color: "#fff" }]}>
              Şifre Uzunluğu:
            </Text>
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              value={length}
              onChangeText={(text) => setLength(text)}
              keyboardType="numeric"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <View style={styles.optionRow}>
              <Text style={[isDarkMode && { color: "#fff" }]}>Büyük Harf</Text>
              <Switch
                value={includeUppercase}
                onValueChange={setIncludeUppercase}
              />
            </View>
            <View style={styles.optionRow}>
              <Text style={[isDarkMode && { color: "#fff" }]}>Küçük Harf</Text>
              <Switch
                value={includeLowercase}
                onValueChange={setIncludeLowercase}
              />
            </View>
            <View style={styles.optionRow}>
              <Text style={[isDarkMode && { color: "#fff" }]}>Rakam</Text>
              <Switch
                value={includeNumbers}
                onValueChange={setIncludeNumbers}
              />
            </View>
            <View style={styles.optionRow}>
              <Text style={[isDarkMode && { color: "#fff" }]}>Sembol</Text>
              <Switch
                value={includeSymbols}
                onValueChange={setIncludeSymbols}
              />
            </View>
            <Button title="Şifre Oluştur" onPress={generatePassword} />
            {password !== "" && (
              <>
                <Pressable onPress={copyToClipboard} style={styles.copyRow}>
                  <View style={styles.passwordContainer}>
                    <Text
                      style={[styles.result, isDarkMode && styles.resultDark]}
                    >
                      {password}
                    </Text>
                    <View style={styles.iconWrapper}>
                      {/*  <ClipboardIcon
                        color={isDarkMode ? "#8be9fd" : "#007bff"}
                        size={20}
                      /> */}
                    </View>
                  </View>
                </Pressable>
              </>
            )}
            <Button title="Resetle" onPress={resetHandler} />
            <Button title="Favorilere Ekle" onPress={addToFavorites} />
            <Button
              title="Favori Şifreleri Göster"
              onPress={() => setModalVisible(true)}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View
          style={{
            flex: 1,
            padding: 25,
            backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
          }}
        >
          <Text
            style={[styles.favHeader, { color: isDarkMode ? "#fff" : "#000" }]}
          >
            Favori Şifreler
          </Text>

          <FlatList
            data={favorites}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => copyFavorite(item)}
                onLongPress={() => removeFromFavorites(item)}
              >
                <Text
                  style={[
                    styles.favoriteItem,
                    { color: isDarkMode ? "#fff" : "#333" },
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />

          <Button title="Kapat" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 40,
    flex: 1, // TAM ekran kapsar
    padding: 20,
    backgroundColor: "#f2f2f2",
  },

  fullScreen: {
    flex: 1,
    backgroundColor: "#f2f2f2", // light mode
  },

  safeArea: {
    flex: 1,
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

  labelDark: {
    color: "#ffffff",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },

  inputDark: {
    backgroundColor: "#2c2c2c",
    color: "#ffffff",
    borderColor: "#555",
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

  resultDark: {
    color: "#8be9fd", // Açık mavi gibi
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center", // işte bu hizayı düzeltir
    justifyContent: "center",
    gap: 8,
  },

  favHeader: {
    padding: 20,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#007bff",
  },

  favoriteItem: {
    fontSize: 16,
    paddingVertical: 6,
    textAlign: "center",
    color: "#333",
  },

  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    color: "#888",
  },

  /*  iconWrapper: {
    marginTop: 1, // İsteğe bağlı: 1-2px yukarı/aşağı kaydırmak için
  }, */
});
