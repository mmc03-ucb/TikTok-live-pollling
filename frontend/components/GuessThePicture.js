import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput, Image } from 'react-native';
import axios from 'axios';

const GuessThePicture = ({ route, navigation }) => {
  const { viewerId } = route.params;
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(60); // 60 seconds for the game
  const [reward, setReward] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [revealedPortion, setRevealedPortion] = useState(0); // Percentage of image revealed
  const imageUri = 'https://wallpapers.com/images/featured/star-wars-plzcoaffexgf4h81.jpg'; // Replace with your image URL
  const correctAnswer = 'example'; // Replace with your correct answer

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

      setRevealedPortion((prev) => Math.min(prev + 5, 100)); // Reveal more of the image
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (input.toLowerCase() === correctAnswer.toLowerCase()) {
      clearInterval(intervalId);
      handleGameEnd(true);
    }
  }, [input, correctAnswer, intervalId]);

  const handleSubmit = () => {
    if (input.toLowerCase() === correctAnswer.toLowerCase()) {
      clearInterval(intervalId);
      handleGameEnd(true);
    } else {
      alert('Incorrect! Try again.');
    }
  };

  const handleGameEnd = async (isVictory) => {
    console.log(`Game Ended. Victory: ${isVictory}, Answer: ${correctAnswer}, Input: ${input}`);
    const response = await axios.post('http://localhost:3000/completeGuessThePicture', { viewerId, isVictory });
    setReward(response.data.reward);
    setGameEnded(true);
  };

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {!gameEnded ? (
          <View style={styles.content}>
            <Text style={styles.title}>Guess the Picture</Text>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUri }}
                style={{
                  ...styles.image,
                  height: `${revealedPortion}%`
                }}
              />
            </View>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Guess the picture"
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
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
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
  rewardText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default GuessThePicture;
