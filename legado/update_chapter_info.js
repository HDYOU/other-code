function update_chapter_info(base_chapter_list, other_chapter_list){
    
    if(!other_chapter_list || other_chapter_list.length < 1) return;
    chapter_title_info_dict={};
    reg_1=/第\s*[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+\s*章\s*/
    reg_2=/[\(（].*/g
    reg_3=/^\d+[\.·．、]?\s+/
    for (var i = 0; i <other_chapter_list.length; i++) {
      var item = other_chapter_list[i];
      var s_txt=String(item.text);
      chapter_title_info_dict[item.text]=item.info;
      part_1=s_txt.replace(reg_1, "")
      .replace(reg_3,"");
      chapter_title_info_dict[part_1]=item.info;
      part_2=part_1.replace(reg_2, "")
      chapter_title_info_dict[part_2]=item.info;
    }
    
    //java.log(JSON.stringify(Object.keys(chapter_title_info_dict)))
    
    for (var i = 0; i <base_chapter_list.length; i++) {
      var item = base_chapter_list[i];
      txt_list=[];
      var s_txt=String(item.text);
      txt_list.push(s_txt);
      part_1=s_txt.replace(reg_1, "")
      .replace(reg_3,"");
      txt_list.push(part_1);
      txt_list.push(part_1.replace(reg_2, ""));
      
      for (var j = 0; j <txt_list.length; j++) {
          tmp_key=txt_list[j];
          item.info = chapter_title_info_dict[tmp_key] || "";
          if( item.info != "") break;
       }
      
    }
  
}