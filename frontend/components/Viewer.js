import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const Viewer = ({ navigation }) => {
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [results, setResults] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showMemoryMatch, setShowMemoryMatch] = useState(false);
  const [showWordScramble, setShowWordScramble] = useState(false); // Add state for WordScramble
  const [showGuessThePicture, setShowGuessThePicture] = useState(false);
  const [scrambledWord, setScrambledWord] = useState(''); // Add state for scrambled word
  const [viewerId, setViewerId] = useState(() => `viewer-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('pollCreated', poll => {
      setPoll(poll);
      setSelectedOption(null);
      setResults([]);
    });

    socket.on('voteSubmitted', poll => {
      setPoll(poll);
    });

    socket.on('pollClosed', poll => {
      setPoll(poll);
    });

    socket.on('pollResults', results => {
      setResults(results);
    });

    socket.on('startGame', () => {
      setShowMemoryMatch(true);
      navigation.navigate('MemoryMatch', { viewerId });
    });

    socket.on('startWordScramble', ({ word }) => {
      setScrambledWord(word);
      setShowWordScramble(true);
      navigation.navigate('WordScramble', { viewerId, word });
    });

    socket.on('startGuessThePicture', () => {
      setShowGuessThePicture(true);
      navigation.navigate('GuessThePicture', { viewerId });
    });

    socket.on('gameCompleted', (viewerId) => {
      console.log(`${viewerId} completed the game and received a reward!`);
    });

    const fetchCurrentPoll = async () => {
      const response = await axios.get('http://localhost:3000/currentPoll');
      setPoll(response.data);
      setTimeRemaining(response.data.timer);
    };

    fetchCurrentPoll();

    return () => {
      socket.off('pollCreated');
      socket.off('voteSubmitted');
      socket.off('pollClosed');
      socket.off('pollResults');
      socket.off('startGame');
      socket.off('startWordScramble');
      socket.off('startGuessThePicture');
      socket.off('gameCompleted');
    };
  }, []);

  const submitVote = async (optionIndex) => {
    await axios.post('http://localhost:3000/submitVote', { pollId: poll._id, optionIndex });
    setSelectedOption(optionIndex);
  };

  if (showMemoryMatch || showWordScramble || showGuessThePicture) {
    return null; // Navigation to the games will be handled by React Navigation
  }

  if (!poll) {
    return (
      <ImageBackground source={require('../assets/background.jpg')} style={styles.backgroundImage}>
        <View style={styles.noPollContainer}>
          <Text style={styles.noPollText}>Live Stream</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.content}>
          {results.length === 0 && (
            <>
              <Text style={styles.question}>{poll.question}</Text>
              <FlatList
                data={poll.options}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => submitVote(index)}
                    disabled={selectedOption !== null}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              {selectedOption !== null && <Text style={styles.voteMessage}>Your vote has been submitted!</Text>}
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
          <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Home')}>
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
  },
  noPollContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPollText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  question: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  voteMessage: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 10,
    textAlign: 'center',
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
  navigationButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Viewer;
