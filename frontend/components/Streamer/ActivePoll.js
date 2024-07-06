import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const ActivePoll = ({ route, navigation }) => {
  const { pollId } = route.params;
  const [poll, setPoll] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchPoll = async () => {
      const response = await axios.get(`http://localhost:3000/currentPoll`);
      setPoll(response.data);
      setTimeRemaining(response.data.timer);
    };

    fetchPoll();

    socket.on('pollResults', (results) => {
      setResults(results);
    });

    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      socket.off('pollResults');
      clearInterval(interval);
    };
  }, [pollId]);

  const endPoll = async () => {
    await axios.post(`http://localhost:3000/endPoll/${pollId}`);
    const response = await axios.get(`http://localhost:3000/pollResults/${pollId}`);
    setResults(response.data);
  };

  if (!poll) return null;

  return (
    <ImageBackground source={require('/Users/mmc/Desktop/tiktok-live-quiz/frontend/assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.content}>
          {results.length == 0 && (
            <>
              <Text style={styles.title}>{poll.question}</Text>
              {poll.options.map((option, index) => (
                <Text key={index} style={styles.option}>{option}</Text>
              ))}
              {poll.timer && (
                <Text style={styles.timer}>Time Remaining: {timeRemaining} seconds</Text>
              )}
              <TouchableOpacity style={styles.button} onPress={endPoll} disabled={!poll.isActive}>
                <Text style={styles.buttonText}>End Poll</Text>
              </TouchableOpacity>
            </>
          )}
          {results.length > 0 && (
            <View style={styles.results}>
              <Text style={styles.resultsTitle}>Poll Results:</Text>
              {results.map((result, index) => (
                <View key={index} style={styles.resultContainer}>
                  <Text style={styles.resultText}>{result.option}: {result.percentage.toFixed(2)}%</Text>
                  <View style={[styles.resultBar, { width: `${result.percentage}%` }]} />
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Streamer')}>
            <Text style={styles.buttonText}>Back to Create Poll</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

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
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  timer: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  results: {
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  resultContainer: {
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  resultBar: {
    height: 20,
    backgroundColor: '#007bff',
  },
});

export default ActivePoll;
