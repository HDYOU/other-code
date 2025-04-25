next_chapter_url_rule = "id.linkNext@href"       //下一章规则
pre_chapter_url_rule = "id.linkPrev@href"        //上一章规则
chapter_url_error_regex=/java/i

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
    
    let fix_count=0;
    let cache_count=0
    let save_count=0
    
    cache_key=`${book.origin}---${book.name}-${book.author}`
    sstr=cache.get(cache_key)||"{}"
    chapter_cache_dic=JSON.parse(sstr)
    
    
    // 补目录
    
    len = all_list.length;
    next_chapter_url_find_list = {};
    pre_chapter_url_find_list = {};
    for (let i = 0; i < len; i++) {
        obj = all_list[i];
        href = obj.href || ""
        let flag = !href || href == "" || href.match(chapter_url_error_regex);
        if (!flag) continue;
        // 缓存获取
        chapter_name=obj.text
        if (chapter_cache_dic.hasOwnProperty(chapter_name)) {
        
           obj.href=chapter_cache_dic[chapter_name]
        
            cache_count++;
            continue;
        }
        // 通过下一章获取这章链接
        if (i < len - 1) {
            next_chapter_url_find_list[i] = all_list[i + 1];
        } else {
            pre_chapter_url_find_list[i] = all_list[i + -1];
        }
    }

    function set_chapter_url(_url_find_list, _find_rule) {
        _keys = Object.keys(_url_find_list)
        if (_keys.length == 0) {
            return ;
        }

        _values = Object.values(_url_find_list)
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


      chapter_name=all_list[s_key].text
      chapter_cache_dic[chapter_name]=tt;
      save_count++;

            all_list[s_key].href = tt;
            //java.log(all_list[s_key].text + "\t" + tt)

        }

    }

//java.log("\n\n\n")
//java.log(JSON.stringify(next_chapter_url_find_list))
    start_time=new Date().getTime()
   set_chapter_url(next_chapter_url_find_list, pre_chapter_url_rule)
    set_chapter_url(pre_chapter_url_find_list, next_chapter_url_rule)
    end_time=new Date().getTime()
    fix_count=Object.keys(next_chapter_url_find_list).length+Object.keys(pre_chapter_url_find_list).length
    
    java.log(`
    修复目录 ${cache_key}
    修复目录:\t ${(fix_count +cache_count)} 个
    网络请求:  ${(fix_count )} 个
    使用缓存:  ${(cache_count)} 个
    花费时间:  ${(end_time-start_time)} ms
    `)
    
    if(save_count>0){
     save_txt=JSON.stringify(chapter_cache_dic)
     cache.put(cache_key, save_txt)
    
    }

//java.log("\n\n\n" + JSON.stringify(all_list))
    return all_list
}