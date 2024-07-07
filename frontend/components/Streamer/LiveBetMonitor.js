import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, FlatList } from 'react-native';
import axios from 'axios';

const LiveBetMonitor = ({ navigation }) => {
  const [bet, setBet] = useState(null);

  useEffect(() => {
    const fetchBet = async () => {
      const response = await axios.get('http://localhost:3000/currentBet');
      setBet(response.data);
    };

    fetchBet();

    const interval = setInterval(fetchBet, 5000); // Fetch bet status every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const endBet = async () => {
    await axios.post('http://localhost:3000/endBet');
    navigation.navigate('StreamerOptions');
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
                <View style={styles.optionContainer}>
                  <Text style={styles.optionText}>{item.option}</Text>
                  <Text style={styles.optionText}>Total Amount Bet: {item.bets}</Text>
                  <Text style={styles.optionText}>Odds: {item.odds}</Text>
                </View>
              )}
            />
            <TouchableOpacity style={styles.button} onPress={endBet}>
              <Text style={styles.buttonText}>End Bet</Text>
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
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
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

export default LiveBetMonitor;
