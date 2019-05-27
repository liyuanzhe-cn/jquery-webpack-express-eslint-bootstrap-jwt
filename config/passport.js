
const JwtStrategy = require('passport-jwt').Strategy;
//
const ExtractJwt = require('passport-jwt').ExtractJwt;
//引入数据库操作接口
const mongoose = require('mongoose');

// const userTable = mongoose.model('users-my-blog');
const userTable = require('../database/user')
// 环境变量中的key
const { secretOrKey } = require('../config/keys');

var opts = {}
// 定义从请求头的Authrization获取token数据
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// 存入环境变量的混淆密码
opts.secretOrKey = secretOrKey;

module.exports = passport => {
    var jwtConfig = new JwtStrategy(opts, (jwt_payload, done) => {
        // jwt_payload 解析好的 token字符串，
        // done 验证用的函数 function verified (){} 

        userTable.findById(jwt_payload._id)
            .then(user => {
                // console.log(jwt_payload, user);
                if (user) {
                    return done(null, user)
                }
                resizeBy.status(400).json('用户不存在')
            }).catch(err => {
                console.log(err)
            })
    })
    passport.use(jwtConfig);
}

