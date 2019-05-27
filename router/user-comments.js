const express = require('express');
const UserCommentsRouter = express.Router();
const UserCommentsTable = require('../database/userComments')
const passport = require('passport');

// 添加对用户的评论 (验证)
UserCommentsRouter.post('/publish', passport.authenticate("jwt", { session: false }), (req, res) => {
        const articleData = {
                user, //评论者
                publisher_id, // 评论者的_id
                user_id, //被评论者的_id
                avatar, //头像
                identity, //身份
                contents
        } = req.body;
        console.log(articleData, '添加对用户的评论 (验证)');
        new UserCommentsTable(articleData).save().then((article) => {
                res.json(article)
        }).catch(err => {
                console.log('/publish 错误')
        })
});

// 获取全部评论
UserCommentsRouter.get('/get-allComments/:user_id', (req, res) => {
        console.log(req.params.user_id)
        UserCommentsTable.find({ user_id: req.params.user_id })
                .then((data) => {
                        res.json(data);
                }).catch((err) => {
                        res.json('连接数据库失败')
                });
});

//测试接口
UserCommentsRouter.post('/test', passport.authenticate("jwt", { session: false }), (req, res) => {
        console.log(req.body);
        res.json(['测试'])
})


module.exports = UserCommentsRouter;