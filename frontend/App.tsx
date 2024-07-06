import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import Streamer from './components/Streamer';
import Viewer from './components/Viewer';
import ActivePoll from './components/ActivePoll';
import StreamerOptions from './components/StreamerOptions';
import MiniGames from './components/MiniGames';
import MemoryMatch from './components/MemoryMatch';
import ActiveGame from './components/ActiveGame';
import WordScramble from './components/WordScramble'; // Import the new component
import GuessThePicture from './components/GuessThePicture';
import AnalyticsDashboard from './components/AnalyticsDashboard';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StreamerOptions" component={StreamerOptions} options={{ headerShown: false }} />
        <Stack.Screen name="Streamer" component={Streamer} options={{ headerShown: false }} />
        <Stack.Screen name="ActivePoll" component={ActivePoll} options={{ headerShown: false }} />
        <Stack.Screen name="Viewer" component={Viewer} options={{ headerShown: false }} />
        <Stack.Screen name="MiniGames" component={MiniGames} options={{ headerShown: false }} />
        <Stack.Screen name="MemoryMatch" component={MemoryMatch} options={{ headerShown: false }} />
        <Stack.Screen name="ActiveGame" component={ActiveGame} options={{ headerShown: false }} />
        <Stack.Screen name="WordScramble" component={WordScramble} options={{ headerShown: false }} />
        <Stack.Screen name="GuessThePicture" component={GuessThePicture} options={{ headerShown: false }} />
        <Stack.Screen name="AnalyticsDashboard" component={AnalyticsDashboard} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
