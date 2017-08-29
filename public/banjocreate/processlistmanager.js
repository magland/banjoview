function ProcessListManager(O) {
  O=O||this;
  JSQObject(O);
  
  this.setServerUrl=function(url) {m_server_url=url;};  
  this.addProcess=function(process) {m_processes.push(JSQ.clone(process)); O.emit('changed');};
  this.removeProcess=function(i) {m_processes.splice(i,1); O.emit('changed');};
  this.process=function(i) {return JSQ.clone(m_processes[i]||{});};
  this.setProcess=function(i,process) {m_processes[i]=JSQ.clone(process); O.emit('changed');};
  this.processCount=function() {return m_processes.length;};
  this.load=function(storage_object) {load(storage_object);};
  this.save=function() {return save();};
  
  var m_processes=[];
  var m_server_url='http://river.simonsfoundation.org:60001';
  
  function load(obj) {
    m_processes=[];
    var pp=obj.processes||[];
    for (var i in pp) {
      O.addProcess(JSQ.clone(pp[i]));
    }
  }
  function save() {
    var pp=[];
    for (var i=0; i<O.processCount(); i++) {
      pp.push(O.process(i));
    }
    var obj={processes:pp};
    return obj;
  }

}
