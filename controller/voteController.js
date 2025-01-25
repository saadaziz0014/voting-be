const Admin = require('../models/Admin');
const { Vote } = require('../models/Vote');
const { Feedback } = require('../models/Vote');
const { SuggestionIdeas, Logs } = require('../models/Vote');
const { addlogs } = require("../controller/adminController");

// Create a new vote proposal
exports.createVote = async (req, res) => {
    try {
        const { title, description, outcomes, deadlineDate, deadlineTime } = req.body;
        const deadline = new Date(`${deadlineDate}T${deadlineTime}:00`);

        const newVote = new Vote({
            title,
            description,
            outcomes,
            deadline,
        });

        // Save to the database
        await newVote.save();

        res.status(201).json({
            message: 'Vote proposal created successfully',
            vote: newVote,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating vote proposal', error: error.message });
    }
};
exports.getAllIdeas = async (req, res) => {
    try {
        const ideas = await Vote.find();
        res.json(ideas); // Sending ideas as JSON response
    } catch (error) {
        console.error("Error fetching ideas:", error);
        res.status(500).json({ message: "Error fetching ideas" });
    }
};
exports.getAllSuggestedIdeas = async (req, res) => {
    try {
        const ideas = await SuggestionIdeas.find();
        res.json(ideas); // Sending ideas as JSON response
    } catch (error) {
        console.error("Error fetching ideas:", error);
        res.status(500).json({ message: "Error fetching ideas" });
    }
}
exports.giveFeedback = async (req, res) => {
    const { voteId, userId, userEmail, feedback, userFirstName } = req.body;
    try {
        const feed_back = await Feedback.create({
            userId,
            voteId,
            userEmail,
            feedback,
            userFirstName,
        });
        const vote = await Vote.findOne({ _id: voteId });
        addlogs(userFirstName, userId, ("Gave Feedback On: " + vote.title).trim());
        res.status(200).json({ message: "Feedback given successfully!" });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Error giving feedback",
        })
    }
};
exports.getFeedbacks = async (req, res) => {
    const { voteId } = req.body;
    try {
        const feedbacks = await Feedback.find({ voteId });
        res.json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ message: "Error fetching feedbacks" });
    }
}
exports.deleteSuggestion = async (req, res) => {
    const { id } = req.body; // Ensure `id` is correctly sent from the frontend
    try {
        await SuggestionIdeas.findOneAndDelete({ _id: id });
        res.status(200).json({ message: "Idea deleted successfully" });
    } catch (error) {
        console.error("Error deleting idea:", error);
        res.status(500).json({ message: "Error deleting idea" });
    }
};
