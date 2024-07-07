import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import Streamer from './components/Streamer/Streamer.js';
import Viewer from './components/Viewer';
import ActivePoll from './components/Streamer/ActivePoll';
import StreamerOptions from './components/Streamer/StreamerOptions';
import MiniGames from './components/Games/MiniGames';
import MemoryMatch from './components/Games/MemoryMatch';
import ActiveGame from './components/Games/ActiveGame';
import WordScramble from './components/Games/WordScramble'; // Import the new component
import GuessThePicture from './components/Games/GuessThePicture';
import AnalyticsDashboard from './components/Streamer/AnalyticsDashboard';
import Betting from './components/Streamer/Betting.js';
import LiveBetMonitor from './components/Streamer/LiveBetMonitor.js';
import PlaceBet from './components/PlaceBet.js';
import BetResult from './components/BetResult.js';

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
        <Stack.Screen name="Betting" component={Betting} options={{ headerShown: false }} />
        <Stack.Screen name="LiveBetMonitor" component={LiveBetMonitor} options={{ headerShown: false }} />
        <Stack.Screen name="PlaceBet" component={PlaceBet} options={{ headerShown: false }} />
        <Stack.Screen name="BetResult" component={BetResult} options={{ headerShown: false }} />
        <Stack.Screen name="AnalyticsDashboard" component={AnalyticsDashboard} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
