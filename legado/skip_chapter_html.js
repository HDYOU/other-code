//java.log(result)
////////////// ------------- 可以定义的变量 -------------
skip_chapter = true;                    // 是否跳过章节
text_relu = "a@text";                   // 章节名规则
url_relu = "a@href";                    // 章节url规则
info_relu = ""                          // 章节信息规则
check_len = 50;                         // 检测长度
is_skip_check_len_sort = false;          // 是否跳过章节检测，当目录长度小于检测长度
is_last_chapter_add_time = true;        // 是否最后一章名加时间信息

// 移除非章节
is_check_chapter_name = true;   // 是否移除非章节

// 自定义章节名过来正则
chapter_name_filter_regex=/.*请假.*|.*请.{0,3}天假.*|.*更新时间.*|.*被审[核]?了.*|.*晚点再发一章.*|.*月份中奖名单|.*月份抽奖名单|.*被屏蔽[了]?$|.*更新在.*点$|^今天.*更新$|.*晚.{0,3}更新.*|^单章通知$|^通知$|^紧急通知.*|.*[解放]出来了$/

////////////// --------------------------

function reverse_list(myArray){
 var temp;

for (var i = 0; i < myArray.length / 2; i++) {

    temp = myArray[i];

    myArray[i] = myArray[myArray.length - 1 - i];

    myArray[myArray.length - 1 - i] = temp;

}

return myArray

}

/**
 * 跳过章节主函数
 * @returns {[]|*}
 */
function skip_check_chapter() {

    let base_src = src;
    let text = result;
    java.setContent(text);

    // 章节名 list
    text_relu_reverse=false;
    if(text_relu.indexOf("-") == 0){
      text_relu=text_relu.substring(1)
      text_relu_reverse=true;
    }
    let name_list = java.getStringList(text_relu);
    if(text_relu_reverse) name_list=reverse_list(name_list)
    // java.log(JSON.stringify(name_list))

    // 章节url list
    url_relu_reverse=false;
    if(url_relu.indexOf("-") == 0){
      url_relu=url_relu.substring(1)
      url_relu_reverse=true;
    }
    let url_list = java.getStringList(url_relu);
    if(url_relu_reverse) url_list=reverse_list(url_list)
    //java.log(JSON.stringify(url_list))

    // 章节信息 list
    let info_list = []
    let has_info_list = false;
    info_relu_reverse=false;
    if(info_relu.indexOf("-") == 0){
      info_relu=info_relu.substring(1)
      info_relu_reverse=true;
    }
    if (!info_relu || info_relu.length != 0) {
        has_info_list = true
        if (!info_relu.match(/\/\/|@|\$\./)) {
            /// 章节详情信息直接给
            info_list = [info_relu];
        } else {
            info_list = java.getStringList(info_relu);
            if (!info_list) {
                info_list = []
                has_info_list = false;
            }
        }
      if(info_relu_reverse) info_list=reverse_list(info_list)
    }

    java.setContent(base_src);

    /**
     *  获取 list 某个
     *
     * */
    function get_list_item_or_last(__list, __index) {
        if (!__list || __list.length == 0) return ""
        let in_len = __list.length
        let s_in = __index;
        if (s_in < 0) s_in = 0
        if (s_in >= in_len - 1) s_in = in_len - 1
        return __list[s_in]
    }

    /**
     *  获取 某个章节信息
     * */
    function get_info(__index) {
        return get_list_item_or_last(info_list, __index);
    }

    // 输出
    //java.log(JSON.stringify(url_list))
    //java.log(JSON.stringify(name_list))

    let len = name_list.length;
    /// 是否跳过检测，当目录长度过短
    if (is_skip_check_len_sort && check_len >= len) return result;

    let indexOf = baseUrl.indexOf("/", 9);
    indexOf = indexOf > 0 ? indexOf : baseUrl.length;
    let host = baseUrl.substring(0, indexOf);

    len = url_list.length;
    let tt;
    for (let i = 0; i < len; i++) {
        tt = String(url_list[i]);

        if (tt.indexOf("/") == 0) {
            tt = host + tt;
        } else if (tt.toLowerCase().indexOf("http") == 0) {
            //tt = tt;
        } else {
            tt = baseUrl + tt;
        }
        url_list[i] = tt;
    }

    //	java.log(JSON.stringify(url_list))

    //  // 移除非章节
    if (is_check_chapter_name) {
        let new_name_list = [];
        len = name_list.length;

        let new_url_list = [];
        let remove_count = 0;
        let remove_name_list = [];
        let new_info_list = []
        let self_remove_name_list = [];
        let self_remove_count = 0;
        for (let i = 0; i < len; i++) {
            let s_t_name = String(name_list[i]);
            let t_url = url_list[i];

            let t_name = remove_no_num_chapter_name(s_t_name);
            

            //java.log(t_name)
            if (!t_name || t_name == "") {
                remove_name_list.push(s_t_name);
                remove_count++;
                continue;
            }
            
            if(chapter_name_filter(t_name))
            {
                self_remove_name_list.push(s_t_name);
                self_remove_count++;
                continue;
            }

            if (has_info_list) {
                new_info_list.push(get_info(i))
            }

            new_url_list.push(t_url);
            new_name_list.push(t_name);
        }
        url_list = new_url_list;
        name_list = new_name_list;
        
        flag= remove_count >0
        if(flag){
        java.log(`
        移除 可能非章节: ${(remove_count)} 章
        章节名: ${(JSON.stringify(remove_name_list))}
        `);
        }
        if(s