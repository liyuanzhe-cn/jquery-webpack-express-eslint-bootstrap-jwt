const express = require('express');
const fs = require('fs');
const userRouter = express.Router();
const path = require('path');
const mongoose = require("mongoose");
const userTable = require('../database/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretOrKey } = require('../config/keys')

userRouter.post('/register', (req, res) => {
    // console.log(req.files[0], req.body);

    const { user,
        pass,
        email,
        username,
        wechat,
        birthdate,
        identity,
        realname,
        gender } = req.body;

    //头像重命名
    var newName = req.files[0].path + '.jpg';
    fs.rename(req.files[0].path, newName, (err, data) => {
        err ? console.log('改名失败') : console.log('图片命名成功');
    });

    User.findOne({ email: req.body.email })
        .then((data) => {
            if (data) {
                console.log(data);
                return res.status(400).json({ email: '邮箱已被注册!' });
            } else {

                const newUser = new userTable({
                    user,
                    pass,
                    email,
                    username,
                    wechat,
                    birthdate,
                    realname,
                    gender,
                    identity,
                    avatar: newName
                });
                console.log(newUser);

                // md5 加密
                bcrypt.genSalt(10, (err, salt) => {
                    //salt 是一串加密字符串 会成为密码前面的一段
                    bcrypt.hash(newUser.pass, salt, function (err, hash) {
                        if (err) throw err;
                        //没有问题给密码赋值
                        newUser.pass = hash;
                        //密码md5处理过之后存入到数据库中
                        newUser.save()
                            .then((user) => res.json(user))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
        .catch((error) => { console.log(err) })
});

userRouter.get('/get-user-info/:user_id', (req, res) => {
    // console.log({ user_id: req.params.user_id });
    User.findOne({ _id: req.params.user_id })
        .then((data) => { res.json(data) })
        .catch((err) => { console.log(err) })
});



userRouter.use('/login', (req, res) => {
    const { email, pass } = req.body;
    console.log(req.body);
    userTable.findOne({ email })
        .then((userdata) => {

            if (!userdata) {
                res.status(400).json('用户不存在！')
            } else {
                bcrypt.compare(pass, userdata.pass)
                    .then((passIsMatch) => {
                        if (passIsMatch) {
                            const { _id, identity, user, email, gender, realname, username, birthdate, wechat, avatar, date } = userdata;
                            const rules = { _id, identity, user, email, gender, realname, username, birthdate, wechat, avatar, date };
                            console.log('*', user)
                            jwt.sign(rules, secretOrKey, { expiresIn: 3600 }, (err, token) => {
                                if (err) throw err;
                                // 加密成功，给前端返回成功的json
                                res.json({
                                    success: true,
                                    token: "Bearer " + token /*根据插件作者的要求， 这里一定要写 Bearer空格*/
                                })
                            });
                        } else {
                            res.status(400).json('密码错误');
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        }).catch((err) => {
            console.log(err);
        })
})

// 获取头像接口
userRouter.get('/avatar', (req, res) => {
    //可任意跨域获取服务器中的图片
    res.setHeader('Access-Control-Allow-Origin', '*');
    var rootDir = path.resolve(__dirname, '..');
    // console.log(rootDir + "\\" + req.query.avatar.replace("\\\\", "\\"))
    // fs.readFile(rootDir + "\\" + req.query.avatar.replace("\\\\", "\\"), (err, data) => {
    res.setHeader("Content-type", "image/jpg"); //
    //     var img = new Buffer(data).toString('base64');
    //     res.send(img)
    // })
    // res.setHeader('Content-type', 'application/image')
    // console.log(rootDir + "\\" + req.query.avatar.replace("\\\\", "\\"))
    res.sendFile(rootDir + "\\" + req.query.avatar.replace("\\\\", "\\"));

})





userRouter.use('/test', (req, res) => {
    if (req.query || res.body) {
        res.json({ "ok": "connected" })
    }
})





module.exports = userRouter;