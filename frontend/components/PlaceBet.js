import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, FlatList, TextInput } from 'react-native';
import axios from 'axios';

const PlaceBet = ({ route, navigation }) => {
  const { viewerId } = route.params;
  const [bet, setBet] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchBet = async () => {
      const response = await axios.get('http://localhost:3000/currentBet');
      setBet(response.data);
    };

    fetchBet();
  }, []);

  const placeBet = async () => {
    if (selectedOption && amount) {
      await axios.post('http://localhost:3000/placeBet', {
        viewerId,
        option: selectedOption,
        amount: parseFloat(amount),
      });
      navigation.navigate('BetResult', { viewerId });
    }
  };

  return (
    <ImageBackground source={require('/Users/mmc/Desktop/tiktok-live-quiz/frontend/assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {bet ? (
          <View style={styles.content}>
            <Text style={styles.title}>{bet.title}</Text>
            <FlatList
              data={bet.options}
              keyExtractor={(item) => item.option}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedOption === item.option && styles.selectedOptionButton,
                  ]}
                  onPress={() => setSelectedOption(item.option)}
                >
                  <Text style={styles.optionText}>{item.option}</Text>
                </TouchableOpacity>
              )}
            />
            <TextInput
              style={styles.input}
              placeholder="Bet Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={placeBet}>
              <Text style={styles.buttonText}>Place Bet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.title}>No active bet</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // darker semi-transparent background
    borderRadius: 10,
    padding: 20,
    alignItems: 'center', // Center align the items inside
    width: '100%',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%', // Make buttons full width inside the content box
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#28a745',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
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
});

export default PlaceBet;
