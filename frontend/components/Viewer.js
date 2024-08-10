import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ImageBackground, TextInput } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const Viewer = ({ navigation }) => {
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [results, setResults] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showMemoryMatch, setShowMemoryMatch] = useState(false);
  const [showWordScramble, setShowWordScramble] = useState(false);
  const [showGuessThePicture, setShowGuessThePicture] = useState(false);
  const [scrambledWord, setScrambledWord] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [viewerId, setViewerId] = useState(() => `viewer-${Math.random().toString(36).substr(2, 9)}`);
  const [bet, setBet] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [selectedBetOption, setSelectedBetOption] = useState(null);

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

    socket.on('startGuessThePicture', ({ imageUrl, correctAnswer }) => {
      setImageUrl(imageUrl);
      setCorrectAnswer(correctAnswer);
      setShowGuessThePicture(true);
      navigation.navigate('GuessThePicture', { viewerId, imageUrl, correctAnswer });
    });

    socket.on('startBet', bet => {
      setBet(bet);
    });

    socket.on('gameCompleted', (viewerId) => {
      console.log(`${viewerId} completed the game and received a reward!`);
    });

    const fetchCurrentPoll = async () => {
      const response = await axios.get('http://localhost:3000/currentPoll');
      setPoll(response.data);
      setTimeRemaining(response.data.timer);
    };

    const fetchCurrentBet = async () => {
      const response = await axios.get('http://localhost:3000/currentBet');
      setBet(response.data);
    };

    fetchCurrentPoll();
    fetchCurrentBet();


    return () => {
      socket.off('pollCreated');
      socket.off('voteSubmitted');
      socket.off('pollClosed');
      socket.off('pollResults');
      socket.off('startGame');
      socket.off('startWordScramble');
      socket.off('startGuessThePicture');
      socket.off('startBet');
      socket.off('gameCompleted');
    };
  }, []);

  const submitVote = async (optionIndex) => {
    await axios.post('http://localhost:3000/submitVote', { pollId: poll._id, optionIndex });
    setSelectedOption(optionIndex);
  };

  const placeBet = async () => {
    if (selectedBetOption && betAmount) {
      await axios.post('http://localhost:3000/placeBet', {
        viewerId,
        option: selectedBetOption,
        amount: parseFloat(betAmount),
      });
      navigation.navigate('BetResult', { viewerId });
    }
  };

  if (showMemoryMatch || showWordScramble || showGuessThePicture) {
    return null; // Navigation to the games will be handled by React Navigation
  }

  if (!poll && !bet) {
    return (
      <ImageBackground source={require('/Users/mmc/Desktop/tiktok-live-quiz/frontend/assets/background.jpg')} style={styles.backgroundImage}>
        <View style={styles.noPollContainer}>
          <Text style={styles.noPollText}>Live Stream</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('/Users/mmc/Desktop/tiktok-live-quiz/frontend/assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.content}>
          {bet ? (
            <>
              <Text style={styles.question}>{bet.title}</Text>
              <FlatList
                data={bet.options}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.optionButton, selectedBetOption === item.option && styles.selectedOptionButton]}
                    onPress={() => setSelectedBetOption(item.option)}
                  >
                    <Text style={styles.optionText}>{item.option}</Text>
                    <Text style={styles.optionText}>(Live Odds: {item.odds})</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.option}
              />
              <TextInput
                style={styles.input}
                placeholder="Bet Amount"
                value={betAmount}
                onChangeText={setBetAmount}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.button} onPress={placeBet}>
                <Text style={styles.buttonText}>Place Bet</Text>
              </TouchableOpacity>
            </>
          ) : (
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
    </ImageBackground >
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1dc0bb',
    marginVertical: 10,
    width: '100%', // Make buttons full width inside the content box
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#1dc0bb',
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
    fontSize: 16,
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

export default Viewer;
