import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground source={require('/Users/mmc/Desktop/tiktok-live-quiz/frontend/assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StreamerOptions')}>
          <Text style={styles.buttonText}>Streamer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Viewer')}>
          <Text style={styles.buttonText}>Viewer</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default HomeScreen;
