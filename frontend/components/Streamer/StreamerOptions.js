import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const StreamerOptions = ({ navigation }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <ImageBackground source={require('/Users/mmc/Desktop/tiktok-live-quiz/frontend/assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {showOptions ? (
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Streamer')}>
              <Text style={styles.optionButtonText}>Poll</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('MiniGames')}>
              <Text style={styles.optionButtonText}>Mini-Games</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionButtonText}>Auction</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('AnalyticsDashboard')}>
              <Text style={styles.optionButtonText}>Analytics Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={() => setShowOptions(false)}>
              <Text style={styles.smallButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.smallButton} onPress={() => setShowOptions(true)}>
            <Text style={styles.smallButtonText}>Options</Text>
          </TouchableOpacity>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  smallButton: {
    backgroundColor: 'transparent',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  smallButtonText: {
    color: 'white',
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'column',
    gap: 5,
    alignItems: 'center',
  },
  optionButton: {
    padding: 5,
    borderRadius: 5,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 18,
  }
});

export default StreamerOptions;
