/**
 *  通过 url js 执行 多线程
 *  返回值，必须用 __html 接收， 
 *  eg:  js_code=`__html=java.cacheFile('http://www.baidu.com')`
 */
function multi_thread_js_code(js_code_list) {

    if (!js_code_list || js_code_list.length < 1) return [];
    var n = Date.now();
    let s_key = java.md5Encode16(js_code_list.toString())
    let part = n + "_" + s_key;
    let all_thread_url_list = [];
    for (let resii = 0; resii < list_len; resii++) {
        let cache_key = part + "_" + resii;
        js_body = `
        	let __html='';
         ${js_code_list[resii]};
         cache.putMemory('${cache_key}',__html);
         `
        let s_data= JSON.stringify(js_body);
        s_data= s_data.replace(/^"|"$/g, '');
        s_data=js_body;
        let type = JSON.stringify({
            method: "head",
            js: s_data,
        });
        s_url = `http://www.baidu.com/favicon.ico,${type}`;
        //java.log(s_url)
        all_thread_url_list.push(s_url);
    }
    let rep_all = java.ajaxAll(all_thread_url_list);
    let rs_list = [];
    for (let resii = 0; resii < list_len; resii++) {
       let cache_key = part + "_" + resii;
        __html = cache.getFromMemory(cache_key);
        cache.deleteMemory(cache_key);
        rs_list.push(__html);
    }

    return rs_list;
}