const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Poll = require('/Users/mmc/Desktop/tiktok-live-quiz/backend/models/poll.js');
const { Bet, CurrentBet } = require('./models/bet');

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
  const { imageUrl, correctAnswer } = req.body;
  io.emit('startGuessThePicture', { imageUrl, correctAnswer });
  res.status(200).send('Guess the Picture started');
});


app.post('/completeGuessThePicture', async (req, res) => {
  const { viewerId, isVictory } = req.body;
  const reward = isVictory ? 'Congratulations! You guessed the picture!' : 'Try again next time!';
  await Game.create({ viewerId, completed: true, reward });
  io.emit('guessThePictureCompleted', viewerId);
  res.status(200).send({ reward });
});

app.post('/startBet', async (req, res) => {
  const { title, options, timer } = req.body;
  const betOptions = options.map(option => ({ option, bets: 0, odds: 2.0 })); // Initialize odds to 2.0
  const newBet = new CurrentBet({ title, options: betOptions, timer, active: true });
  await newBet.save();
  io.emit('startBet', newBet);
  res.status(201).send(newBet);
});


app.get('/currentBet', async (req, res) => {
  const currentBet = await CurrentBet.findOne({ active: true });
  res.send(currentBet);
});

app.post('/placeBet', async (req, res) => {
  const { viewerId, option, amount } = req.body;

  const bet = new Bet({ viewerId, option, amount });
  await bet.save();

  const currentBet = await CurrentBet.findOne({ active: true });

  if (!currentBet) {
    return res.status(404).send('No active bet found');
  }

  const betOption = currentBet.options.find(opt => opt.option === option);

  if (!betOption) {
    return res.status(400).send('Invalid betting option');
  }

  betOption.bets += amount;
  await currentBet.save();

  // Update odds after placing the bet
  await updateOdds(currentBet._id);

  res.status(201).send(bet);
});

const updateOdds = async (currentBetId) => {
  const currentBet = await CurrentBet.findById(currentBetId);

  if (!currentBet) {
    return;
  }

  const totalBets = currentBet.options.reduce((sum, option) => sum + option.bets, 0);

  if (totalBets === 0) {
    currentBet.options.forEach(option => option.odds = 2.0);
  } else {
    currentBet.options.forEach(option => {
      const probability = option.bets / totalBets;
      option.odds = (1 / probability).toFixed(2);
    });
  }

  await currentBet.save();
  io.emit('updateOdds', currentBet); // Notify clients of the updated odds
};


app.post('/endBet', async (req, res) => {
  const { winningOption } = req.body; // The winning option should be provided in the request
  const currentBet = await CurrentBet.findOne({ active: true });

  if (!currentBet) {
    return res.status(404).send('No active bet found');
  }

  // Set the winning property for the winning option
  currentBet.options.forEach(option => {
    if (option.option === winningOption) {
      option.winning = true;
    } else {
      option.winning = false;
    }
  });

  currentBet.active = false;
  await currentBet.save();

  const bets = await Bet.find();
  const totalBets = bets.reduce((sum, bet) => sum + bet.amount, 0);

  // Calculate payouts
  const payoutResults = [];
  let totalWinningBets = 0;

  // Calculate the total amount bet on the winning option
  bets.forEach(bet => {
    if (bet.option === winningOption) {
      totalWinningBets += bet.amount;
    }
  });

  // Calculate and distribute payouts
  bets.forEach(bet => {
    if (bet.option === winningOption) {
      const payoutRatio = totalBets / totalWinningBets;
      const payoutAmount = bet.amount * payoutRatio;
      payoutResults.push({
        viewerId: bet.viewerId,
        payout: payoutAmount,
        message: `Congratulations! You won ${payoutAmount.toFixed(2)} units.`
      });
    } else {
      payoutResults.push({
        viewerId: bet.viewerId,
        payout: 0,
        message: 'Sorry, you lost this bet.'
      });
    }
  });

  io.emit('endBet', { currentBet, payoutResults });
  res.status(200).send({ currentBet, payoutResults });
});


app.get('/betResult/:viewerId', async (req, res) => {
  const { viewerId } = req.params;
  const currentBet = await CurrentBet.findOne({ active: true });
  const bets = await Bet.find({ viewerId });

  if (!bets.length) {
    return res.status(404).send('No bets found for this viewer');
  }

  if (currentBet) {
    // Bet is still active
    const viewerBet = bets.find(bet => bet.option);
    res.send({
      active: true,
      message: `You bet on: ${viewerBet.option} with an amount of ${viewerBet.amount}`,
    });
  } else {
    // Bet has ended
    const endedBet = await CurrentBet.findOne({ active: false });
    if (!endedBet) {
      return res.status(404).send('No bet results found');
    }

    const winningOption = endedBet.options.find(option => option.winning).option;

    // These aggregate queries need to be within an async function
    const totalBets = await Bet.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
    const totalWinningBets = await Bet.aggregate([{ $match: { option: winningOption } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);

    const betResult = bets.map(bet => {
      if (bet.option === winningOption) {
        const payoutRatio = totalBets[0].total / totalWinningBets[0].total;
        const payoutAmount = bet.amount * payoutRatio;
        return {
          outcome: 'won',
          payout: payoutAmount,
          message: `Congratulations! You won ${payoutAmount.toFixed(2)}!`,
        };
      } else {
        return {
          outcome: 'lost',
          message: 'Sorry, you lost this bet.',
        };
      }
    });

    res.send({ active: false, betResult });
  }
});



// Start server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
