// 获取起点章节目录
function get_qd_chapter_list() {
    cache_qd_bookid_key = `qidian_bookid_${book.name}_${book.author}`;
    qd_bookid = cache.get(cache_qd_bookid_key);
    //java.log("cache_qd_bookid_key:" + cache_qd_bookid_key);
    if (!qd_bookid || qd_bookid == "") return [];
    return get_qd_chapter_list_by_bookid(qd_bookid);
}

function get_qd_chapter_list_by_bookid(qd_bookid) {
    cache_qd_chapter_key = `qidian_chapter_${qd_bookid}`;
    cache_qd_chapter = cache.get(cache_qd_chapter_key);
    if (cache_qd_chapter && cache_qd_chapter != "") {
        try {
            return JSON.parse(cache_qd_chapter);
        } catch (e) {
            java.log(e)
        }
    }

    tocUrl = `https://m.qidian.com/book/${qd_bookid}/catalog/`;
    html = java.ajax(tocUrl);
    java.setContent(html, tocUrl);
    eles = java.getElements(".y-list__item@a,._chapterBar_fps9g_592");
    //java.log("eles:"+JSON.stringify(eles));
    chapter_list = [];
    for (var i = 0; i < eles.length; i++) {
        ele = eles[i];
        text = ele.text();
        isVip = String(text).match(/ 免费$/) ? false : true;
        href = ele.attr("href");

        isVolume = href && href != "" ? false : true;
        isVip = !isVolume && isVip;

        alt = String(ele.attr("alt"));
        time = (alt.match(/首发时间: (.*)章节字数/) || ["", ""])[1];
        word = (alt.match(/(字数.*?\d+)/) || ["", ""])[1];
        info = isVolume ? "" : time + " " + word;

        if (!isVolume) {
            text = ele.select("h2").text();
        }

        item = {
            text: text,
            href: href,
            info: info,
            isVip: isVip,
            isVolume: isVolume,
        };
        chapter_list.push(item);
    }

    cache_hour = 12; // 缓存12小时
    cache.put(cache_qd_chapter_key, JSON.stringify(chapter_list, cache_hour * 60*60));
    return chapter_list;
}