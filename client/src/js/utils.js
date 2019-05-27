function searchToQuery(search) {
    search = search || window.location.search;
    var queryObj = {};
    if (search.indexOf('?') == 0) {
        search = search.substr(1);
    }
    var query = search.split('=')
    for (var i = 0; i < query.length; i += 2) {
        queryObj[query[i]] = query[++i]
    }
    return queryObj;
}


function chineseLocalTime(dateISO) {
    var date = new Date(dateISO);
    return (date.getFullYear() + '年 ') + ((date.getMonth() + 1) + '月') + ((date.getDate()) + '日')
}

//刷新
function reLoad() {
    setTimeout(() => {
        window.location.reload();
    }, 2000)

}

// 邮箱验证
function validateEmail(email) {
    var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    return reg.test(email);
}

module.exports = {
    searchToQuery,
    chineseLocalTime,
    reLoad,
    validateEmail,
}