const User = require('../model/User');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const handleNewUser = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const duplicate = await User.findOne({ username: username }).exec();

    if (duplicate) return res.sendStatus(409) //conflict

    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = new User({
        username: username,
        password: hashedPwd
    })

    newUser.save()
        .then(() => res.json(`New user ${username} added!`))
        .catch(err => res.status(400).json('Error' + err));
};

router.post('/', handleNewUser);
module.exports = router;