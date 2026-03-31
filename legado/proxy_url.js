function proxy_deno(url) {
    return "https://pure-bat-46.deno.dev/" + url;
}

function proxy_moonchan(url) {

    var index = url.indexOf("/", 9);
    var host = url.substring(0, index);
    var s_host = host.substring(host.indexOf("//") + 2);
    var part = url.substring(index);
    var other = `proxy_host=${s_host}&proxy_referer=https%3A%2F%2F${s_host}%2F`;
    if (part.indexOf("?") > 0) {
        other = "&" + other;
    } else {
        other = "?" + other;
    }
    part = part + other;
    return "https://proxy.moonchan.xyz" + part;
}

// 不可用
function proxy_66a(url) {
    return "https://99z.top/" + url;
    // return "https://get.66a.vip/" + url;
}


function proxy_npee(url) {
    return "https://down.npee.cn/?" + url;
}

function proxy_no(url) {
    return url;
}

function proxy_doget(url) {
    let tBaseUrl = "https://doget-api.oopscloud.xyz/"
    let encodeUrl = java.encodeURI(url);
    var newUrl = tBaseUrl + "api/get_download_token?url=" + encodeUrl;
    var resp = java.ajax(newUrl);
    //java.log("resp:"+resp)
    var data = JSON.parse(resp);
    var token = data.data;
    var proxyUrl = tBaseUrl + "api/download?token=" + token;
    return proxyUrl;
}

function proxy_lannge(url) {
    let encodeUrl = java.base64Encode(url);
    return "https://tw.langge.cf/downloadImg?url=" + encodeUrl;
}


proxy_func_list = [

    proxy_npee,
    proxy_doget,
    proxy_moonchan,
    
    proxy_deno,
    proxy_66a,
    proxy_lannge,

    proxy_no
];