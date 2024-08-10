import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, FlatList, TextInput } from 'react-native';
import axios from 'axios';

const LiveBetMonitor = ({ navigation }) => {
  const [bet, setBet] = useState(null);
  const [winningOption, setWinningOption] = useState('');
  const [payoutResults, setPayoutResults] = useState(null);

  useEffect(() => {
    const fetchBet = async () => {
      const response = await axios.get('http://localhost:3000/currentBet');
      setBet(response.data);
    };

    fetchBet();

    const interval = setInterval(fetchBet, 2000); // Fetch bet status every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const endBet = async () => {
    const response = await axios.post('http://localhost:3000/endBet', { winningOption });
    setPayoutResults(response.data.payoutResults);
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
            <TextInput
              style={styles.input}
              placeholder="Enter Winning Option"
              value={winningOption}
              onChangeText={setWinningOption}
            />
            <TouchableOpacity style={styles.button} onPress={endBet}>
              <Text style={styles.buttonText}>End Bet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.payoutContainer}>
            <Text style={styles.title}>Payouts:</Text>
            <FlatList
              data={payoutResults}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.payoutItem}>
                  <Text style={styles.payoutText}>Viewer ID: {item.viewerId}</Text>
                  <Text style={styles.payoutText}>Payout: {item.payout.toFixed(2)}</Text>
                </View>
              )}
            />
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StreamerOptions')}>
          <Text style={styles.buttonText}>Back to Home</Text>
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
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
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
  payoutContainer: {
    marginTop: 20,
    width: '100%',
  },
  payoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 5,
    borderRadius: 5,
  },
  payoutText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LiveBetMonitor;
