import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';

const BetResult = ({ route, navigation }) => {
  const { viewerId } = route.params;
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchBetResult = async () => {
      const response = await axios.get(`http://localhost:3000/betResult/${viewerId}`);
      setResult(response.data);
    };

    fetchBetResult();
    const interval = setInterval(fetchBetResult, 2000); // Fetch bet status every 2 seconds

    return () => clearInterval(interval);
  }, [viewerId]);

  return (
    <ImageBackground source={require('/Users/mmc/Desktop/tiktok-live-quiz/frontend/assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {result ? (
          <View style={styles.content}>
            <Text style={styles.title}>Bet Result</Text>
            {result.active ? (
              <Text style={styles.resultText}>{result.message}</Text>
            ) : (
              result.betResult.map((bet, index) => (
                <View key={index}>
                  <Text style={styles.resultText}>{bet.message}</Text>
                </View>
              ))
            )}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.title}>Loading...</Text>
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
  resultText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
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
});

export default BetResult;
