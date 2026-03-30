/**
 * 检验并获取章节内容,
 * @returns {*|string}
 */
chapter_word_count=0;
is_qd_no_content_line_count=20;
qd_chapter_word_count_min=1000;
qd_chapter_word_count_max=1400;
qd_no_content_match=/([\u4e00-\u9fa5，,])\s*(\<.+\>)?$/
function validate_chapter_content() {
    let txt = String(result)
    txt = txt.replace(/亲,点击进去,给个好[^\n<>]*漂亮的老婆哦!|手机站全新改版[^\n<>]*广告清新阅读！|最新网址[^\n<>]*|[(（]?本章完[)）]?|推荐.*新书[^\n<>]*|手机用户[^\n<>]*阅读体验。/g,"")
    if (txt.match(/正在(手打|获取|更新)中/)) {
        return ""
    }
    // 起点内容没更新
    if(is_qd_no_content(txt)){
      return ""
    }
    // 中文字符数统计
    let matches = txt.match(/[\u4e00-\u9fa5\u2000-\u3020\uff00-\uff60?!,]/g);
    chapter_word_count = matches ? matches.length : 0;
    //java.log(JSON.stringify(matches))
    //java.log(`${chapter.title} 字数: ${chapter_word_count}`)
    // 起点小说内容防盗
    if (qd_chapter_word_count_min < chapter_word_count && chapter_word_count < qd_chapter_word_count_max) {
        return ""
    }
    return txt;
}

// 起点没有更新的内容
function is_qd_no_content(text) {
   // let text = String(result);
    let lines = text.split('\n');
    let len=is_qd_no_content_line_count;
    len=lines.length <len? lines.length: len;
    for(var i=0;i<len;i++){
      let line=lines[i];
      java.log(line);
      // 一段没有结束
      let m=line.match(qd_no_content_match);
      if(m){
       java.log(JSON.stringify(m));
       return true;
      }
      
    }
    return false;
    
}

// validate_chapter_content()