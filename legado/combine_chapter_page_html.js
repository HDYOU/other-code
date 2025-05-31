chapter_rule = "";
next_chapter_url_rule = "option!0@value";
chapter_url_list = [];
has_chapter_url_list=false;
is_cache=true
is_cache_first=true
is_cache_last=false

rs = ""

let indexOf = baseUrl.indexOf("/", 9);
indexOf = indexOf > 0 ? indexOf : baseUrl.length;
let host = baseUrl.substring(0, indexOf);

let all_chapter_url_dic = {};
all_chapter_url_dic[baseUrl]="";

data_count=0;
let all_data_dic = {};

// 是否有错误
has_error=false
retry_time=2  //测试2次
sleep_time=30*1000 //睡眠30秒
/**
 *  分页目录获取
 * @param _data 网页内容
 * @param _next_chapter_url_list 下一页目录
 * @returns {string|string|*} 目录内容
 */
function get_multiple_chapter_pages(_data, _next_chapter_url_list) {
    //java.setContent(_data)
    s_data=_data
    if(chapter_rule!=null || chapter_rule!=""){
     s_data=java.getString(chapter_rule + "@html", _data);
    }
    
    all_data_dic[data_count++]=s_data
    //java.log(rs)
    if (!_next_chapter_url_list || _next_chapter_url_list.length == 0) return rs;
    let tmp_next_chapter_url_list = [];
    for (let i = 0; i < _next_chapter_url_list.length; i++) {
        let tt = String(_next_chapter_url_list[i]);
        if (tt.indexOf("/") == 0) {
            tt = host + tt;
        } else if (tt.toLowerCase().indexOf("http") == 0) {
            //tt = tt;
        } else {
            tt = baseUrl + tt;
        }
        let flag = all_chapter_url_dic.hasOwnProperty(tt);
        if (flag) continue;
        _next_chapter_url_list[i] = tt;
        all_chapter_url_dic[tt] = "";
        tmp_next_chapter_url_list.push(tt);
    }
    
    all_data_list = [];
    s_retry_time=retry_time+1
    if(s_retry_time < 1) s_retry_time=1
    for(; s_retry_time > 0; s_retry_time--){
      has_error=false
      all_data_list = ajax_all(tmp_next_chapter_url_list);
      if(!has_error){
       break
      }
      if(s_retry_time > 0){
        java.longToast(`${book.name} 获取目录出错, ${sleep_time/1000}秒后重试`)
        Packages.java.lang.Thread.sleep(sleep_time);
     }
    }
    
    if(has_error){
     java.longToast(`${book.name} 获取目录出错`)
    }
    
    let len = all_data_list.length;
    if (len > 1) {

        for (let i = 0; i < all_data_list.length; i++) {
            let s_data = all_data_list[i];
            get_multiple_chapter_pages(s_data, [])
        }

    } else {
        let s_data = String(all_data_list[0]);
        java.setContent(s_data)
        let s_next_chapter_url_list = java.getStringList(next_chapter_url_rule);
        if(has_chapter_url_list) s_next_chapter_url_list=[]
        get_multiple_chapter_pages(s_data, s_next_chapter_url_list)
    }
    return rs;
}

function ajax_cache_html_key(_url){
 return `html_${_url}`
}
function ajax_all(_url_list){
  let new_url_list=[]
  let tmp_resp_dic={}
  for(var i=0;i<_url_list.length;i++){
      url=_url_list[i]
      s_key=ajax_cache_html_key(url)
      s_data=cache.get(s_key)
      if(s_data !=null && s_data !=""){
       tmp_resp_dic[url]=s_data
      } else {
       new_url_list.push(url)
      }
    }
    
  if(new_url_list.length > 0){
    all_conn=java.ajaxAll(new_url_list)
    for(var i=0;i<all_conn.length;i++){
      url=new_url_list[i]
      s_key=ajax_cache_html_key(url)
      
      conn=all_conn[i];
      code=conn.code();
      is_ok= 200<=code && code<400
      s_data=conn.body()
      if(!is_ok){
        has_error=true
        s_data=""
      } else {
       if(is_cache){
        if(i==0 && !is_cache_first){
        
        } else if(i==all_conn.length-1 && !is_cache_last){
       
       } else {
         cache.put(s_key, s_data)
       }
      
      }
      }
      
      tmp_resp_dic[url]=s_data
      
    }
    
   }
   
   // 
   rs_list=[]
   for(var i=0;i<_url_list.length;i++){
      url=_url_list[i]
      rs_list.push(tmp_resp_dic[url])
    }
   return rs_list;
}

/**
 *  获取合并的目录内容
 */
function get_combine_chapter_page() {
    if(chapter_url_list.length > 0 || has_chapter_url_list){
     has_chapter_url_list=true
     next_chapter_url_list=chapter_url_list
    } else {
    next_chapter_url_list = java.getStringList(next_chapter_url_rule);
    }
    get_multiple_chapter_pages(result, next_chapter_url_list)
    rs=""
    for(var i=0;i<data_count;i++){
      rs+="\n"+all_data_dic[i]
    }
    return rs;
}

// get_combine_chapter_page
