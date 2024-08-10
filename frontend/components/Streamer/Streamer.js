import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, FlatList } from 'react-native';
import axios from 'axios';

const Streamer = ({ navigation }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timer, setTimer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const addOption = () => {
    setOptions([...options, '']);
  };

  const createPoll = async () => {
    const response = await axios.post('http://localhost:3000/createPoll', { question, options, correctAnswer, timer });
    setQuestion('');
    setOptions(['', '']);
    setTimer(null);
    setCorrectAnswer('');
    navigation.navigate('ActivePoll', { pollId: response.data._id });
  };

  return (
    <ImageBackground source={require('/Users/mmc/Desktop/tiktok-live-quiz/frontend/assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Create a new poll</Text>
          <TextInput
            placeholder="Question"
            value={question}
            onChangeText={setQuestion}
            style={styles.input}
          />
          {options.map((option, index) => (
            <TextInput
              key={index}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChangeText={text => {
                const newOptions = [...options];
                newOptions[index] = text;
                setOptions(newOptions);
              }}
              style={styles.input}
            />
          ))}
          <TouchableOpacity style={styles.button} onPress={addOption}>
            <Text style={styles.buttonText}>Add Option</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Correct Answer (optional)"
            value={correctAnswer}
            onChangeText={setCorrectAnswer}
            style={styles.input}
          />
          <TextInput
            placeholder="Timer in seconds (optional)"
            value={timer}
            onChangeText={setTimer}
            style={styles.input}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={createPoll}>
            <Text style={styles.buttonText}>Create Poll</Text>
          </TouchableOpacity>
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
    backgroundColor: 'transparent', // semi-transparent background
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // darker semi-transparent background
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'bold'
  },
  input: {
    borderWidth: 1,
    //borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
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
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 20,
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

export default Streamer;
