function BanjoCreateMainWindow(O) {
  O=O||this;
  JSQWidget(O);
  O.div().addClass('BanjoCreateMainWindow');

  this.load=function(obj) {load(obj);};
  this.save=function() {return save();};

  var jscontext=new JSContext();

  var m_process_list_manager=new ProcessListManager();
  var m_prv_list_manager=new PrvListManager(0,jscontext);
  var m_processor_manager=new ProcessorManager();
  m_processor_manager.loadSpec();
  var m_process_manager=new ProcessManager(0,m_prv_list_manager,jscontext);
  
  var m_control_widget=new ControlWidget(0,m_prv_list_manager,jscontext);

  //var m_create_banjo_view_widget=new CreateBanjoViewWidget(0,PM);
  var m_process_list_widget=new ProcessListWidget(0,m_process_list_manager,m_processor_manager);
  var m_prv_list_widget=new PrvListWidget(0,m_prv_list_manager,jscontext);
  m_control_widget.setParent(O);
  //m_create_banjo_view_widget.setParent(O);
  m_process_list_widget.setParent(O);
  m_prv_list_widget.setParent(O);
  
  JSQ.connect(m_process_list_manager,'save',O,function() {O.emit('save');});
  JSQ.connect(m_prv_list_manager,'save',O,function() {O.emit('save');});
  //JSQ.connect(m_create_banjo_view_widget,'save',O,saveToLocalStorage);
  JSQ.connect(m_control_widget,'share',O,share);

  JSQ.connect(m_process_list_widget,'run_process',O,function(sender,args) {console.log(args); run_process(args.process);});
  
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
      ProcessListManager:m_process_list_manager.save(),
      PrvListManager:m_prv_list_manager.save()//,
      //CreateView:m_create_banjo_view_widget.save()
    };
    return obj;
  }
  function load(obj) {
  	console.log(obj);
    m_process_list_manager.load(obj.ProcessListManager||{});
    m_prv_list_manager.load(obj.PrvListManager||{});
    //m_create_banjo_view_widget.load(obj.CreateView||{});
  }

  function run_process(process) {
    m_process_manager.runProcess(process,function(tmp) {
      console.log(';;;;;;');
      console.log(JSON.stringify(tmp));
      O.emit('save');
    });
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

function ControlWidget(O,prv_list_widget,jscontext) {
  O=O||this;
  JSQWidget(O);
  
  var view_templates_button=$('<button>View templates</button>');
  view_templates_button.click(view_templates);
  O.div().append(view_templates_button);

  /*var share_button=$('<button>Share</button>');
  share_button.click(share);
  O.div().append(share_button);
  */

  function view_templates() {
    var templates_name=prompt('Name of templates prv:');
    if (!templates_name) return;
    var templates=prv_list_widget.prv(templates_name);
    if (!templates) {
      alert('Unable to find prv with name: '+templates_name);
      return;
    }
    var X=new BanjoGenerator(jscontext);
    X.createTemplatesView(templates,{},function(tmp) {
      if (!tmp.success) {
        alert('Unable to create templates view: '+tmp.error);
        return;
      }
      X.addView('north',tmp.view);
      X.createPageUrl(function(tmp) {
        if (!tmp.success) {
          alert('Unable to create page url: '+tmp.error);
          return;
        }
        console.log(tmp.url);
        window.open(tmp.url,'_blank');
      });
    });
  }
  
  /*
  function share() {
    O.emit('share');
  }
  */
}

