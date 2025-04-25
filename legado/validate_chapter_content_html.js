/**
 * 检验并获取章节内容,
 * @returns {*|string}
 */
function validate_chapter_content() {
    let txt = String(result)
    txt = txt.replace(/亲,点击进去,给个好[^\n<>]*漂亮的老婆哦!|手机站全新改版[^\n<>]*广告清新阅读！|最新网址[^\n<>]*|[(（]?本章完[)）]?|推荐.*新书[^\n<>]*|手机用户[^\n<>]*阅读体验。/g,"")
    if (txt.match(/正在(手打|获取|更新)中/)) {
        return ""
    }
    // 中文字符数统计
    let matches = txt.match(/[\u4e00-\u9fa5\u2000-\u3020\uff00-\uff60?!,]/g);
    let len = matches ? matches.length : 0;
    //java.log(JSON.stringify(matches))
    // 起点小说内容防盗
    if (1000 < len && len < 1400) {
        return ""
    }
    return txt;
}

// validate_chapter_content()