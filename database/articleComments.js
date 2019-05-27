const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * 
 * 
 */
// Create Schema
const ArticleCommentsSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    publisher_id: {
        type: String,
        required: true
    },
    article_id: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    contents: {
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

module.exports = ArticleComments = mongoose.model("article-comments-my-blog", ArticleCommentsSchema);