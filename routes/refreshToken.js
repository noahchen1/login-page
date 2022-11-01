const User = require('../model/User');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    const refreshToken = cookies.jwt;
    if (!refreshToken) return res.sendStatus(401)

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
            if (err || foundUser.username !== user.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles).filter(Boolean);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": user.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );
            res.json({ roles, accessToken })
        }
    )
};

router.get('/', handleRefreshToken);
module.exports = router;