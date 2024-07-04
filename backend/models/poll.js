const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
  votes: { type: [Number], default: [] },
  isActive: { type: Boolean, default: true },
  timer: Number
});

// Method to end the poll
pollSchema.methods.endPoll = function () {
  this.isActive = false;
  return this.save();
};

// Method to calculate results
pollSchema.methods.getResults = function () {
  const totalVotes = this.votes.reduce((acc, vote) => acc + vote, 0);
  return this.options.map((option, index) => ({
    option,
    percentage: totalVotes === 0 ? 0 : (this.votes[index] / totalVotes) * 100,
  }));
};

module.exports = mongoose.model('Poll', pollSchema);
