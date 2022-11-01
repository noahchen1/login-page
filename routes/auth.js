const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const handleLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = await User.findOne({ username: username }).exec();
    const match = await bcrypt.compare(password, foundUser.password);

    if (!foundUser) return res.sendStatus(401); //Unauthorized
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        )

        res.cookie('jwt', refreshToken);
        foundUser.refreshToken = refreshToken;
        foundUser.save()
            .then(() => res.json({roles, accessToken, refreshToken}))
            .catch(err => res.status(400).json('Error' + err));
    } else {
        res.sendStatus(401);
    }
};

router.post('/', handleLogin);
module.exports = router;