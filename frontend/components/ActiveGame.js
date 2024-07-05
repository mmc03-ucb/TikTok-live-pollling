import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, FlatList } from 'react-native';
import axios from 'axios';

const ActiveGame = ({ navigation }) => {
  const [timeRemaining, setTimeRemaining] = useState(60); // Set the initial time for the game
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const response = await axios.get('http://localhost:3000/gameResults');
      setResults(response.data);
    };

    fetchResults();

    const interval = setInterval(fetchResults, 5000); // Fetch results every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Active Game</Text>
          <Text style={styles.timer}>Time Remaining: {timeRemaining} seconds</Text>
          {results.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Game Results:</Text>
              <FlatList
                data={results}
                keyExtractor={(item) => item.viewerId}
                renderItem={({ item }) => (
                  <Text style={styles.result}>{`Viewer ${item.viewerId} completed the game`}</Text>
                )}
              />
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StreamerOptions')}>
            <Text style={styles.buttonText}>Back</Text>
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
    width: '100%',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  timer: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
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
  resultsContainer: {
    marginTop: 20,
    width: '100%', // Make the results container full width
  },
  resultsTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  result: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
});

export default ActiveGame;
