// 获取章节名编号
function get_chapter_name_index(__name) {
    //java.log(__name);
    __name = String(java.toNumChapter(__name));

    // java.log(__name);

    mm = __name.match(/^\s*第\s*([\d]+)\s*章/);
    if (mm) return parseInt(mm[1]);
    return -1;
}


//  修复章节，添加缺失章节，删除重复章节
function fix_add_chapter() {
    rs_list = result;
    new_list = [];
    if (rs_list.length < 2) {
        return rs_list;
    }


    item = rs_list[0];
    first_item_name = String(item.text);



    // 最大补章数目
    max_add_chapter_num = 5;
    pre_index = get_chapter_name_index(first_item_name);
    java.log(`pre_index ${pre_index}`);
    if (pre_index < 0) return rs_list;
    new_list.push(item);
    fix_list = [];

    // 1. 选排序好章节列表
    chapter_dic = {};
    item.chapter_index = pre_index
    chapter_dic[pre_index] = item;
    // 错误章节索引长度
    error_chapter_index_len = 10;
    for (var i = 1; i < rs_list.length; i++) {
        item = rs_list[i];
        name = item.text;
        chapter_index = get_chapter_name_index(name);
        item.chapter_index = chapter_index
        s_index = chapter_index;
        flag = (s_index - pre_index) > error_chapter_index_len
        if (s_index == -1 || flag) {
            s_index = pre_index + 0.01;
        }
        pre_index = s_index;
        chapter_dic[s_index] = item;
    }

    chapter_index_list = Object.keys(chapter_dic)

    chapter_index_list = chapter_index_list.sort((a, b) => a - b)


    // 过滤重复章节
    filter_repeat_chapter = true;
    chapter_name_dict = {};
    chapter_name_dict[item.text] = "";
    repeat_chapter_list = [];

    for (var i = 1; i < chapter_index_list.length; i++) {
        item_index = chapter_index_list[i];
        item = chapter_dic[item_index]
        name = item.text;
        if (filter_repeat_chapter &&
            chapter_name_dict.hasOwnProperty(name)) {
            repeat_chapter_list.push(name)
            continue;
        }

        chapter_name_dict[name] = "";
        // cur_index = get_chapter_name_index(item.text);
        cur_index = item.chapter_index;

        //java.log(cur_index);

        sub_len = cur_index - pre_index;

        //java.log(`${cur_index} ${sub_len}`);
        if (1 < sub_len && sub_len <= max_add_chapter_num) {
            for (var j = 1; j < sub_len; j++) {
                t_i = pre_index + j;
                tmp_name = `第${t_i}章`;
                tmp_data = java.base64Encode(tmp_name);

                href = `	data:;base64,${tmp_data},{"type":"fqpyc"}`
                new_list.push({
                    text: tmp_name,
                    href: href,
                    info: "",
                });
                fix_list.push(tmp_name);
            }
        }

        //if(cur_index>pre_index)
        pre_index = cur_index;

        new_list.push(item);
    }
    if (fix_list.length >= 0) {
        java.log(`
                补充缺失章节: ${(fix_list.length)} 章
                章节名: ${JSON.stringify(fix_list)}
                `)
    }
    if (repeat_chapter_list.length >= 0) {
        java.log(`
                重复章节: ${(repeat_chapter_list.length)} 章
                重复章节名: ${JSON.stringify(repeat_chapter_list)}
                `)
    }
    return new_list;
}

//fix_add_chapter()