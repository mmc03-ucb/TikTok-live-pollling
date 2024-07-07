const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  viewerId: String,
  option: String,
  amount: Number,
});

const Bet = mongoose.model('Bet', betSchema);

const currentBetSchema = new mongoose.Schema({
  title: String,
  options: [
    {
      option: String,
      bets: Number,
      odds: Number,
      winning: { type: Boolean, default: false }, // Add winning field
    }
  ],
  timer: Number,
  active: Boolean,
});

const CurrentBet = mongoose.model('CurrentBet', currentBetSchema);

module.exports = { Bet, CurrentBet };
