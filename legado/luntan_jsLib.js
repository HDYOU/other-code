var api = ["https://sxsy18.com/", "https://sxsy18.com/"];
// 域名内容测试匹配
var host_test_content_match=/动态/
	
var fabu_url = "";
var fabu_url_is_image= false;
var fabu_url_find_rule = "a@href"   //  @后面获取属性, @前面为  css 选择器  //.为空时 获取全部

// 测试延迟
var api_testing_dict = {};

function getSroteData(
        source,
       ){
    
    try{
        let text =""
         text = String(source.getVariable());
         //text=java.get("data");
         //text=source.getLoginInfoMap().get("data");
        //
        //text=cache.get(source.key+"_"+"data")
         
        //  java.log("data:"+text)
    if (text == null || text == "") text = "{}";
    let data = JSON.parse(text);
    return data;
    } catch(e){
        return {}
    }
   
}

function saveSroteData(data, 
        source,
        ){
    
    try{
        let txt =JSON.stringify(data);
        source.setVariable(txt);
        //java.put("data", txt);
       // source.getLoginInfoMap().put("data", txt);
        //source.getLoginInfoMap().save()
       //  java.upLoginData()
       // cache.put(source.key+"_"+"data" , txt)
    } catch(err){
        
    }
}

function getInfo(name, _) {
    const {
        java,
        source,
        cache,
    } = _ || this;
    let data = getSroteData(source);
    return data[name];
}

function putInfo(name, value, _) {
    const {
        java,
        source,
        cache,
    } = _ || this;
    let data = getSroteData(source);
    data[name] = value;
    saveSroteData(data, source);
}


function getUrl(_) {
    const {
        java,
        source
    } = _ || this;
    let data = getSroteData(source);
    let select_url_index = data.select_url_index || 0;
    let url_list = data.page_list || api;
    if( select_url_index >= url_list.length) select_url_index=0;

    //java.toast(JSON.stringify(url_list));

    return url_list[select_url_index];
}

function getPageList(_) {
    const {
        java,
        source,
        cache,
    } = _ || this;
    let data = getSroteData(source);
    let url_list = data.page_list || api;
    return url_list;
}


function getSelectHostIndex(_) {
    const {
        java,
        source
    } = _ || this;
    let data = getSroteData(source);
    let url_list = data.page_list || api;
    let select_url_index = data.select_url_index || 0;
    if( select_url_index >= url_list.length) select_url_index=0
    return select_url_index;
}

var api_testing_dict_key = "api_testing_dict";

function getTestApiHostDict(_) {
    const {
        java,
        source
    } = _ || this;
    return getInfo(api_testing_dict_key, source) || {};
}

function orcImageUrl( url, _) {
    const {
        java,
        source
    } = _ || this;
    try {
        let orc_url = "https://api8.ocr.space/parse/image";
        let resp2233 = org.jsoup.Jsoup.connect(orc_url)

            .header("User-Agent", "Mozilla/5.0 (Linux; Android 11; Redmi Note 8 Pro Build/RP1A.200720.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36")
            //  .header("Accept", "application/json, text/javascript, */*; q=0.01")
            //   .header("Accept-Encoding", "gzip, deflate")
            .header("apikey", "donotstealthiskey_ip1")
            .header("origin", "https://ocr.space")
            .header("referer", "https://ocr.space/")
            //   .header("accept-language", "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7")

            .data("url", url)
            .data("language", "eng")
            .data("isOverlayRequired", "true")
            .data("FileType", ".jpg")
            .data("IsCreateSearchablePDF", "false")
            .data("isSearchablePdfHideTextLayer", "false")
            .data("detectOrientation", "false")
            .data("isTable", "false")
            .data("scale", "false")
            .data("OCREngine", "1")
            .data("detectCheckbox", "false")
            .data("checkboxTemplate", "0")
            .method(org.jsoup.Connection.Method.POST)

            .ignoreContentType(true)

            .execute();

        // Jsoup 只要链式用data多参数/文件方式自动切multipart

        let status = resp2233.statusCode();

        java.toast("状态:" + status);
        if (status >= 400 || status < 200) return "";
        let conn = "";


        let find_url = "";

        conn = resp2233.body();

        let data = JSON.parse(conn);

        find_url = data.ParsedResults[0].TextOverlay.Lines[0].LineText;
        return find_url;
    } catch (e) {
        java.toast("错误:" + e);
        java.log(e);
        return "";
    }
}

function orcImageUrl_V2(url, _) {

    const {
        java,
        source
    } = _ || this;

    let bodySream = null;

    /*
    let req = org.jsoup.Jsoup.connect(url)
        .ignoreContentType(true) // 关键：忽略HTML类型校验，否则报错
        .timeout(10000)
        .execute()
        
        ;
        //let imgBytes = req.bodyAsBytes();
        let bodySream=req.bodyStream();
        */
    var javaImport = new JavaImporter();

    javaImport.importPackage(
        Packages.cn.hutool.core.io, Packages.java.io
    );
    with(javaImport) {

        let path = java.downloadFile(url);
        let imgBytes = java.readFile(path);
        java.deleteFile(path);
        bodySream = new ByteArrayInputStream(imgBytes);
    }


    try {
        let orc_url = "https://api.kolosal.ai/public/ocr/form";
        let time = Date.now();
        let resp2233 = org.jsoup.Jsoup.connect(orc_url)

            .header("User-Agent", "Mozilla/5.0 (Linux; Android 11; Redmi Note 8 Pro Build/RP1A.200720.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36")
            .header("Accept", "*/*, application/json, text/javascript, */*; q=0.01")
            //   .header("Accept-Encoding", "gzip, deflate")
            // .header("apikey", "donotstealthiskey_ip1")
            .header("origin", "https://www.kolosal.ai")
            .header("referer", "https://www.kolosal.ai/free-ocr/")
            //   .header("accept-language", "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7")

            .data("language", "auto")
            .data("image", time + ".png", bodySream, "image/jpg")

            .method(org.jsoup.Connection.Method.POST)

            .ignoreContentType(true)

            .execute();

        // Jsoup 只要链式用data多参数/文件方式自动切multipart

        let status = resp2233.statusCode();

        java.toast("状态:" + status);
        if (status >= 400 || status < 200) return "";
        let conn = "";


        let find_url = "";

        conn = resp2233.body();
        conn = conn + "";
        java.log(conn)
        java.toast(conn)
        let data=JSON.parse(conn)
        return data.extracted_text || "";
        let mm = conn.match(/"extracted_text"\s*:\s*"([^"]+)"/)
        if (!mm) {
            throw "找不到下载链接"
        }
        let surl = mm[1];
        java.log("ocr: " + surl);
        
        return surl;
    } catch (e) {
        java.toast("错误:" + e);
        java.log(e);
        return "";
    }
}

function loginViewItemIsOk(key,_){
    try{
       return source.getLoginInfoMap().get(key) == "✅";
   } catch(err){
   }
    
   try{
       const {
        source
      } = _ || this;
       return source.getLoginInfoMap().get(key) == "✅";
   } catch(err){
      // java.log(err)
   }
   return false;
}

function proxy_image(url, _){
    const {
        java,
        source
    } = _ || this;
    if(!loginViewItemIsOk("代理图片", _)) return url;
    let f = java.importScript("https://ghfast.top/https://raw.githubusercontent.com/HDYOU/other-code/main/legado/proxy_url.js");
    eval(String(f))

    let tmp_proxy_func_list = [

        proxy_npee,
        proxy_doget,
        proxy_moonchan
    ]
    let _url= proxy_moonchan(url);
    return _url;
    
   if(_url.indexOf(".gif")>0){
   	 return _url;
   	}
   let encode_url=encodeURIComponent(_url);
   return `https://gimg0.baidu.com/gimg/src=${encode_url}&app=2001&n=0&g=0n&q=90&fmt=webp`
}

function proxy_url(url, _){
    const {
        java,
        source
    } = _ || this;
    let key ="代理网络"
   // java.log(`${key}:" + ${source.getLoginInfoMap().get(key)}`)
    let flag= false;
    try{
        flag=source.getLoginInfoMap().get(key) == "✅";
    } catch(r){}
    
    if(!flag) return url;
    let f = java.importScript("https://ghfast.top/https://raw.githubusercontent.com/HDYOU/other-code/main/legado/proxy_url.js");
    eval(String(f))

    let tmp_proxy_func_list = [
        proxy_npee,
        proxy_doget,
        proxy_moonchan,
        
        proxy_deno,
    ]
    let _url= proxy_deno(url);
    return _url;
    
}