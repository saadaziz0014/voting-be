const express = require('express');
const { storeAdmin, Login, getVoteCount, getLogs } = require('../controller/adminController');
const voteController = require('../controller/voteController');
const router = express.Router();
const adminController = require('../controller/adminController');
// Route to store admin credentials
router.post('/store-admin', storeAdmin);
router.post('/login', Login);
router.post('/create-vote', voteController.createVote);
router.post('/ideas', voteController.getAllIdeas);
router.post('/suggested-ideas', voteController.getAllSuggestedIdeas);
router.post('/get-feedbacks', voteController.getFeedbacks);
router.post('/get-vote-count', adminController.getVoteCounts);
router.post('/store-log', adminController.storelogs);
router.post('/get-logs', adminController.getLogs);
router.delete("/delete-idea", voteController.deleteSuggestion);
module.exports = router;
