import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const StreamerOptions = ({ navigation }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {showOptions ? (
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Streamer')}>
              <Text style={styles.optionButtonText}>Poll</Text>
            </TouchableOpacity>
            {/* Add more options here */}
            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Streamer')}>
              <Text style={styles.optionButtonText}>Auction</Text>
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
    justifyContent: 'flex-end', // Aligns children to the bottom
    alignItems: 'center',
    paddingBottom: 20, // Adjust as needed to position the button
  },
  smallButton: {
    backgroundColor: 'transparent', // Transparent background
    padding: 5,
    borderRadius: 5,
    borderWidth: 1, // Add a border if needed
    borderColor: '#007bff', // Color of the border
  },
  smallButtonText: {
    color: '#007bff', // Color of the text to match the border
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 5,
    marginVertical: 10,
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 18,
  }
});

export default StreamerOptions;
