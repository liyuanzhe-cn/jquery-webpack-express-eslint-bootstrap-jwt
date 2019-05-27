require('../less/info.less');
const axios = require('./http');
const jwtDecode = require('jwt-decode');
const { searchToQuery, chineseLocalTime } = require('./utils');
const { logout, publishArticle, login, register, backToHome } = require('./common');
//
(() => {
    //导航条部分绑定事件
    logout();
    publishArticle();
    login();
    register();
    backToHome();

    //立即执行函数， 初始化登陆注册部分，登录状态判断
    +function isLogin() {
        var token = localStorage.getItem('lyz-blog-token');
        if (token) {
            var { exp, username } = jwtDecode(token);
            var currentTime = new Date().getTime();
            if (exp * 1000 < currentTime) {
                localStorage.removeItem('lyz-blog-token');
            } else {
                $('.login-and-register').remove();
                $('#registerModal').remove();
                $('#loginModal').remove();
                $('.nav-username').find('a').html(username);
                $(".nav-avatar").attr('src', 'http://localhost:5000/user/avatar/?avatar=' + jwtDecode(localStorage.getItem('lyz-blog-token')).avatar);
            }
        } else {
            $('.username-and-logout').remove();
        }
        // 显示导航栏
        $(".navigator").css('visibility', 'visible');
    }();


    // 获取个人信息
    (function () {
        var user_idObj = searchToQuery();
        var user_id = user_idObj.user_id;
        axios.get('/user/get-user-info/' + user_id)
            .then((res) => {
                console.log(res.data);
                var ele = res.data
                /* 数据样本
                avatar: "avatar\75d72dae9f78f2272ddc784314f9ed59.jpg"
                birthdate: "用户未填写"
                date: "2019-05-25T09:13:32.052Z"
                email: "999@999.com"
                gender: "male"
                identity: "admin"
                pass: "$2b$10$JPSN8VT8EzYCHxqKqOEt1OPCT1JB6IEwqg47ci5GM0hcFkJdGqrjK"
                realname: "99"
                user: "999"
                username: "999"
                wechat: "999"
                __v: 0
                _id: "5ce9073c0bc9881f54d70a49"
                */
                var html = `
                <div class="avatar">
                    <img src="${'http://localhost:5000/user/avatar/?avatar=' + ele.avatar}" alt="${ele.user}">
                    <div class="user">${ele.user}</div>
                    <div class="identity">站内身份：${ele.identity}</div>
                </div>
                <div class="info-detail">
                    <div class="base-info">
                        <div class="birthdate">出生日期：${ele.birthdate === "用户未填写" ? "用户未填写" : chineseLocalTime(ele.birthdate)}</div>
                        <div class="gender">性别：${ele.gender === 'male' ? "男" : "女"}</div>
                        <div class="realname">真实姓名：${ele.realname}</div>
                        <div>注册日期：${chineseLocalTime(ele.date)}</div>
                    </div>
                    <div class="social-info">
                        <div class="email">邮箱：${ele.email}</div>
                        <div class="wechat">微信：${ele.wechat}</div>
                    </div>
                </div>`;
                $('.client-info').html(html);

            }).catch((err) => {
                console.log(err);
            })
    })();

    //获取评论
    function getComments() {
        var user_idObj = searchToQuery();
        var user_id = user_idObj.user_id;
        axios.get('/usr-comments/get-allComments/' + user_id)
            .then((res) => {
                console.log(res.data);
                var ele = res.data
                /* 
                数据样本
                    [{
                    "identity": "client",
                    "like": 0,
                    "_id": "5ceada424a28b6248c2a0cf7",
                    "user": "777",
                    "user_id": "5ce9073c0bc9881f54d70a49",
                    "avatar": "avatar\\\\356fb1f16f7a5a1966ea60e1fddce462.jpg",
                    "contents": "这是一条测试评论",
                    "date": "2019-05-26T18:26:10.783Z",
                    "__v": 0
                    }]
               */
                var html = ``;
                ele.forEach((ele) => {
                    html += `
                            <div class="commentary-item">
                                <div class="commentary-user">
                                    <a href="${'/info.html?user_id=' + ele.publisher_id}">
                                        <img src="${'http://localhost:5000/user/avatar/?avatar=' + ele.avatar}" alt="${ele.user}">
                                    </a>
                                    <div class="commentary-username">${ele.user}</div>
                                    <div class="commentary-datae">${chineseLocalTime(ele.date)}</div>
                                </div>
                                <div class="conmentary-content">
                                    ${ele.contents}  
                                </div>
                            </div>`
                })
                $('.comments').empty().append(html);
            }).catch((err) => {
                console.log(err);
            })
    }
    getComments();

    //留言板发布按钮
    $('.publish-comments-to-user').on({
        'click': function () {
            // 给谁发表留言
            var user_idObj = searchToQuery();
            var user_id = user_idObj.user_id;
            // 获取自己的_id编号
            let token = localStorage.getItem('lyz-blog-token');

            if (token) {
                let { user, _id, avatar, identity } = jwtDecode(token);
                console.log(jwtDecode(token));
                // 
                if (!user) {
                    alert('未登陆用户不能发表评论');
                    return;
                }
                /**
                user, //评论者
                user_id, //被评论者的_id
                avatar, //头像
                identity, //身份
                contents
                 */
                var markupStr = $('#summernote-comments').summernote('code');
                const articledata = {
                    user: user,
                    publisher_id: _id,
                    user_id: user_id,
                    identity: identity,
                    avatar: avatar,
                    contents: markupStr
                }
                axios.post('/usr-comments/publish', articledata)
                    .then((res) => {
                        $('#summernote-comments').next().find('.note-editable').empty();
                        getComments();
                        console.log(res);
                    }).catch((err) => {
                        console.log(err);
                    })
            } else {
                console.log('状态： 未登录');
            }
        }
    })



})();