require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const allowedOrigins = require('./config/allowedOrigins');
const cors = require('cors');

const port = process.env.PORT || 4000;
const URI = process.env.ATLAS_URI;

app.use(express.json());
app.use(cookieParser());
app.use(cors(allowedOrigins));


connectDB();

const posts = [
    {
        username: 'Noah',
        title: 'User 1'
    },
    {
        username: 'Jouan',
        title: 'User 2'
    }
];

let refreshTokens = [];

app.get('/users', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = {
        name : username
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken === null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })

})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204)
})

/////////////////////////////////////////////////////

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/logout', require('./routes/logout'));
app.use('/refresh', require('./routes/refreshToken'));

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user;
        next()
    })
}

function connectDB() {
    const connection = mongoose.connection;
    mongoose.connect(URI);

    connection.on('error', err => console.log(err));
    connection.once('open', () => console.log('connection to DB has been estabilished!'))
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

app.listen(4000, () => console.log('server is running on port 4000'));