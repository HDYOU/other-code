eval(String(java.importScript('https://ghfast.top/https://raw.githubusercontent.com/HDYOU/other-code/main/legado/get_domain_by_pub_v2.js')))

request_test_match = host_test_content_match;
test_host_time_min = 0
test_host_time_max = 30 * 1000


function tmp_proxy_url(url) {
    tmp_url = proxy_url(url);
    return tmp_url;
}

function saveCookieToHeader(){
   c = cookie.getCookie(tmp_proxy_url(getUrl()));
   if(!c || c == ""){
      c = cookie.getCookie(getUrl());
   }
   source.putLoginHeader(c);
}

function login(b) {
    if (b == undefined) return true;
    info = result
    so = getUrl();
    pw = info.密码;
    user = info['用户名/邮箱'];

    try {


        let login_html_url = so + "member.php?mod=logging&action=login&mobile=date";

        let html = java.ajax(tmp_proxy_url(login_html_url));
        
        mm = String(html).match(/欢迎您回来，(.*?) (.*?)，现在将转入登录前页面/);
        // java.toast(mm);
        if (mm) {
            java.log(mm);
            java.toast(`\n${mm[1]} ${mm[2]}` + ' \n登录成功');
            saveCookieToHeader();
            return
        }
         
        

        // java.log(html);
        doc = org.jsoup.Jsoup.parse(html)
        eles = doc.select("input");
        param_list = [];
        ex_param_name_dict = {
            "username": 1,
            "password": 1,
        }
        for (var i = 0; i < eles.length; i++) {
            let ele = eles[i];
            let tmp_name = ele.attr("name");
            let tmp_value = ele.attr("value");
            if (ex_param_name_dict[tmp_name] == 1) continue;
            param_list.push(`${tmp_name}=${tmp_value}`)
        }
        param_list.push("username=" + user)
        param_list.push("password=" + pw)
        java.log(JSON.stringify(param_list))

        login_url = doc.select('form[id="loginform"]')[0].attr("action")
        login_url = so + login_url;

        // 验证码
        mm = String(html).match(/id="seccode_(.+?)"/);
        java.log(JSON.stringify(mm))
        if (mm) {
            idhash = mm[1];
            verify_code_url = so + `misc.php?mod=seccode&mobile=2&update=47445&idhash=${idhash}` + "," + JSON.stringify({
                headers: {
                    "Referer": so
                }
            })
            tmp_url = tmp_proxy_url(verify_code_url)
            code = orcImageUrl_V2(tmp_url)
            if (code == "") {
                java.toast("自动识别验证码失败!")
                code = java.getVerificationCode(tmp_url)
            }
            // 验证码
            param_list.push("seccodeverify=" + code)
        }

        body = param_list.join("&");

        post = JSON.stringify({
            "body": String(body),
            "method": "POST"
        })
        url = login_url + "," + post
        html = java.ajax(tmp_proxy_url(url))
        java.log(html)
        java.toast(html)
        mm = String(html).match(/欢迎您回来，(.*?) (.*?)，现在将转入登录前页面/);
        java.toast(mm);
        if (mm) {
            java.log(mm);
            java.toast(`\n${mm[1]} ${mm[2]}` + ' \n登录成功');
        }
        saveCookieToHeader()
    } catch (err) {
        java.log("登录失败! \n" + err);
        java.toast("登录失败! \n" + err);
    }
}

function D() {
    try {
        java.ajax(tmp_proxy_url(getUrl() + 'member.php?mod=logging&action=logout&formhash=6fcd045e&mobile=2'));
    } catch (err) {
        java.log(err)
    }

    //输出日志，备用
    java.log('\n用户名/邮箱：' + result['用户名/邮箱'] + '\n密码：' + result['密码']);
    cookie.removeCookie(getUrl());
    cookie.removeCookie(tmp_proxy_url(getUrl()))
    source.removeLoginHeader();
    result['用户名/邮箱'] = result['密码'] = '';
    source.putLoginInfo(JSON.stringify(result));
    cache.deleteMemory('getUrl()');
    java.toast('登出成功')
}

function T() {
    java.toast('密码：' + result.密码)
}

function O() {
    java.toast("这个按钮是用来看的(((o(*ﾟ▽ﾟ*)o)))")
}

function M() {
    java.startBrowser('http://ged520.yesui.me/', '发布页')
}

function A(x) {

    v = putInfo("select_url_index", parseInt(x) || 0);
    getUrl();
    java.toast('成功设置接口【' + x + '】' + ' \n' + getUrl());

    refreshUI();

    let f = java.importScript('https://ghfast.top/https://raw.githubusercontent.com/HDYOU/other-code/main/legado/get_domain_by_pub_v2.js');
    eval(String(f))
    request_test_match = host_test_content_match;
    test_host_time_min = 0
    test_host_time_max = 30 * 1000

    so = getUrl();
    tmp_host = String(so).replace(/\/$/, "");
    s_tmp_host = tmp_proxy_url(tmp_host + "/") + "";
    part_url = s_tmp_host.substring(s_tmp_host.indexOf("/", 9))

    tmp_api_testing_dict = test_host([s_tmp_host], part_url);

    t = 99999;
    for (var key in tmp_api_testing_dict) {
        t = tmp_api_testing_dict[key];
    }
    time = t / 1000 + 's';

    let logTime = '【' + getUrl() + '】\n┋┋\n' + '解析时间：' + time;
    if (t > 5000) {
        java.longToast('【访问失败提示】\n' + '┏┅━┅━┅━┅━┅┅━┅━┅┓\n┋┋\n' + logTime + '\n┋┋\n♣️源站已失效(可能被墙)♣️\n┋┋\n请更新网址/切换源站/切换网络环境\n┋┋' + '\n┗┅━┅━┅━┅━┅┅━┅━┅┛');
    } else if (t < 1000) {
        java.longToast('【网络环境优良】\n' + '┏┅━┅━┅━┅━┅┅━┅━┅┓\n┋┋\n' + logTime + '\n┋┋\n❤️延迟低，推荐使用此站❤️\n┋┋\n网络环境优良，请继续保持状态\n┋┋' + '\n┗┅━┅━┅━┅━┅┅━┅━┅┛');
    } else if (t >= 1000 && t < 2000) {
        java.longToast('【网络环境一般】\n' + '┏┅━┅━┅━┅━┅┅━┅━┅┓\n┋┋\n' + logTime + '\n┋┋\n♦️延迟一般，勉强可使用♦️\n┋┋\n请切换其他源站或切换网络环境\n┋┋' + '\n┗┅━┅━┅━┅━┅┅━┅━┅┛');
    } else if (t >= 2000 && t < 5000) {
        java.longToast('【网络环境堪忧】\n' + '┏┅━┅━┅━┅━┅┅━┅━┅┓\n┋┋\n' + logTime + '\n┋┋\n♠延迟过高，不建议使用♠\n┋┋\n请切换其他源站或切换网络环境\n┋┋' + '\n┗┅━┅━┅━┅━┅┅━┅━┅┛');
    }

    try {
        let api_testing_dict = getTestApiHostDict();
        for (var key in tmp_api_testing_dict) {
            api_testing_dict[tmp_host] = tmp_api_testing_dict[key];
        }
        putInfo(api_testing_dict_key, api_testing_dict || {});
        refreshUI();
    } catch (e) {
        java.toast(e)
    }

}

function K() {
    //eval(String(java.base64Decode(fb)));
    java.toast('\n该功能暂时关闭')
}

function H() {

    x = getInfo("select_url_index") || 0;
    java.toast('当前接口:' + '【' + x + '】' + '\n' + getUrl())
}

function refreshUI() {
    try {
        java.reLoginView();
    } catch (_) {}
}

function update_host() {
    try {
        info = result
        so = getUrl();
        pub_addr = info.发布页;
        if (pub_addr == null || pub_addr == "") {
            pub_addr = fabu_url;
        }
        if (pub_addr == null || pub_addr == "") {
            msg = "发布页没有设置"
            java.toast(msg)
            java.log(mag)
            return
        }

        // 换行
        splits = pub_addr.split("\n");
        pub_addr_list = [];
        for (var i = 0; i < splits.length; i++) {
            let tmp_url = String(splits[i]).trim();
            if (tmp_url && tmp_url != "") {
                pub_addr_list.push(tmp_proxy_url(tmp_url));
            }
        }

        if (!pub_addr_list) {
            msg = "发布页没有设置"
            java.toast(msg)
            java.log(mag)
            return
        }


        find_url = "";
        find_url_list = [];
        api_test_time_dic = {};
        //resp=null;

        fby_url_list = pub_addr_list;

        url_list = []
        // 不是图片
        if (!fabu_url_is_image) {
            url_list = get_url_list_by_fabu(fby_url_list);
        } else {
            let f = java.importScript("https://ghfast.top/https://raw.githubusercontent.com/HDYOU/other-code/main/legado/proxy_url.js");
            eval(String(f))

            tmp_proxy_func_list = [
                proxy_npee,
                proxy_doget,
                proxy_moonchan
            ]


            find_url = "";
            all_txt = "";
            for (var i = 0; i < fby_url_list.length; i++) {
                let tmp_url = fby_url_list[i];
                try {
                    find_url = orcImageUrl_V2(tmp_url) + "";
                    all_txt = all_txt + "\n\n" + find_url;
                } catch (err) {
                    java.toast(err)
                }

            }

            url_list = handle_pub_html_list({
                "1": all_txt
            });

        }


        let test_host_list = get_unique_domain_list(url_list)
        java.log("测试域名：\n\t" + JSON.stringify(test_host_list))

        if (!test_host_list || test_host_list.length < 1) {
            java.longToast("查找失败, \n无法在发布页查找到域名。");
            return;
        }

        // 设置测试的 url
        let test_url_list = []
        for (let test_i = 0; test_i < test_host_list.length; test_i++) {
            test_url_list.push(tmp_proxy_url(test_host_list[test_i]))
        }
        let req_time_dic = test_url_func(test_url_list, test_host_list);

        // 测试服务
        bed_time = 99999;
        for (let tmp_host in req_time_dic) {
            let _time = req_time_dic[tmp_host];
            if (_time > 0 && _time < bed_time) {
                find_url_list.push(tmp_host + "/");
                api_test_time_dic[tmp_host] = _time;
            }
        }

        if (!find_url_list || find_url_list.length < 1) {
            java.longToast("查找失败, \n无法在发布页查找到域名。");
            return;
        }
        java.toast("域名:" + JSON.stringify(find_url_list));
        putInfo("page_list", find_url_list);
        putInfo(api_testing_dict_key, api_test_time_dic);

        refreshUI();
    } catch (err) {
        java.log(err)
        java.toast(err)
    }
}

function jump() {
    cookie.setCookie(getUrl(), source.getLoginHeader())
    java.startBrowser(getUrl(), source.sourceName);
}

// 测试延迟
function testHost() {

    try {
        // 设置测试的 url
        let test_url_list = []
        let page_list=get_unique_domain_list(getPageList());
        let test_host_list=[]
        for (let test_i = 0; test_i < page_list.length; test_i++) {
            let url = page_list[test_i];
            test_url_list.push(tmp_proxy_url(url))
            test_host_list.push(url.replace(/\/$/, ""))
        }
        java.toast(JSON.stringify((test_url_list)));
        let tmp_api_testing_dict = test_url_func(test_url_list, test_host_list);
        putInfo(api_testing_dict_key, tmp_api_testing_dict);
        refreshUI();
    } catch (e) {
        java.toast(e)
    }
    // java.toast("test .....2222")
   // java.toast(JSON.stringify((api_testing_dict)));
    // testApiHost();
    
}

// 签到
function sigin() {
    so = getUrl()
    url = so + "index.php?mobile=2"
    txt = java.ajax(tmp_proxy_url(url));
    mm = String(txt).match(/formhash=([^"&']+)/)
    if (!mm) {
        java.toast("formhash 查找失败!")
        return
    }
    formhash = mm[1];
    url = so + `plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=${formhash}`
    txt = java.ajax(tmp_proxy_url(url));
    // 答题
    mm = String(txt).match(/ATA\[(.*?)\]/)
    if (mm && mm[1].length < 20) {
        java.toast("签到:" + mm[1])
        return
    }
    mm = String(txt).match(/签到验证：([^=]+)=/)
    if (!mm) {
        java.toast("答题查找失败!")
        return
    }
    qqq = mm[1];
    answer = "";
    eval(`answer=${qqq}`);

    // 签到
    url = so + `plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=${formhash}&mathverify_answer=${answer}&inajax=1&ajaxtarget=signBtn`
    let txt = java.ajax(tmp_proxy_url(url));
    mm = []
    mm = String(txt).match(/ATA\[(.*?)\]/)
    if (mm && mm[1].length < 20) {
        java.toast("签到:" + mm[1])
        return
    } else {
        java.toast("签到失败！")
    }
}

function removeCookie() {
    so = getUrl();
    cookie.removeCookie(so);
    cookie.removeCookie(tmp_proxy_url(so))
    java.toast('清除Cookie成功');
}