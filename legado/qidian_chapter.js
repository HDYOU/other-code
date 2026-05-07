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
    //java.log("cache_qd_chapter:"+cache_qd_chapter)
    if (cache_qd_chapter && cache_qd_chapter != "") {
        try {
            qd_chapter = JSON.parse(cache_qd_chapter);
            if(qd_chapter && qd_chapter.length > 0) return qd_chapter
        } catch (e) {
            java.log(e)
        }
    }

    option={
      "headers":{
        "Cookie": java.getCookie("https://m.qidian.com/"),
        "Referer": "https://m.qidian.com/",
        "User-Agent":"Mozilla/5.0 (Linux; U; Android 13; zh-Hans-CN; PFJM10 Build/TP1A.220905.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.4896.58 Quark/6.13.6.581 Mobile Safari/537.36",
        "Accept-Language":"zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      }
    }
    tocUrl = `https://m.qidian.com/book/${qd_bookid}/catalog/,${JSON.stringify(option)}`;
    html = java.ajax(tocUrl);
    //java.log("qd html:\n"+html)
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
    if(chapter_list.length > 0) cache.put(cache_qd_chapter_key, JSON.stringify(chapter_list, cache_hour * 60*60));
    return chapter_list;
}