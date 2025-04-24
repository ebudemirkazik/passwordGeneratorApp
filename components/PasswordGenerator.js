// PasswordGenerator.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  Alert,
  FlatList,
  Pressable,
  Modal,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PasswordGenerator() {
  const [length, setLength] = useState('12');
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [password, setPassword] = useState('Password');
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          } else {
            await AsyncStorage.removeItem('favorites');
          }
        }
      } catch (e) {
        console.log('Favoriler okunamadı:', e);
      }
    };
    loadFavorites();
  }, []);

  const generatePassword = () => {
    const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBER_CHARS = '0123456789';
    const SYMBOL_CHARS = '!@#$%^&*()_+{}[]<>?';

    let characters = '';
    if (includeUppercase) characters += UPPERCASE_CHARS;
    if (includeLowercase) characters += LOWERCASE_CHARS;
    if (includeNumbers) characters += NUMBER_CHARS;
    if (includeSymbols) characters += SYMBOL_CHARS;

    if (characters === '') {
      Alert.alert('Uyarı', 'Lütfen en az bir karakter tipi seçin.');
      return;
    }

    let result = '';
    for (let i = 0; i < parseInt(length); i++) {
      const randIndex = Math.floor(Math.random() * characters.length);
      result += characters[randIndex];
    }

    setPassword(result);
  };

  const copyToClipboard = () => {
    Clipboard.setStringAsync(password);
    Alert.alert('Kopyalandı!', 'Şifre panoya başarıyla kopyalandı.');
  };

  const copyFavorite = (text) => {
    Clipboard.setStringAsync(text);
    Alert.alert('Kopyalandı', 'Şifre panoya kopyalandı.');
  };

  const addToFavorites = async () => {
    if (!password || password === 'Password' || password.startsWith('Please')) {
      Alert.alert('Uyarı', 'Geçerli bir şifre oluşturmalısınız.');
      return;
    }
    if (favorites.includes(password)) {
      Alert.alert('Bilgi', 'Bu şifre zaten favorilerde.');
      return;
    }
    const updatedFavorites = [...favorites, password];
    setFavorites(updatedFavorites);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (e) {
      console.log('Favori ekleme hatası:', e);
    }
    Alert.alert('Başarılı', 'Şifre favorilere eklendi!');
  };

  const handleDelete = async (itemToRemove) => {
    const updated = favorites.filter((item) => item !== itemToRemove);
    setFavorites(updated);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    } catch (e) {
      console.log('Silme hatası:', e);
    }
  };

  const removeFromFavorites = (itemToRemove) => {
    Alert.alert(
      'Favoriden Sil',
      `"${itemToRemove}" şifresini silmek istiyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => handleDelete(itemToRemove),
        },
      ]
    );
  };

  const resetHandler = () => {
    setPassword('Password');
    setLength('12');
    setIncludeUppercase(true);
    setIncludeLowercase(true);
    setIncludeNumbers(true);
    setIncludeSymbols(false);
  };

  return (
    <View style={[styles.fullScreen, isDarkMode && styles.darkContainer]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={isDarkMode ? '#1e1e1e' : '#f2f2f2'}
          />
          <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <View style={styles.optionRow}>
              <Text style={[isDarkMode && { color: '#fff' }]}>Dark Mode</Text>
              <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>

            <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>Şifre Uzunluğu:</Text>
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              value={length}
              onChangeText={(text) => setLength(text)}
              keyboardType="numeric"
              onSubmitEditing={() => Keyboard.dismiss()}
            />

            <View style={styles.optionRow}>
              <Text style={[isDarkMode && { color: '#fff' }]}>Büyük Harf</Text>
              <Switch value={includeUppercase} onValueChange={setIncludeUppercase} />
            </View>
            <View style={styles.optionRow}>
              <Text style={[isDarkMode && { color: '#fff' }]}>Küçük Harf</Text>
              <Switch value={includeLowercase} onValueChange={setIncludeLowercase} />
            </View>
            <View style={styles.optionRow}>
              <Text style={[isDarkMode && { color: '#fff' }]}>Rakam</Text>
              <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
            </View>
            <View style={styles.optionRow}>
              <Text style={[isDarkMode && { color: '#fff' }]}>Sembol</Text>
              <Switch value={includeSymbols} onValueChange={setIncludeSymbols} />
            </View>

            <Button title="Şifre Oluştur" onPress={generatePassword} />

            {password !== '' && (
              <Pressable onPress={copyToClipboard} style={styles.copyRow}>
                <View style={styles.passwordContainer}>
                  <Text style={[styles.result, isDarkMode && styles.resultDark]}>{password}</Text>
                </View>
              </Pressable>
            )}

            <Button title="Resetle" onPress={resetHandler} />
            <Button title="Favorilere Ekle" onPress={addToFavorites} />
            <Button title="Favori Şifreleri Göster" onPress={() => setModalVisible(true)} />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={{ flex: 1, padding: 25, backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }}>
          <Text style={[styles.favHeader, { color: isDarkMode ? '#fff' : '#000' }]}>Favori Şifreler</Text>
          <FlatList
            data={favorites}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Pressable onPress={() => copyFavorite(item)} onLongPress={() => removeFromFavorites(item)}>
                <Text style={[styles.favoriteItem, { color: isDarkMode ? '#fff' : '#333' }]}>{item}</Text>
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 40,
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  darkContainer: {
    backgroundColor: '#1e1e1e',
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  inputDark: {
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    borderColor: '#555',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  result: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF0000',
    marginBottom: 15,
  },
  resultDark: {
    color: '#8be9fd',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  favHeader: {
    padding: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#007bff',
  },
  favoriteItem: {
    fontSize: 16,
    paddingVertical: 6,
    textAlign: 'center',
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#888',
  },
});
