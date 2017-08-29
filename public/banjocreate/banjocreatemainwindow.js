function BanjoCreateMainWindow(O) {
  O=O||this;
  JSQWidget(O);
  O.div().addClass('BanjoCreateMainWindow');

  this.load=function(obj) {load(obj);};
  this.save=function() {return save();};

  var PM2=new ProcessListManager();
  var PM=new PrvListManager();
  var processor_manager=new ProcessorManager();
  processor_manager.loadSpec();
  
  var m_control_widget=new ControlWidget(0,PM);

  //var m_create_banjo_view_widget=new CreateBanjoViewWidget(0,PM);
  var m_process_list_widget=new ProcessListWidget(0,PM2,processor_manager);
  var m_prv_list_widget=new PrvListWidget(0,PM);
  m_control_widget.setParent(O);
  //m_create_banjo_view_widget.setParent(O);
  m_process_list_widget.setParent(O);
  m_prv_list_widget.setParent(O);
  
  JSQ.connect(PM2,'save',O,function() {O.emit('save');});
  JSQ.connect(PM,'save',O,function() {O.emit('save');});
  //JSQ.connect(m_create_banjo_view_widget,'save',O,saveToLocalStorage);
  JSQ.connect(m_control_widget,'share',O,share);
  
  JSQ.connect(O,'sizeChanged',O,update_layout);
  function update_layout() {
    var W=O.width();
    var H=O.height();
    //var W1=Math.min(500,W/2);
    var W1=W/2;
    var H1=45;
    var H2=300;
    m_control_widget.setSize(W,H1);
    m_control_widget.setPosition(0,0);
    //m_create_banjo_view_widget.setSize(W1,H-H1);
    //m_create_banjo_view_widget.setPosition(0,H1);
    m_process_list_widget.setSize(W1,H-H1);
    m_process_list_widget.setPosition(0,H1);
    m_prv_list_widget.setSize(W-W1,H-H1);
    m_prv_list_widget.setPosition(W1,H1);
  }
  
  function share() {
  	var obj=save();
    url4text(JSON.stringify(obj),function(tmp) {
    	if (!tmp.success) {
      	alert('Unable to create shareable url: '+tmp.error);
        return;
      }
      open_url_in_new_tab(tmp.url);
    });
  }
  
  function open_url_in_new_tab(url) {
  	console.log(url);
  	if (!window.open(url,'_blank')) {
    	alert('Please allow popups for this site');
    }
  }
  
  function save() {
  	var obj={
      ProcessListManager:PM2.save(),
      PrvListManager:PM.save()//,
      //CreateView:m_create_banjo_view_widget.save()
    };
    return obj;
  }
  function load(obj) {
  	console.log(obj);
    PM2.load(obj,ProcessListManager||{});
    PM.load(obj.PrvListManager||{});
    //m_create_banjo_view_widget.load(obj.CreateView||{});
  }

  /*
  function saveToLocalStorage() {
    try {
      var obj=save();
      localStorage.banjoDev=JSON.stringify(obj);
    }
    catch(err) {
      console.warn('Unable to write to local storage');
    }
  }
  function loadFromLocalStorage() {
    try {
      var obj=JSON.parse(localStorage.banjoDev);
      load(obj);
    }
    catch(err) {
      
    }
  }
  */
}
