const { User } = require("../models/User");
const nodemailer = require("nodemailer");
//var hbs = require("nodemailer-express-handlebars");
const { SuggestionIdeas, CastedVote, VoteCounter, Logs, Vote, TempUser, Login } = require("../models/Vote");
const crypto = require("crypto");
const Admin = require("../models/Admin");
const { addlogs } = require("../controller/adminController");
const { set } = require("mongoose");
const e = require("express");
const path = require("path");


function template(otp, reason, time) {
    return (`
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OTP Verification</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0;
        background-color: #f4f4f9; } .container { max-width: 600px; margin: 20px
        auto; padding: 20px; background: #ffffff; border-radius: 10px; box-shadow:
        0 2px 10px rgba(0, 0, 0, 0.1); } .header { text-align: center;
        margin-bottom: 20px; } .header h1 { color: #333333; } .content {
        text-align: center; font-size: 16px; line-height: 1.5; color: #555555; }
        .otp-box { display: inline-block; margin: 20px 0; padding: 10px 20px;
        background-color: #e9f5ff; color: #0056b3; font-weight: bold; font-size:
        20px; border-radius: 5px; } .footer { margin-top: 20px; font-size: 12px;
        text-align: center; color: #888888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Voting App OTP</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Your OTP For:</p>
          <p><strong>${reason}</strong></p>
          <p>Your OTP is:</p>
          <div class="otp-box">${otp}</div>
          <p>
            Please use this OTP to complete your request. This OTP will expire in
            ${time}
            minutes.
          </p>
        </div>
        <div class="footer">
          <p>If you did not request this OTP, please ignore this email.</p>
          <p>Thank you for using Voting App!</p>
        </div>
      </div>
    </body>
  </html>`)
}



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendEmail = async (email, otp, time) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: `"Voting App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Sign Up OTP Code",
        html: template(otp, "Sign Up", time),
    });
};


const signInsendEmail = async (email, otp, time) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: `"Voting App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Sign In OTP Code",
        html: template(otp, "Sign In", time),
        //text: `Your Sign In OTP code is: ${otp}`,
    });
};
const votesendEmail = async (email, otp, title, vote, time) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: `"Voting App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Vote Confirmation OTP Code",

        html: template(otp, "Casting Vote", time),
    });
};
const tempChangeDetailsEmail = async (email, otp, time) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: `"Voting App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Change Details OTP Code",
        html: template(otp, "Changing Details", time),
    });
}
exports.signUp = async (req, res) => {
    const { firstName, surname, wallet, network, fund, email, password, address } = req.body;

    try {
        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 1 * 60 * 1000); // OTP valid for 5 minutes
        const Existinguser = await User.findOne({ email });
        if (Existinguser) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (Existinguser && Existinguser.otpverified == false) {
            return res.status(400).json({ message: "User already exists and not verified Try Again after 5 minutes" });
        }
        // Create user
        const user = await User.create({
            firstName,
            surname,
            wallet,
            network,
            fund,
            email,
            password,
            address,
            otp,
            otpExpires,
            otpverified: false
        });

        // Send OTP email
        await sendEmail(email, otp, 1);

        // Set a timer to delete the user if OTP is not verified within 5 minutes
        setTimeout(async () => {
            const expiredUser = await User.findOne({ email });
            if (expiredUser && expiredUser.otpExpires < Date.now() && expiredUser.otpverified == false) {
                await User.findOneAndDelete({ email });
                console.log(`User with email ${email} was deleted due to OTP expiration.`);
            }
        }, 1 * 60 * 1000); // 5 minutes
        //addlogs(user.firstName, user._id, "Signed Up Unverified");


        res.status(200).json({ message: "OTP sent to your email!" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error signing up", error });
    }
};
exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.otpverified == false) {
            return res.status(400).json({ message: "User not found or OTP not verified" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const login = await Login.create({
            userId: user._id,
            otp: generateOTP(),
            otpExpires: new Date(Date.now() + 1 * 60 * 1000),
            otpverified: false,
            firstName: user.firstName,
            email: user.email,
            password: user.password

        });
        await signInsendEmail(email, login.otp, 1);



        setTimeout(async () => {
            const expiredUser = await Login.findOne({ _id: login._id });
            if (expiredUser && expiredUser.otpExpires < Date.now() && expiredUser.otpverified == false) {
                await Login.findOneAndDelete({ email });
                console.log(`Login with email ${email} was deleted due to OTP expiration.`);
            }
        }, 1 * 60 * 1000); // 5 minutes

        //addlogs(user.firstName, user._id, "Signed In Unverified");

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(400).json({ message: "Error signing in", error });
    }
}
exports.verifysigninOTP = async (req, res) => {
    const { otp } = req.body;

    try {
        const user = await Login.findOne({ otp });

        if (!user || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP after verification
        user.otp = null;
        user.otpExpires = null;
        user.otpverified = true;
        await user.save();
        addlogs(user.firstName, user.userId, "Signed In Verified");

        res.status(200).json({ message: "OTP verified successfully!", user });
    } catch (error) {
        res.status(400).json({ message: "Error verifying OTP", error });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP after verification
        user.otp = null;
        user.otpExpires = null;
        user.otpverified = true;
        await user.save();
        addlogs(user.firstName, user._id, "Signed Up Verified");

        res.status(200).json({ message: "OTP verified successfully!" });
    } catch (error) {
        res.status(400).json({ message: "Error verifying OTP", error });
    }
};

exports.changeEmail = async (req, res) => {
    const { email } = req.body;

    try {
        await User.findOneAndDelete({ email });
        res.status(200).json({ message: "Email removed, you can sign up again." });
    } catch (error) {
        res.status(400).json({ message: "Error changing email", error });
    }
};
exports.addSuggestionIdea = async (req, res) => {
    const { title, description, outcomes, userEmail, userFirstName, userId } = req.body;
    try {
        console.log(title, description, outcomes, userEmail, userFirstName, userId);
        const suggestion = await SuggestionIdeas.create({
            title,
            description,
            outcomes,
            userEmail,
            userFirstName,
            userId,
        });
        addlogs(userFirstName, userId, "Added Suggestion Idea: " + title);
        res.status(200).json({ message: "Suggestion Idea added successfully!", suggestion });
    } catch (error) {
        console.log(error);

        res.status(400).json({ message: "Error adding suggestion idea", error });
    }
};
exports.castVote = async (req, res) => {
    const { voteId, userId, userEmail, selectedOption, title } = req.body;
    try {
        const otp = generateOTP();
        const verified = false;
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // OTP valid for 5 minutes 
        const castedVote = await CastedVote.create({
            voteId,
            userId,
            userEmail,
            selectedOption,
            otp,
            otpExpires,
            verified
        });
        await votesendEmail(userEmail, otp, title, selectedOption, 2);
        const user = await User.findOne({ _id: userId });

        //addlogs(user.firstName, userId, "Cast Vote Unverified: " + title);

        // Set a timer to delete the user if OTP is not verified within 5 minutes
        setTimeout(async () => {
            const expiredVote = await CastedVote.findOne({ otp });
            if (expiredVote && expiredVote.otpExpires < Date.now() && expiredVote.verified == false) {
                await CastedVote.findOneAndDelete({ otp });
                console.log(`Vote with otp ${otp} was deleted due to OTP expiration.`);
            }
        }, 2 * 60 * 1000)
        res.status(200).json({ message: "Vote casted successfully! Check Email for OTP", castedVote });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Error casting vote",
        })
    }
};

exports.verifyvoteOTP = async (req, res) => {
    const { otp } = req.body;

    try {
        const vote = await CastedVote.findOne({ otp });

        if (!vote || vote.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP after verification
        vote.otp = null;
        vote.otpExpires = null;
        vote.verified = true;

        const voteId = vote.voteId;

        var voteCounter = await VoteCounter.findOne({ voteId });
        if (!voteCounter) {
            voteCounter = await VoteCounter.create({
                voteId: vote.voteId,
                yesVotes: 0,
                noVotes: 0,
            })
        }
        if (vote.selectedOption == "Yes") {
            voteCounter.yesVotes += 1;

        }
        else {
            voteCounter.noVotes += 1;
        }

        const user = await User.findOne({ _id: vote.userId });
        const tempvote = await Vote.findOne({ _id: voteId });

        addlogs(user.firstName, vote.userId, "Cast Vote Verified: " + tempvote.title);

        await voteCounter.save();
        await vote.save();  // Save the updated vote document
        res.status(200).json({ message: "OTP verified! Vote Casted!" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error verifying OTP", error });
    }
};
exports.tempchangeDetails = async (req, res) => {
    const { userId, firstName, surname, email, network, wallet, password, fund } = req.body;
    try {
        const otp = generateOTP();
        const verified = false;
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // OTP valid for 5 minutes
        const tempChangeDetails = await TempUser.create({
            userId,
            firstName,
            surname,
            email,
            network,
            wallet,
            password,
            fund,
            otp,
            otpExpires,
            verified
        });
        await tempChangeDetailsEmail(email, otp, 2);
        setTimeout(async () => {
            const expiredChangeDetails = await TempUser.findOne({ otp });
            if (expiredChangeDetails && expiredChangeDetails.otpExpires < Date.now() && expiredChangeDetails.verified == false) {
                await TempUser.findOneAndDelete({ otp });
                console.log(`Change Details with otp ${otp} was deleted due to OTP expiration.`);
            }
        })

        //addlogs(firstName, userId, "Changed Details Unverified");

        res.status(200).json({ message: "Details changed successfully!" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error changing details", error });
    }
}
exports.verifyTempChangeDetailsOTP = async (req, res) => {
    const { otp } = req.body;
    try {
        console.log("otp:", otp);
        const tempChangeDetails = await TempUser.findOne({ otp });
        if (!tempChangeDetails || tempChangeDetails.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP after verification
        tempChangeDetails.otp = null;
        tempChangeDetails.otpExpires = null;
        tempChangeDetails.verified = true;
        await tempChangeDetails.save();

        const user = await User.findOne({ _id: tempChangeDetails.userId });

        user.firstName = tempChangeDetails.firstName;
        user.surname = tempChangeDetails.surname;
        user.email = tempChangeDetails.email;
        user.network = tempChangeDetails.network;
        user.wallet = tempChangeDetails.wallet;
        user.password = tempChangeDetails.password;
        user.fund = tempChangeDetails.fund;

        console.log(user);


        await user.save();  // Save the updated user document

        addlogs(user.firstName, user._id, "Changed Details Verified");

        res.status(200).json({ message: "OTP verified! Details Changed!" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error verifying OTP", error });
    }
}
exports.getuser = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findOne({ _id: userId });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.checkvote = async (req, res) => {
    const { voteId, userId } = req.body;
    try {
        const castedvote = await CastedVote.find({ voteId });
        try {
            var casted = false;
            var send = null;
            castedvote.forEach(element => {
                if (element.userId == userId && element.verified == true) {
                    casted = true;
                    send = element;
                }
            });
            if (casted) {
                //console.log(castedvote);
                res.status(200).json(send);
            }
            else {
                res.status(400).json({ message: "Invalid or expired OTP" });
            }

        }
        catch (error) {
            console.log(error);
            res.status(400).json({ message: "Invalid or expired OTP" });
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
