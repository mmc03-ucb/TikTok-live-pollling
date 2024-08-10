import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, FlatList } from 'react-native';
import axios from 'axios';

const cardsData = [
  { id: 1, value: 'A' },
  { id: 2, value: 'A' },
  { id: 3, value: 'B' },
  { id: 4, value: 'B' },
  { id: 5, value: 'C' },
  { id: 6, value: 'C' },
  { id: 7, value: 'D' },
  { id: 8, value: 'D' },
  // Add more pairs as needed
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const MemoryMatch = ({ route, navigation }) => {
  const { viewerId } = route.params;
  const [cards, setCards] = useState(shuffleArray([...cardsData]));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [timer, setTimer] = useState(60); // 60 seconds for the game
  const [score, setScore] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [reward, setReward] = useState('');
  const [gameEnded, setGameEnded] = useState(false);

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
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.value === secondCard.value) {
        setMatchedCards((prev) => [...prev, firstCard.id, secondCard.id]);
        setScore((prev) => prev + 1);
      }
      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards]);

  useEffect(() => {
    if (matchedCards.length === cards.length) {
      clearInterval(intervalId); // Stop the timer
      handleGameEnd(true);
    }
  }, [matchedCards, cards.length, intervalId]);

  const handleCardFlip = (card) => {
    if (flippedCards.length < 2 && !flippedCards.includes(card) && !matchedCards.includes(card.id)) {
      setFlippedCards((prev) => [...prev, card]);
    }
  };

  const handleGameEnd = async (isVictory) => {
    const response = await axios.post('http://localhost:3000/completeGame', { viewerId, isVictory });
    setReward(response.data.reward);
    setGameEnded(true);
  };

  return (
    <ImageBackground source={require('/Users/mmc/Desktop/tiktok-live-quiz/frontend/assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {!gameEnded ? (
          <View style={styles.content}>
            <Text style={styles.title}>Memory Match</Text>
            <Text style={styles.timer}>Time Remaining: {timer} seconds</Text>
            <Text style={styles.score}>Score: {score}</Text>
            <FlatList
              data={cards}
              numColumns={4}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.card,
                    flippedCards.includes(item) || matchedCards.includes(item.id) ? styles.cardFlipped : styles.cardUnflipped,
                  ]}
                  onPress={() => handleCardFlip(item)}
                  disabled={flippedCards.includes(item) || matchedCards.includes(item.id)}
                >
                  <Text style={styles.cardText}>
                    {flippedCards.includes(item) || matchedCards.includes(item.id) ? item.value : '?'}
                  </Text>
                </TouchableOpacity>
              )}
            />
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
    backgroundColor: 'transparent', // semi-transparent background
  },
  content: {
    backgroundColor: 'transparent', // darker semi-transparent background
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
  timer: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  card: {
    width: 50,
    height: 70,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  cardUnflipped: {
    backgroundColor: '#007bff',
  },
  cardFlipped: {
    backgroundColor: '#28a745',
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1dc0bb',
    marginVertical: 10,
    width: '100%', // Make buttons full width inside the content box
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

export default MemoryMatch;
