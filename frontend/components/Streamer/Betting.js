import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput } from 'react-native';
import axios from 'axios';

const Betting = ({ navigation }) => {
  const [betTitle, setBetTitle] = useState('');
  const [betOptions, setBetOptions] = useState(['', '']);
  const [timer, setTimer] = useState(60);

  const handleAddOption = () => {
    setBetOptions([...betOptions, '']);
  };

  const handleOptionChange = (text, index) => {
    const newOptions = [...betOptions];
    newOptions[index] = text;
    setBetOptions(newOptions);
  };

  const startBet = async () => {
    const betData = {
      title: betTitle,
      options: betOptions,
      timer,
    };
    await axios.post('http://localhost:3000/startBet', betData);
    navigation.navigate('LiveBetMonitor');
  };

  return (
    <ImageBackground source={require('/Users/mmc/Desktop/tiktok-live-quiz/frontend/assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Start a Bet</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter bet title"
          value={betTitle}
          onChangeText={setBetTitle}
        />
        {betOptions.map((option, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`Option ${index + 1}`}
            value={option}
            onChangeText={(text) => handleOptionChange(text, index)}
          />
        ))}
        <TouchableOpacity style={styles.button} onPress={handleAddOption}>
          <Text style={styles.buttonText}>Add Option</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={startBet}>
          <Text style={styles.buttonText}>Start Bet</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1dc0bb',
    marginVertical: 10,
    width: '100%', // Make buttons full width inside the content box
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Betting;
