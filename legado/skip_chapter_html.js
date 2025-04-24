//java.log(result)
////////////// ------------- 可以定义的变量 -------------
skip_chapter = true;            // 是否跳过章节
text_relu = "a@text";           // 章节名规则
url_relu = "a@href";            // 章节url规则
info_relu = ""                  // 章节信息规则
check_len = 50;                 // 检测长度
is_skip_check_len_sort = true;  // 是否跳过章节检测，当目录长度小于检测长度

// 移除非章节
is_check_chapter_name = true;   // 是否移除非章节
////////////// --------------------------

/**
 * 跳过章节主函数
 * @returns {[]|*}
 */
function skip_check_chapter() {

    let base_src = src;
    let text = result;
    java.setContent(text);

    // 章节名 list
    let name_list = java.getStringList(text_relu);
    // java.log(JSON.stringify(name_list))

    // 章节url list
    let url_list = java.getStringList(url_relu);

    // 章节信息 list
    let info_list = []
    let has_info_list = false;
    if (!info_relu || info_relu.length !== 0) {
        has_info_list = true
        if (!info_relu.match(/\/\/|@/)) {
            /// 章节详情信息直接给
            info_list = [info_relu];
        } else {
            info_list = java.getStringList(info_relu);
            if (!info_list) {
                info_list = []
                has_info_list = false;
            }
        }
    }

    java.setContent(base_src);

    /**
     *  获取 list 某个
     *
     * */
    function get_list_item_or_last(__list, __index) {
        if (!__list || __list.length === 0) return ""
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

        if (tt.indexOf("/") === 0) {
            tt = host + tt;
        } else if (tt.toLowerCase().indexOf("http") === 0) {
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
        for (let i = 0; i < len; i++) {
            let s_t_name = String(name_list[i]);
            let t_url = url_list[i];

            let t_name = remove_no_num_chapter_name(s_t_name);

            //java.log(t_name)
            if (!t_name || t_name === "") {
                remove_name_list.push(s_t_name);
                remove_count++;
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
        java.log("移除 可能非章节:" + (remove_count) + " 章");
        java.log("移除 可能非章节名: " + (JSON.stringify(remove_name_list)));

        info_list = new_info_list;
    }


    // let header = {}

    function getImageUrl(image_index) {
        return get_list_item_or_last(url_list, image_index);
    }

    function find(base, step) {
        let start, end, mid;
        start = base;
        end = start + step;
        let rs_end = base + step;

        let stop = 0 - step - 1
        while (!isAllow([end, start]) && start > stop) {
            end = start;
            start = start - step;
            if (end < 0) {
                end = 0
            }
        }

        if (end < 0 || start <= stop) {
            // 保留一章，方便验证
            return 0;
        }

        if (end === rs_end) {
            return end
        }


        start = end;
        end = end + step;
        if (end >= len) {
            end = len - 1;
        }

        // maxEnd = end;
        while (end - start > 1) {
            mid = parseInt((end + start) / 2);
            let ss_list = [mid, start, end, parseInt((end + mid) / 2), parseInt((mid + start) / 2)];


            if (isAllow(ss_list)) {
                start = mid;
            } else {
                end = mid;
            }
        }
        return start;
    }

    var count = 0;

    dic = {}

    function isAllow(_t_index_list) {

        count = count + 1

        let _t_len = _t_index_list.length
        if (_t_len === 0) return false;

        let _first = _t_index_list[0];
        if (dic.hasOwnProperty(_first)) {
            return dic[_first];
        }

        let _url_list = [];
        let _new_index_list = [];
        for (let _y = 0; _y < _t_len; _y++) {
            let tmp_index = _t_index_list[_y]
            if (dic.hasOwnProperty(tmp_index)) {
                continue;
            }
            _new_index_list.push(tmp_index)
            _url_list.push(getImageUrl(tmp_index))
        }

        java.log(JSON.stringify(_t_index_list))
        java.log(JSON.stringify(_url_list))
        let resq_list = java.ajaxAll(_url_list);

        for (let resii = 0; resii < resq_list.length; resii++) {
            let tmp_index = _new_index_list[resii];
            try {

                let resq = resq_list[resii]
                if (!resq) {
                    dic[tmp_index] = false;
                    continue;
                }
                let __html = resq.body();
                java.setContent(__html);

                let _data = java.getString(source.ruleContent.content);
                //java.log(_data.slice(0,20));
                //java.log(_data)
                let _is_f = !_data || _data === ""
                //java.log(_is_f);
                dic[tmp_index] = !_is_f;

            } catch (e) {
                java.log(e.message)
                dic[tmp_index] = false;

            }


        }

        return dic[_first] || false;


    }

    let find_index = url_list.length - 1;
    if (skip_chapter) {
        let real_check_len = check_len > url_list.length ? url_list.length : check_len;
        let find_start_index = url_list.length - check_len - 1;
        find_start_index = find_start_index > 0 ? find_start_index : 0;
        let start_time = new Date().getTime()
        find_index = find(find_start_index, real_check_len)
        let end_time = new Date().getTime()

        java.log("time:" + (end_time - start_time) + " ms")
        java.log("count:" + "查找 " + (count) + " 次")
        java.log("跳过:" + (url_list.length - find_index - 1) + " 章");
        java.log("find_index:" + find_index);
        java.log(name_list[find_index])
        java.log(url_list[find_index])

    }

    // source.getVariable()

    let cc_list = []
    let _start_index = 0
    for (i = _start_index; i <= find_index; i++) {
        let name = name_list[i];
        let url = url_list[i];
        let obj = {
            "text": name, "href": url
        };
        if (has_info_list) {
            obj["info"] = get_info(i)
        }
        //JSON.stringify()
        cc_list.push(obj)
    }
    java.setContent(base_src);
    return cc_list;

}


/**
 * 移除非章节
 * @param __txt 章节名
 * @returns {*|string} 字符串 格式化的章节名
 */
function remove_no_num_chapter_name(__txt) {

    if (!is_check_chapter_name) return __txt;

    if (!__txt || __txt === "") return __txt;
    if (__txt.match(/[前序绪叙引]言|楔子|序/)) return __txt;

    m = __txt.match(/^([^\d〇零二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟第章番外])+$|.*520快乐.*/)

    if (m) {
        //java.log(JSON.stringify(m))
        return "";
    }

    if (__txt.match(/^([\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟])+更.*|^晚一会.*/)) {
        g = 1
        return "";
    }
    //java.log(JSON.stringify(__txt))
    __txt = String(__txt).replace(/正文卷.|正文.|VIP卷.|默认卷.|卷_|VIP章节.|免费章节.|章节目录.|最新章节.|[(（【][\D]*?[求更票谢乐发订合补加架字修Kk].*?[】）)]|[(（]精校[）)]/, "");
    //java.log(JSON.stringify(__txt))
    return __txt;
}