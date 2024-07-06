import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput } from 'react-native';
import axios from 'axios';

const MiniGames = ({ navigation }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [word, setWord] = useState('');

  const startMemoryMatch = async () => {
    await axios.post('http://localhost:3000/startGame');
    navigation.navigate('ActiveGame');
  };

  const startWordScramble = async () => {
    await axios.post('http://localhost:3000/startWordScramble', { word });
    navigation.navigate('ActiveGame');
  };

  const startGuessThePicture = async () => {
    await axios.post('http://localhost:3000/startGuessThePicture');
    navigation.navigate('ActiveGame');
  };

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Choose a Mini-Game</Text>
          <TouchableOpacity style={styles.button} onPress={startMemoryMatch}>
            <Text style={styles.buttonText}>Memory Match</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setSelectedGame('WordScramble')}>
            <Text style={styles.buttonText}>Word Scramble</Text>
          </TouchableOpacity>
          {selectedGame === 'WordScramble' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter a word for Word Scramble"
                value={word}
                onChangeText={setWord}
              />
              <TouchableOpacity style={styles.button} onPress={startWordScramble}>
                <Text style={styles.buttonText}>Start Game</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={styles.button} onPress={startGuessThePicture}>
            <Text style={styles.buttonText}>Guess the Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Aligns children to the bottom
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // semi-transparent background
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // darker semi-transparent background
    borderRadius: 10,
    padding: 20,
    alignItems: 'center', // Center align the items inside
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%', // Make buttons full width inside the content box
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  backButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%', // Make back button full width inside the content box
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MiniGames;
