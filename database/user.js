const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * 
 * 
 * user: 'sdsdsdsd',
  pass: '1',
  email: 'sds',
  username: 'dsd',
  wechat: 'sds',
  birthdate: '2019-05-09',
  realname: 'dsds',
  gender: 'male'
 */
// Create Schema
const UserSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true,
        max: 20,
        min: 3
    },
    gender: {
        type: String,
        required: true
    },
    realname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    identity: {
        type: String,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    },
    wechat: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model("users-my-blog", UserSchema);