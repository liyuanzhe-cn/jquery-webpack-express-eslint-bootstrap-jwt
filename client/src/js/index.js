require('../less/index.less');
require('../css/Cooldog.css');
const axios = require('./http');
const picsSlider = require('./picsSlider');
const { chineseLocalTime } = require('./utils');
const { logout, publishArticle, login, register, initSummerNoteNav, isLogin } = require('./common');

(() => {
    isLogin();
    logout();
    publishArticle();
    login();
    register();
    initSummerNoteNav();


    // 获取文章的页面
    (function () {
        axios.get('/api/article/get-articles')
            .then((res) => {
                /**
                    articleContent: "222"
                    articleName: "111"
                    avatar: "avatar\\356fb1f16f7a5a1966ea60e1fddce462.jpg"
                    date: "2019-05-25T06:36:01.569Z"
                    email: "777@777.com"
                    identity: "true"
                    user: "777"
                    watchTimes: 0
                    __v: 0
                    _id: "5ce8e25120517f3a68a5b060"
                 **/
                console.log(res.data);
                var node = ``;
                res.data.reverse().forEach((ele) => {
                    var chineseDate = chineseLocalTime(ele.date);
                    node += ` 
                    <tr class="text-info-table-row">
                        <td><a target="_blank" href="/article.html?_id=${ele._id}">${ele.articleTitle}</a></td>
                        <td class="publish-author"><a target="_blank" href="/info.html?user_id=${ele.user_id}">${ele.user}</a></td>
                        <td class="publish-date">${chineseDate}</td>
                        <td>${ele.watchTimes}</td>
                    </tr>`;
                });
                $('.table-info').append(node);

            }).catch((err) => {
                console.log(err);
            })
    }());

    //轮播图执行
    $(picsSlider);

})();




