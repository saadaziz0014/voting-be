const Admin = require('../models/Admin');
const { Vote, VoteCounter, Logs } = require('../models/Vote');
// Controller to check if the admin exists, and store if not
exports.storeAdmin = async (req, res) => {
    try {
        // Check if admin already exists in the database
        const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists.' });
        }

        // Create a new admin and save it to the database
        const admin = new Admin({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
        });
        console.log(process.env.ADMIN_PASSWORD, process.env.ADMIN_EMAIL);

        await admin.save();
        res.status(200).json({ message: 'Admin stored successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if admin already exists in the database
        const existingAdmin = await Admin.findOne({ email });

        if (!existingAdmin) {
            return res.status(400).json({ message: 'Admin not found.' });
        }
        // Create a new admin and save it to the database
        else {
            if (existingAdmin.password === password) {
                res.status(200).json({ message: 'Admin logged in successfully.' });
            }
            else {
                res.status(400).json({ message: 'Invalid password.' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.getVoteCounts = async (req, res) => {
    const { voteId } = req.body;
    try {
        const votes = await VoteCounter.findOne({ voteId });
        res.json(votes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.storelogs = async (req, res) => {
    const { userFirstName, userId, activity } = req.body;
    try {
        const log = await Logs.create({
            userFirstName,
            userId,
            activity
        });
        res.status(200).json({ message: 'Log stored successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.addlogs = async (userFirstName, userId, activity) => {
    const log = await Logs.create({
        userFirstName,
        userId,
        activity
    });
};
exports.getLogs = async (req, res) => {
    try {
        const logs = await Logs.find();
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
