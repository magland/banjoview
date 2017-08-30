function BanjoCreateMainWindow(O) {
  O=O||this;
  JSQWidget(O);
  O.div().addClass('BanjoCreateMainWindow');

  var category='MainWindow';

  this.load=function(obj) {load(obj);};
  this.save=function() {return save();};

  var context={};

  context.config={kulele_url:'http://kulele.herokuapp.com',server:''};

  var banjo_log=new BanjoLog();
  context.log=function(category,text) {banjo_log.message(category,text);};
  var m_log_widget=new BanjoLogWidget(0,banjo_log);
  

  context.jscontext=new JSContext();
  context.process_list_manager=new ProcessListManager(0,context);
  context.prv_list_manager=new PrvListManager(0,context);
  context.processor_manager=new ProcessorManager(0,context);
  context.processor_manager.loadSpec();
  context.process_manager=new ProcessManager(0,context);
  
  var m_control_widget=new ControlWidget(0,context);

  //var m_create_banjo_view_widget=new CreateBanjoViewWidget(0,PM);
  var m_process_list_widget=new ProcessListWidget(0,context);
  var m_prv_list_widget=new PrvListWidget(0,context);
  
  m_control_widget.setParent(O);
  //m_create_banjo_view_widget.setParent(O);
  m_process_list_widget.setParent(O);
  m_prv_list_widget.setParent(O);
  m_log_widget.setParent(O);

  context.log(category,'Ready');
  
  JSQ.connect(context.process_list_manager,'save',O,function() {O.emit('save');});
  JSQ.connect(context.prv_list_manager,'save',O,function() {O.emit('save');});

  JSQ.connect(m_control_widget,'config_server',O,configure_server);
  JSQ.connect(m_control_widget,'save_page',O,save_page);
  //JSQ.connect(m_create_banjo_view_widget,'save',O,saveToLocalStorage);
  //JSQ.connect(m_control_widget,'share',O,share);

  JSQ.connect(m_process_list_widget,'run_process',O,function(sender,args) {console.log(args); run_process(args.process);});
  
  JSQ.connect(O,'sizeChanged',O,update_layout);
  function update_layout() {
    var W=O.width();
    var H=O.height();
    //var W1=Math.min(500,W/2);
    var W1=W/2;
    var H1=45;
    var H2=Math.min(300,H-300);
    m_control_widget.setSize(W,H1);
    m_control_widget.setPosition(0,0);
    //m_create_banjo_view_widget.setSize(W1,H-H1);
    //m_create_banjo_view_widget.setPosition(0,H1);
    m_process_list_widget.setSize(W1,H-H1-H2);
    m_process_list_widget.setPosition(0,H1);
    m_prv_list_widget.setSize(W-W1,H-H1-H2);
    m_prv_list_widget.setPosition(W1,H1);
    m_log_widget.setSize(W,H2);
    m_log_widget.setPosition(0,H-H2);
  }

  function save_page() {
    var obj=O.save();
    url4text(JSON.stringify(obj),function(tmp) {
      if (!tmp.success) {
        context.log('','Error in url4text: '+tmp.error);
        return;
      }
      window.open('?mode=create&BanjoCreateMainWindow_url='+tmp.url,'_blank');
    });
  }
  
  /*
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
  */
  
  /*
  function open_url_in_new_tab(url) {
  	context.log(category,'Opening url: '+url);
  	if (!window.open(url,'_blank')) {
    	alert('Please allow popups for this site');
    }
  }
  */
  
  function save() {
  	var obj={
      ProcessListManager:context.process_list_manager.save(),
      PrvListManager:context.prv_list_manager.save()//,
      //CreateView:m_create_banjo_view_widget.save()
    };
    obj.config={};
    obj.config.kulele_url=context.config.kulele_url;
    obj.config.server=context.config.server;
    return obj;
  }
  function load(obj) {
    if (obj.config) {
      context.config.server=obj.config.server;
      context.config.kulele_url=obj.config.kulele_url;
    }
    context.process_list_manager.load(obj.ProcessListManager||{});
    context.prv_list_manager.load(obj.PrvListManager||{});
    //m_create_banjo_view_widget.load(obj.CreateView||{});
    if (!context.config.server) {
      context.log(category,'The config.server has not been set. You must set the server.');
    }
  }

  function run_process(process) {
    context.log(category,'Running process: '+JSON.stringify(process));
    context.process_manager.runProcess(process,function(tmp) {
      console.log(';;;;;;');
      console.log(JSON.stringify(tmp));
      O.emit('save');
    });
  }

  function configure_server() {
    context.config.kulele_url=prompt('kulele url:',context.config.kulele_url);
    context.config.server=prompt('Server:',context.config.server);
    context.prv_list_manager.checkOnServer();
    O.emit('save');
  }

  function url4text(txt,callback) {
    console.log ('Getting url4text...');
    context.jscontext.http_post_json('https://url4text.herokuapp.com/api/text/',{text:txt},cb);
    function cb(tmp) {
      console.log(tmp);
      if (!tmp.success) {
        callback(tmp);
        return;
      }
      response=tmp.response;
      var url0=response.raw||0;
      callback({success:true,url:url0});
    }
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

function ControlWidget(O,context) {
  O=O||this;
  JSQWidget(O);

  var config_server_button=$('<button>Configure server</button>');
  config_server_button.click(function() {O.emit('config_server');});
  O.div().append(config_server_button);
  
  var view_templates_button=$('<button>View templates</button>');
  view_templates_button.click(view_templates);
  O.div().append(view_templates_button);

  var save_page_button=$('<button>Save page</button>');
  save_page_button.click(save_page);
  O.div().append(save_page_button);

  /*var share_button=$('<button>Share</button>');
  share_button.click(share);
  O.div().append(share_button);
  */

  function save_page() {
    O.emit('save_page');
  }

  function view_templates() {
    var templates_name=prompt('Name of templates prv:');
    if (!templates_name) return;
    var templates=context.prv_list_manager.prv(templates_name);
    if (!templates) {
      alert('Unable to find prv with name: '+templates_name);
      return;
    }
    var X=new BanjoViewGenerator(context);
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

