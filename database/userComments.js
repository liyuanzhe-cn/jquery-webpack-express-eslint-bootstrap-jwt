const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * 
 * 
 */
// Create Schema
const UserCommentsSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    publisher_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    identity: {
        type: String,
        default: true
    },
    like: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = UserComments = mongoose.model("user-comments-my-blog", UserCommentsSchema);