num_str = "0⃣️ 1⃣️ 2⃣️ 3⃣️ 4⃣️ 5⃣️ 6⃣️ 7⃣️ 8⃣️ 9⃣️"
num_str_list = num_str.split(" ");
num_str_len = num_str_list.length;
page_list = getPageList();
len = page_list.length;
host_index = getSelectHostIndex();

function getOrderText(num) {
    let tmp_str = "" + num;
    let tmps = tmp_str.split("");
    let tmp_name_list = [];
    for (var j = 0; j < tmps.length; j++) {
        //java.log(`${j} :  ${num_str_len}`);
        tmp_name_list.push(num_str_list[parseInt(tmps[j]) % num_str_len]);
    }

    tmp_name = tmp_name_list.join("");
    return tmp_name;
}

host_index_txt = getOrderText(host_index);

function create_button(name, action, size) {
    if (!size || size <= 0) size = 0.39
    return {
        "name": name,
        "type": "button",
        "action": action,
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent": size
        }

    };
}

function create_toggle(name, action, size) {
    if (!size || size <= 0) size = 0.39
    return {
        name: name,
        viewName: `'${name}'`,
        type: "toggle",
        chars: ["🔳", "✅"],
        default: "🔳",
        action: action || "",
        style: {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent": size,
            "layout_justifySelf": "right"
        }
    };
}

function create_select(name, chars, default_value, action, size) {
    if (!size || size <= 0) size = 0.39
    return {
        name: name,
        viewName: `'${name}'`,
        type: "select",
        chars: chars,
        default: default_value || chars[0],
        action: action || "",
        style: {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent": size,
            "layout_justifySelf": "right"
        }
    };
}

function create_text(name) {
    return {
        name: name,
        type: "text",

    };
}

function get_test_time_color(num) {
    let color = "⚫";
    let t = num;
    if (t <= 0 || t >= 99999) {
        color = "⚫"
    } else if (t < 500) {
        color = "🟢"
    } else if (t < 1000) {
        color = "🟡"
    } else if (t < 5000) {
        color = "🟠"
    } else {
        color = "🔴"
    }
    return color;
}

function setHostItemList(list) {
    let api_testing_dict = getTestApiHostDict();
    //java.log("api_testing_dict:"+JSON.stringify(api_testing_dict))
    for (var i = 0; i < len; i++) {
        let tmp_host = String(page_list[i]).replace(/\/$/, "");
        let time = api_testing_dict[tmp_host];
        let time_txt = "";
        let no_head_tmp_host = tmp_host.replace(/https?:\/\//, "");
        if (time) {
            let color = get_test_time_color(time);
            if (time >= 99999) {
                time_txt = " " + color + "[不可用] " + no_head_tmp_host
            } else {
                time_txt = " " + color + `${time}ms ` + no_head_tmp_host
            }

        }

        item = create_button(`🔖${getOrderText(i)}${time_txt}🔖`, `A(${i})`, 1),
            item = create_button(`${getOrderText(i)}${time_txt}`, `A(${i})`, 1),
            list.push(item);
    }
}

list = [

    create_text("用户名/邮箱"),

    {
        "name": "密码",
        "type": "password"
    },
    create_button("🔺登　录🔺", "login(true)"),
    create_button("⚙️登 出⚙️ ", "D()"),
    create_button("显示密码🧾", "T()"),

    create_text("发布页"),

    create_button(" 更新域名 ⚙️", "update_host()"),
    create_toggle("代理图片"),
    create_toggle("代理网络"),
    create_select("浏览模式", ["默认", "简洁", "外部浏览器"], "默认"),


    create_button("⚙️ 签 到 ⚙️", "sigin()"),
    create_button("⚙️ 清除Cookie ⚙️", "removeCookie()"),

    create_button(`👁 当前 ${host_index_txt} 接口 👁`, "H()", 1),

    create_button("打开网站", "jump()"),
    create_button("测试延迟", "testHost()"),

]

setHostItemList(list);

JSON.stringify(list);