function PrvListManager(O) {
  O=O||this;
  JSQObject(O);
  
  this.setServerUrl=function(url) {m_server_url=url;};  
  this.addPrv=function(name,prv) {m_prvs[name]=prv; O.emit('changed');};
  this.removePrv=function(name) {delete m_prvs[name]; O.emit('changed');};
  this.prv=function(name) {return m_prvs[name]||{};};
  this.prvNames=function() {return prvNames();};
  this.checkOnServer=function() {checkOnServer();};
  this.renamePrv=function(name,new_name) {return renamePrv(name,new_name);};
  this.load=function(storage_object) {load(storage_object);};
  this.save=function() {return save();};
  
  var m_prvs={};
  var m_server_url='http://river.simonsfoundation.org:60001';
  
  function prvNames() {
    var ret=[];
    for (var name in m_prvs) {
      ret.push(name);
    }
    return ret;
  }
  
  function checkOnServer() {
    for (var name in m_prvs) {
      var prv=m_prvs[name];
      if (prv.on_server===undefined) {
        check_on_server(name,prv);
      }
    }
  }
  function check_on_server(name,prv) {
    var obj=prv.content;
    var url=m_server_url+'/prvbucketserver?a=locate&checksum='+obj.original_checksum+'&size='+obj.original_size+'&fcs='+obj.original_fcs;   
    $.get(url,function(txt) {
      var val=undefined;
      if (starts_with(txt,'http')) val=true;
      else if (txt=='<not found>') val=false;
      if (prv.on_server!==val) {
        prv.on_server=val;
        O.emit('changed');
      }
    });
  }
  function renamePrv(name,new_name) {
    if (!(name in m_prvs)) return false;
    if (new_name in m_prvs) return false;
    m_prvs[new_name]=m_prvs[name];
    delete m_prvs[name];
    O.emit('prv_renamed',{name:name,new_name:new_name});
    O.emit('changed');
    O.emit('save');
    return true;
  }
  function load(obj) {
    m_prvs={};
    var prvs=obj.prvs||{};
    if (prvs) {
      for (var name in prvs) {
        O.addPrv(name,prvs[name]);
      }
    }
  }
  function save() {
    var obj={};
    obj.prvs=m_prvs;
    return obj;
  }

  function ends_with(str,str2) {
    return (str.slice(str.length-str2.length)==str2);
  }
  function starts_with(str,str2) {
    return (str.slice(0,str2.length)==str2);
  }
}
