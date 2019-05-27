const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/** 数据样本
 * {
    "_id" : ObjectId("5ce8ed85a0e2ac1ec0bc38e2"),
    "user" : "777",
    "email" : "777@777.com",
    "articleTitle" : "sdsdsssssssssssss",
    "articleContent" : "<p>ssssssssssssssssssssssssssssssssssssssssssssssssss</p>",
    "avatar" : "avatar\\356fb1f16f7a5a1966ea60e1fddce462.jpg",
    "date" : ISODate("2019-05-25T07:23:49.167Z"),
    "__v" : 0,
    "watchTimes" : 104
}
 */
const ArticleSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    articleTitle: {
        type: String,
        required: true
    },
    articleContent: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    identity: {
        type: String,
        required: true
    },
    watchTimes: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Article = mongoose.model("article-my-blog", ArticleSchema);