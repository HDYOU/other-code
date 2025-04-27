chapter_rule = ".panel-chapterlist.0@dd@a";
next_chapter_url_rule = "option!0@value";


rs = ""

let indexOf = baseUrl.indexOf("/", 9);
indexOf = indexOf > 0 ? indexOf : baseUrl.length;
let host = baseUrl.substring(0, indexOf);

let all_chapter_url_dic = {};
all_chapter_url_dic[baseUrl]="";

/**
 *  分页目录获取
 * @param _data 网页内容
 * @param _next_chapter_url_list 下一页目录
 * @returns {string|string|*} 目录内容
 */
function get_multiple_chapter_pages(_data, _next_chapter_url_list) {
    java.setContent(_data)
    rs = rs + "\n" + java.getString(chapter_rule + "@html");
    //java.log(rs)
    if (!_next_chapter_url_list || _next_chapter_url_list.length == 0) return rs;
    let tmp_next_chapter_url_list = [];
    for (let i = 0; i < _next_chapter_url_list.length; i++) {
        let tt = String(_next_chapter_url_list[i]);
        if (tt.indexOf("/") == 0) {
            tt = host + tt;
        } else if (tt.toLowerCase().indexOf("http") == 0) {
            //tt = tt;
        } else {
            tt = baseUrl + tt;
        }
        let flag = all_chapter_url_dic.hasOwnProperty(tt);
        if (flag) continue;
        _next_chapter_url_list[i] = tt;
        all_chapter_url_dic[tt] = "";
        tmp_next_chapter_url_list.push(tt);
    }
    let all_data_list = java.ajaxAll(tmp_next_chapter_url_list);
    let len = all_data_list.length;
    if (len > 1) {

        for (let i = 0; i < all_data_list.length; i++) {
            let s_data = all_data_list[i].body();
            get_multiple_chapter_pages(s_data, [])
        }

    } else {
        let s_data = String(all_data_list[0]);
        java.setContent(s_data)
        let s_next_chapter_url_list = java.getStringList(next_chapter_url_rule);
        get_multiple_chapter_pages(s_data, s_next_chapter_url_list)
    }
    return rs;
}


/**
 *  获取合并的目录内容
 */
function get_combine_chapter_page() {
    next_chapter_url_list = java.getStringList(next_chapter_url_rule);
    return get_multiple_chapter_pages(result, next_chapter_url_list)
}

// get_combine_chapter_page
