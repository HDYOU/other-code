// 过期天数
allow_day = 3
request_test_timeout = 8 * 1000  //请求超时 8秒
// 内容验证
request_test_match = ""
request_test_match = /韩国漫画|韩漫|漫畫/

//fby_url=""
//fby_url=fby_url+",{'webView': true}";
// 多发布页
fby_url_list = ["https://jmcmomic.github.io/go/304.html", "https://stevenyomi.github.io/source-domains/jmcomic.txt", "https://jmcomicltd.xyz"];
// 域名匹配 xpath 格式规则
xpath_relus = "//*";
// 域名匹配 xpath 格式规则
is_get_http_url = true;
// 域名是否 https
real_host_list = [];
// 测试域名的 uri
test_uri_path = "/";
// 域名的不包含的 字符串
exclude_domain_key_list = [".apk", "discord.gg", "t.me", "cdn-cgi", "gmail.com", "google", "github.com", "qq.com", "jm365", ".push", "gtag.js", ".css", "favicon.ico", "window.", "googletagmanager.com", "document.", "this."];

// 排除的域名
exclude_url_list = [];

//-->start
/**
 * 获取文本的可能为域名的字符串
 */
function get_http_url(txt) {
    var patt = /(http[s]?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/ig;
    __url_list = txt.match(patt);
    //java.log(JSON.stringify(__url_list))
    return __url_list || []
}

/**
 * 域名是否排除
 */
function is_exclude(part_host) {
    if (part_host == "") return true

    var patt = /^(http[s]?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}[\/]?$/i;

    if (!patt.test(part_host)) return true

    for (let _ii = 0; _ii < exclude_domain_key_list.length; _ii++) {
        let ext = exclude_domain_key_list[_ii]
        if (part_host.indexOf(ext) > -1) {
            return true
        }
    }

    if (exclude_url_list) {
        for (let _ii = 0; _ii < exclude_url_list.length; _ii++) {
            let ext = exclude_url_list[_ii]
            if (part_host.indexOf(ext) > -1) {
                return true
            }
        }
    }
    return false
}


bed_time = 99999999

/**
 * 获取不重复的域名列表
 */
function get_unique_domain_list(testing_host_list) {
    let tmp_url_dic = {}
    http_head = "http"
    if (is_get_http_url) http_head = "https"
    for (let ipp = 0; ipp < testing_host_list.length; ipp++) {
        let part_host = String(testing_host_list[ipp])
        part_host = part_host.substring(0, part_host.indexOf("/", 9))
        if (!part_host.startsWith("http")) part_host = String(http_head + "://" + part_host)
        if (!part_host.endsWith("/")) part_host = part_host + "/"
        if (is_exclude(part_host)) continue
        tmp_url_dic[part_host] = 1
    }
    return Object.keys(tmp_url_dic) || []
}

/**
 * 测试和获取最快域名地址
 * 
 */
function test_and_get_best_host(
    testing_host_list, test_part_url) {

    let test_host_list = get_unique_domain_list(testing_host_list)
    java.log("测试域名：\n\t" + JSON.stringify(test_host_list))

    // 设置测试的 url
    let test_url_list = []
    for (let test_i = 0; test_i < test_host_list.length; test_i++) {
        test_url_list.push(part_host + test_part_url)
    }

    // 测试服务
    let host = ""
    let cur_time = bed_time;
    java.log("\n host test ....: ")

    req_time_dic = {};
    thread_list = [];

    // 开始域名测试服务
    for (let resii = 0; resii < test_url_list.length; resii++) {
        let resq_test_url = test_url_list[resii]
        let tmp_host = test_host_list[resii]

        let thread = new Packages.java.lang.Thread(function () {
            try {
                let s_time = new Date().getTime();

                //conn =java.ajax(resq_test_url);

                resp = java.connect(tmp_host, {})
                //contentType = resp.contentType()
                statusCode = resp.code()
                conn = resp.body();

                if (statusCode < 200 || statusCode > 400) {
                    throw ("statusCode error:" + statusCode)
                }

                if (!conn) {
                    throw ("conn empty!")
                }

                java.log(tmp_host + "\t" + conn.slice(0, 100))

                // 内容验证
                test_match_flag = request_test_match
                    && request_test_match != ""
                    && !conn.match(request_test_match)
                if (test_match_flag) throw ("conn not match !")

                let __time = new Date().getTime() - s_time;

                // 超过30秒
                if (__time < 300 || __time > 30 * 1000) {
                    __time = bed_time;
                }
                req_time_dic[tmp_host] = __time
            } catch (e) {
                tt = 1
                req_time_dic[tmp_host] = bed_time;
                java.log(tmp_host + "\t" + e.message)
            }
        });

        thread.start();
        thread_list.push(thread);
    }

    handle_thread(thread_list);


    java.log("\n\n域名测试服务结束.\n")
    for (let tmp_host in req_time_dic) {
        let _time = req_time_dic[tmp_host]
        java.log("time: " + _time + "ms\t host: " + tmp_host)
        if (_time < cur_time && _time > 100) {
            cur_time = _time
            host = tmp_host
        }
    }

    if (host && host != "") {
        java.log("the best host: " + host + "\t cos time: " + cur_time + "ms")
    } else {
        java.log("not found available host !!!!!")
    }

    return host
}

/**
 * 多线程并发请求处理
 */
function handle_thread(thread_list) {
    for (let resii = 0; resii < thread_list.length; resii++) {
        try {
            let promise = thread_list[resii];
            //promise.start();
            promise.join(request_test_timeout);
            promise.interrupt();
        } catch (e) {
            tt = 1
            //java.log(e.message)
        }

    }
}

/**
 *  解析发布页
 * @param {*} html_dict 发布页的html
 * @returns 域名列表
 */
function handle_pub_html_list(html_dict) {
    html = ""
    for (let t_key in html_dict) {
        if (Object.hasOwnProperty.call(html_dict, t_key)) {
            let element = html_dict[t_key];
            html += element
        }
    }
    java.log(html)
    doc = org.seimicrawler.xpath.JXDocument.create(html)
    nodes = doc.selN(xpath_relus);
    len = nodes.length

    tmp_url_dic = {}

    for (let i = 0; i < len; i++) {
        node = nodes[i];
        //java.log(node)
        tt = node.toString();
        if (is_get_http_url) {
            _tmp_list = get_http_url(tt);
            _tmp_list.map(_uu => tmp_url_dic[_uu] = 1);
        } else {
            //url_list.push(tt);
            tmp_url_dic[tt] = 1
        }
    }

    return Object.keys(tmp_url_dic) || [];
}

/**
 * 获取可用的域名
 * @returns 域名 eg; https://www.baidu.com/
 */
function get_domain() {

    // 主要处理逻辑
    base_host_key = "base_host"
    base_host = java.get(base_host_key)
    if (base_host != "") {
        return base_host;
    }
    let variable = source.getVariable();
    if (!variable || variable == "") variable = "{}";
    java.log("variable:" + variable)
    let hosts_dict = JSON.parse(variable);
    if (hosts_dict) {
        exclude_url_list = hosts_dict.exclude_url_list || exclude_url_list;

        let flag = hosts_dict.hasOwnProperty("base_host")
            && hosts_dict.hasOwnProperty("timestamp")
        //java.log("flag:" + flag)
        if (flag) {
            let t_timestamp = hosts_dict["timestamp"];
            let cur_time = new Date().getTime();
            let __end_time = cur_time - allow_day * 24 * 60 * 60 * 1000
            java.log(__end_time + "<" + t_timestamp)
            // 过期
            if (__end_time < t_timestamp) {
                base_host = hosts_dict[base_host_key];
                java.put(base_host_key, base_host)

                return base_host;
            }
        }
    }


    // 获取可用URL 列表
    function get_url_list() {

        //  1.直接给出域名列，不用解析发布页，直接返回
        if (real_host_list && real_host_list.length > 0) {
            return get_unique_domain_list(real_host_list)
        }

        //  2.解析发布页
        fai_thread_list = [];
        // 接收请求内容
        html_dict = {}
        java.log("查找可用的域名 ......")
        // 多线程请求
        for (let resii = 0; resii < fby_url_list.length; resii++) {
            let resq_test_url = fby_url_list[resii]
            let thread = new Packages.java.lang.Thread(function () {
                try {
                    let s_time = new Date().getTime();
                    conn = java.ajax(resq_test_url);
                    //if (conn) html += conn
                    html_dict[resq_test_url] = conn
                    let e_time = new Date().getTime();
                    let _time = e_time - s_time;
                    java.log("time: " + _time + "\t host: " + resq_test_url)
                } catch (e) {
                    tt = 1
                    java.log(resq_test_url + "\t" + e.message)

                }
            });
            thread.start();
            fai_thread_list.push(thread);
        }

        handle_thread(fai_thread_list);

        // 解析
        return handle_pub_html_list(html_dict)
    }


    url_list = get_url_list();

    java.log(JSON.stringify(url_list))

    domain_host = test_and_get_best_host(url_list, test_uri_path);

    exclude_url_dic = {}
    if (exclude_url_list) {
        for (let _ii = 0; _ii < exclude_url_list.length; _ii++) {
            let ext = exclude_url_list[_ii]
            exclude_url_dic[ext] = 1;
        }
        exclude_url_list = Object.keys(exclude_url_dic) || [];
    }

    hosts_dict["base_host"] = domain_host;
    hosts_dict["timestamp"] = new Date().getTime();
    hosts_dict["exclude_url_list"] = exclude_url_list
    // let save = {
    // "base_host": domain_host,
    // "timestamp": new Date().getTime(),
    // "exclude_url_list": exclude_url_list
    // }
    save = hosts_dict
    let txt = JSON.stringify(save)
    if (domain_host && domain_host != "") source.setVariable(txt)

    return domain_host;
}