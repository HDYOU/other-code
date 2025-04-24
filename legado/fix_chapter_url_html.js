next_chapter_url_rule = "id.linkNext@href"       //下一章规则
pre_chapter_url_rule = "id.linkPrev@href"        //上一章规则

/**
 *  修复目录链接
 * @returns {*}
 */
function fix_chapter_url() {

    all_list = result;

//java.log(JSON.stringify(result))
    let indexOf = baseUrl.indexOf("/", 9);
    indexOf = indexOf > 0 ? indexOf : baseUrl.length;
    let host = baseUrl.substring(0, indexOf);
    
    // 补目录
    
    len = all_list.length;
    next_chapter_url_find_list = {};
    pre_chapter_url_find_list = {};
    for (let i = 0; i < len; i++) {
        obj = all_list[i];
        href = obj.href || ""
        let flag = !href || href == "" || href.indexOf("java") > -1;
        if (!flag) continue;
        // 通过下一章获取这章链接
        if (i < len - 1) {
            next_chapter_url_find_list[i] = all_list[i + 1];
        } else {
            pre_chapter_url_find_list[i] = all_list[i + -1];
        }
    }

    function set_chapter_url(_url_find_list, _find_rule) {
        _keys = Object.keys(next_chapter_url_find_list)
        if (_keys.length == 0) {
            return ;
        }

        _values = Object.values(next_chapter_url_find_list)
        //java.log(JSON.stringify(_values))
        _url_list = []
        for (let i = 0; i < _values.length; i++) {
            tt = _values[i].href;
            if (tt.indexOf("/") == 0) {
                tt = host + tt;
            } else if (tt.toLowerCase().indexOf("http") == 0) {
                //tt = tt;
            } else {
                tt = baseUrl + tt;
            }
            _url_list.push(tt)
        }
        _all_data = java.ajaxAll(_url_list)
        for (let i = 0; i < _all_data.length; i++) {

            s_key = _keys[i]
            _s_data = _all_data[i].body();
            //java.log(_s_data)
            java.setContent(_s_data);
            tt = java.getString(_find_rule);
            //java.log(all_list[s_key].text + "\t" +tt)
            if (tt.indexOf("/") == 0) {
                tt = host + tt;
            } else if (tt.toLowerCase().indexOf("http") == 0) {
                //tt = tt;
            } else {
                tt = baseUrl + tt;
            }


            all_list[s_key].href = tt;
            //java.log(all_list[s_key].text + "\t" + tt)

        }

    }

//java.log("\n\n\n")
//java.log(JSON.stringify(next_chapter_url_find_list))

    set_chapter_url(next_chapter_url_find_list, pre_chapter_url_rule)
    set_chapter_url(pre_chapter_url_find_list, next_chapter_url_rule)


//java.log("\n\n\n" + JSON.stringify(all_list))
    return all_list
}