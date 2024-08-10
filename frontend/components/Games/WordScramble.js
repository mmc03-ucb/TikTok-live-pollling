import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput } from 'react-native';
import axios from 'axios';

const scrambleWord = (word) => {
  const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
  return scrambled !== word ? scrambled : scrambleWord(word); // Ensure the scrambled word is different from the original
};

const WordScramble = ({ route, navigation }) => {
  const { viewerId, word } = route.params;
  const [scrambledWord, setScrambledWord] = useState(scrambleWord(word));
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(60); // 60 seconds for the game
  const [reward, setReward] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          clearInterval(id);
          handleGameEnd(false);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);


  const handleSubmit = () => {
    if (input.toLowerCase().trim() === word.toLowerCase().trim()) {
      clearInterval(intervalId);
      handleGameEnd(true);
    } else {
      alert('Incorrect! Try again.');
    }
  };

  const handleGameEnd = async (isVictory) => {
    const response = await axios.post('http://localhost:3000/completeWordScramble', { viewerId, isVictory });
    setReward(response.data.reward);
    setGameEnded(true);
  };

  return (
    <ImageBackground source={require('/Users/mmc/Desktop/tiktok-live-quiz/frontend/assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {!gameEnded ? (
          <View style={styles.content}>
            <Text style={styles.title}>Word Scramble</Text>
            <Text style={styles.scrambledWord}>{scrambledWord}</Text>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Unscramble the word"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <Text style={styles.timer}>Time Remaining: {timer} seconds</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.rewardText}>{reward}</Text>
            <Text style={styles.correctWord}>The correct word was: {word}</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        )}
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
    backgroundColor: 'transparent', // semi-transparent background
  },
  content: {
    backgroundColor: 'transparent', // darker semi-transparent background
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
  scrambledWord: {
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
  submitButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1dc0bb',
    marginVertical: 10,
    width: '100%', // Make buttons full width inside the content box
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  timer: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1dc0bb',
    marginVertical: 10,
    width: '100%', // Make buttons full width inside the content box
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  rewardText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  correctWord: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default WordScramble;
