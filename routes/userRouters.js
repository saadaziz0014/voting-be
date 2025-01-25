const express = require("express");
const { signUp, verifyOTP, changeEmail, castVote, verifyvoteOTP, getuser, checkvote, verifysigninOTP } = require("../controller/userController");
const { signIn } = require("../controller/userController");
const { createVote, giveFeedback, deleteSuggestion } = require("../controller/voteController");
const { addSuggestionIdea, tempchangeDetails, verifyTempChangeDetailsOTP } = require("../controller/userController");
const router = express.Router();

router.post("/signup", signUp);
router.post("/verify-otp", verifyOTP);
router.post("/change-email", changeEmail);
router.post("/Login", signIn);
router.post("/Login-Verify", verifysigninOTP);
router.post("/give-feedback", giveFeedback);
router.post("/idea-suggestion", addSuggestionIdea)
router.post("/cast-vote", castVote);
router.post("/verify-vote", verifyvoteOTP);
router.post("/get-user", getuser);
router.post("/change-details", tempchangeDetails);
router.post("/verify-change-details", verifyTempChangeDetailsOTP);
router.post("/check-vote", checkvote);
module.exports = router;
