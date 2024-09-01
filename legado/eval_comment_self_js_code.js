/**
 * 执行注释的自定义的JS 
 */
sourceComment = source.bookSourceComment;
start_txt = "<" + "js>";
s_len = start_txt.length;
end_txt = "<" + "/js>";
index = sourceComment.indexOf(start_txt);
last_index = sourceComment.indexOf(end_txt, index + s_len);
comm_js = sourceComment.substring(index + s_len, last_index);
eval(String(comm_js));