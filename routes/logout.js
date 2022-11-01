const User = require('../model/User');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const handlelogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204) //No content

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie('jwt');
        return res.sendStatus(204);
    } else {
        foundUser.refreshToken = '';
        foundUser.save()
            .then(() => res.json('user logout!'))
            .catch(err => res.status(400).json('Error' + err));   
        
        res.clearCookie('jwt')
        // res.sendStatus(204)
    }

};

router.get('/', handlelogout);
module.exports = router;