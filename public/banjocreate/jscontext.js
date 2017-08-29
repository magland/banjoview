function JSContext() {
  var that=this;

  this.btoa=function(str) {
    return btoa(str);
  };
  this.http_post_json=function(url,data,callback) {
    $.post(url,data,function(tmp) {
      callback({success:true,response:tmp});
    },'json');
  };
  this.http_get_json=function(url,callback) {
    that.http_get_text(url,function(tmp) {
      if (!tmp.success) {
        callback(tmp);
        return;
      }
      var obj;
      try {
        obj=JSON.parse(tmp.text);
      }
      catch(err) {
        callback({success:false,error:'Error parsing: '+tmp.text});
        return;
      }
      callback({success:true,object:obj});
    });  
  };
  this.http_get_text=function(url,callback) {
    $.get(url,function(tmp) {
      callback({success:true,text:tmp});
    },'text');
  };
}
