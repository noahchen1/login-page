const mongoose = require('mongoose');
const schema = mongoose.Schema;
const userSchema = new schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: {
            type: Number
        }, 
        Admin: {
            type: Number
        }
    }, 
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);