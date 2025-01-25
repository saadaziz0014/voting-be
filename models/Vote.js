const mongoose = require('mongoose');

// Define the Vote Schema
const voteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    outcomes: { type: String, required: true },
    deadline: { type: Date, required: true },
});
const feedbackSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    voteId: { type: String, required: true },
    userEmail: { type: String, required: true },
    feedback: { type: String, required: true },
    userFirstName: { type: String, required: true },
})
const SuggestionIdeas = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    outcomes: { type: String, required: true },
    userEmail: { type: String, required: true },
    userFirstName: { type: String, required: true },
    userId: { type: String, required: true },
})
const CastedVoteSchema = new mongoose.Schema({
    voteId: { type: String, required: true },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    selectedOption: { type: String, required: true },
    otp: { type: String, required: false },
    otpExpires: { type: Date, required: false },
    verified: { type: Boolean, required: false },

})
const VoteCounterSchema = new mongoose.Schema({
    voteId: { type: String, required: true },
    yesVotes: { type: Number, required: true },
    noVotes: { type: Number, required: true },
})
const logsSchema = new mongoose.Schema({
    userFirstName: { type: String, required: true },
    userId: { type: String, required: true },
    activity: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});
const tempuserSchema = new mongoose.Schema({
    firstName: String,
    surname: String,
    wallet: String,
    network: String,
    fund: String,
    email: String,
    password: String,
    userId: String,
    address: String,
    otp: String,
    otpExpires: Date,
    otpverified: { type: Boolean, default: false },
});
const LoginSchema = new mongoose.Schema({
    userId: String,
    firstName: String,
    email: String,
    password: String,
    otp: String,
    otpExpires: Date,
    otpverified: { type: Boolean, default: false },
})
module.exports.Login = mongoose.model("LoginSchema", LoginSchema);
module.exports.TempUser = mongoose.model('TempUser', tempuserSchema);
module.exports.Logs = mongoose.model('Logs', logsSchema);
module.exports.CastedVote = mongoose.model("CastedVote", CastedVoteSchema);
module.exports.VoteCounter = mongoose.model("VoteCounter", VoteCounterSchema);
module.exports.SuggestionIdeas = mongoose.model('SuggestionIdeas', SuggestionIdeas);
module.exports.Vote = mongoose.model('Vote', voteSchema);
module.exports.Feedback = mongoose.model('Feedback', feedbackSchema);
