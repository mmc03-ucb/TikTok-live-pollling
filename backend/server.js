const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Poll = require('/Users/mmc/Desktop/tiktok-live-quiz/backend/models/poll.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://muqueet03:bjn2eJU955ZGRCzT@tiktok-live-quiz.8z8okt3.mongodb.net/?retryWrites=true&w=majority&appName=tiktok-live-quiz', { useNewUrlParser: true, useUnifiedTopology: true });

// Game Schema for Memory Match
const GameSchema = new mongoose.Schema({
  viewerId: String,
  completed: Boolean,
  reward: String,
});

const Game = mongoose.model('Game', GameSchema);

// Function to scramble a word
const scrambleWord = (word) => {
  const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
  return scrambled !== word ? scrambled : scrambleWord(word); // Ensure the scrambled word is different from the original
};

// Function to handle poll ending based on timer
const handlePollTimer = (poll) => {
  if (poll.timer && poll.timer > 0) {
    setTimeout(async () => {
      const endedPoll = await Poll.findById(poll._id);
      if (endedPoll.isActive) {
        await endedPoll.endPoll();
        io.emit('pollClosed', endedPoll);
        const results = endedPoll.getResults();
        io.emit('pollResults', results);
      }
    }, poll.timer * 1000);
  }
};

// API Endpoints for Poll
app.post('/createPoll', async (req, res) => {
  const { question, options, correctAnswer, timer } = req.body;
  const poll = new Poll({ question, options, correctAnswer, votes: Array(options.length).fill(0), isActive: true, timer });
  await poll.save();
  handlePollTimer(poll); // Call the timer function after saving the poll
  io.emit('pollCreated', poll);
  res.status(201).send(poll);
});

app.get('/currentPoll', async (req, res) => {
  const poll = await Poll.findOne({ isActive: true });
  res.send(poll);
});

app.post('/submitVote', async (req, res) => {
  const { pollId, optionIndex } = req.body;
  const poll = await Poll.findById(pollId);
  if (poll.isActive) {
    poll.votes[optionIndex]++;
    await poll.save();
    io.emit('voteSubmitted', poll);
    res.send(poll);
  } else {
    res.status(400).send('Poll is not active');
  }
});

app.post('/endPoll/:id', async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).send('Poll not found');
  await poll.endPoll();
  io.emit('pollClosed', poll);
  const results = poll.getResults();
  io.emit('pollResults', results);
  res.send(poll);
});

app.get('/pollResults/:id', async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).send('Poll not found');
  const results = poll.getResults();
  res.send(results);
});

app.get('/results', async (req, res) => {
  const poll = await Poll.findOne({ isActive: false }).sort({ _id: -1 });
  res.send(poll);
});

// API Endpoints for Memory Match Game
app.post('/startGame', (req, res) => {
  io.emit('startGame');
  res.status(200).send('Game started');
});

app.post('/completeGame', async (req, res) => {
  const { viewerId, isVictory } = req.body;
  const reward = isVictory ? 'Congratulations! You won a reward!' : 'Try again next time!';
  await Game.create({ viewerId, completed: true, reward });
  io.emit('gameCompleted', viewerId);
  res.status(200).send({ reward });
});


app.get('/gameResults', async (req, res) => {
  const results = await Game.find({ completed: true });
  res.status(200).send(results);
});

// API Endpoints for Word Scramble Game
app.post('/startWordScramble', (req, res) => {
  const { word } = req.body;
  io.emit('startWordScramble', { word: word });
  res.status(200).send('Word Scramble started');
});


app.post('/completeWordScramble', async (req, res) => {
  const { viewerId, isVictory } = req.body;
  const reward = isVictory ? 'Congratulations! You unscrambled the word!' : 'Try again next time!';
  await Game.create({ viewerId, completed: true, reward });
  io.emit('wordScrambleCompleted', viewerId);
  res.status(200).send({ reward });
});

// API Endpoints for Guess the Picture Game
app.post('/startGuessThePicture', (req, res) => {
  io.emit('startGuessThePicture');
  res.status(200).send('Guess the Picture started');
});

app.post('/completeGuessThePicture', async (req, res) => {
  const { viewerId, isVictory } = req.body;
  const reward = isVictory ? 'Congratulations! You guessed the picture!' : 'Try again next time!';
  await Game.create({ viewerId, completed: true, reward });
  io.emit('guessThePictureCompleted', viewerId);
  res.status(200).send({ reward });
});


// Start server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
