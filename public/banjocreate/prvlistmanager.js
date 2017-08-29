function PrvListManager(O,jscontext) {
  O=O||this;
  JSQObject(O);
  
  this.setServerUrl=function(url) {m_server_url=url;};  
  this.setPrvRecord=function(name,prv_record) {m_prv_records[name]=prv_record; O.emit('changed');};
  this.setPrv=function(name,prv) {m_prv_records[name]={content:prv}; O.emit('changed');};
  this.removePrvRecord=function(name) {delete m_prv_records[name]; O.emit('changed');};
  this.prvRecord=function(name) {return m_prv_records[name]||{};};
  this.prv=function(name) {return O.prvRecord(name).content||null;};
  this.prvRecordNames=function() {return prvRecordNames();};
  this.checkOnServer=function(prv_name) {checkOnServer(prv_name);};
  this.renamePrvRecord=function(name,new_name) {return renamePrvRecord(name,new_name);};
  this.load=function(storage_object) {load(storage_object);};
  this.save=function() {return save();};
  
  var m_prv_records={};
  var m_server_url='http://river.simonsfoundation.org:60001';
  
  function prvRecordNames() {
    var ret=[];
    for (var name in m_prv_records) {
      ret.push(name);
    }
    return ret;
  }
  
  function checkOnServer(prv_name) {
    if (!prv_name) {
      for (var name in m_prv_records) {
        if (name) {
          var prv=m_prv_records[prv_name]||{};
          if (prv.on_server===undefined)
            checkOnServer(name);
        }
      }
    }
    else {
      var prv=m_prv_records[prv_name];
      check_on_server(prv_name,prv);
    }
  }
  function check_on_server(name,prv) {
    var obj=prv.content;
    var url=m_server_url+'/prvbucketserver?a=locate&checksum='+obj.original_checksum+'&size='+obj.original_size+'&fcs='+obj.original_fcs;   
    jscontext.http_get_text(url,function(resp) {
      var val=undefined;
      if (resp.success) {
        var txt=resp.text;
        if (starts_with(txt,'http')) val=true;
        else if (txt=='<not found>') val=false;
      }
      if (prv.on_server!==val) {
        prv.on_server=val;
        O.emit('changed');
      }
    });
  }
  function renamePrvRecord(name,new_name) {
    if (!(name in m_prv_records)) return false;
    if (new_name in m_prv_records) return false;
    m_prv_records[new_name]=m_prv_records[name];
    delete m_prv_records[name];
    O.emit('prv_renamed',{name:name,new_name:new_name});
    O.emit('changed');
    O.emit('save');
    return true;
  }
  function load(obj) {
    m_prv_records={};
    var prvs=obj.prvs||{};
    if (prvs) {
      for (var name in prvs) {
        O.setPrvRecord(name,prvs[name]);
      }
    }
  }
  function save() {
    var obj={};
    obj.prvs=m_prv_records;
    return obj;
  }

  function ends_with(str,str2) {
    return (str.slice(str.length-str2.length)==str2);
  }
  function starts_with(str,str2) {
    return (str.slice(0,str2.length)==str2);
  }
}
