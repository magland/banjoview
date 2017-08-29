
function ControlWidget(O,PM) {
  O=O||this;
  JSQWidget(O);
  
  var share_button=$('<button>Share</button>');
  share_button.click(share);
  O.div().append(share_button);
  
  function share() {
  	O.emit('share');
  }
}

function CreateBanjoViewWidget(O,PM) {
  O=O||this;
  JSQWidget(O);
  O.div().addClass('CreateBanjoViewWidget');

  this.load=function(storage_object) {load(storage_object);};
  this.save=function() {return save();};
  
  var m_table=$('<table></table>');
  O.div().append(m_table);
  
  var create_button=$('<button>Create banjo view: </button>');
  create_button.click(create_banjo_view);
  O.div().append(create_button);
  
  O.div().append('<br/>');
  var m_url_edit=$('<input type=text class=url></input>');
  m_url_edit.attr('readonly',true);
  m_url_edit.click(function() {m_url_edit.select();});
  O.div().append(m_url_edit);
  
  var m_select_prv_controls=[];
  var m_controls={};
  
  var timeseries_control=add_control('timeseries','Timeseries','choices');
  var firings_control=add_control('firings','Firings','choices');
  var templates_control=add_control('templates','Templates','choices');
  
  m_select_prv_controls.push(timeseries_control);
  m_select_prv_controls.push(firings_control);
  m_select_prv_controls.push(templates_control);
  
  JSQ.connect(PM,'prv_renamed',O,on_renamed);
  JSQ.connect(PM,'changed',O,refresh_controls);

  function load(obj) {
    obj.control_values=obj.control_values||{};
    for (var control_name in m_controls) {
      if (obj.control_values[control_name])
        m_controls[control_name].val(obj.control_values[control_name])
    }
  }
  function save() {
    var obj={};
    obj.control_values={};
    for (var control_name in m_controls) {
      obj.control_values[control_name]=m_controls[control_name].val();
    }
    return obj;
  }
  
  function add_control(name,label,control_type) {
    var control=null;
    if (control_type=='lineedit') {
      var tr=$('<tr><td id=label><td id=control></td></tr>');
      m_table.append(tr);
      tr.find('#label').html(label);
      control=$('<input type=text></input>');
    }
    else if (control_type=='choices') {
      var tr=$('<tr><td id=label><td id=control></td></tr>');
      m_table.append(tr);
      tr.find('#label').html(label);
      control=$('<select></select>');
      tr.find('#control').append(control);
    }
    if (control) {
      tr.find('#control').append(control);
      m_controls[name]=control;
    }
    return control;
  }
  
  function refresh_controls() {
    var prv_names=PM.prvNames();
    for (var i in m_select_prv_controls) {
      var control=m_select_prv_controls[i];
      var val0=control.val();
      if (val0 in m_rename_map) val0=m_rename_map[val0];
      control.empty();
      add_select_option(control,'(Undefined)','');
      for (var j in prv_names) {
        var name=prv_names[j];
        add_select_option(control,name,name);
      }
      if (val0)
        control.val(val0);
    }
  }
  
  var m_rename_map={};
  function on_renamed(sender,args) {
    m_rename_map[args.name]=args.new_name;
    refresh_controls();
    m_rename_map={};
  }
  
  function add_select_option(control,label,value) {
    var option=$('<option value="'+value+'">'+label+'</option>');
    control.append(option);
  }
  
  function get_control_value(name) {
    return m_controls[name].val();
  }
  function get_control_prv(control_name) {
    var name=get_control_value(control_name);
    if (!name) return null;
    return PM.prv(name);
  }
  
  function create_banjo_view() {
  	O.emit('save');
    m_url_edit.val('');
    var prv_timeseries=get_control_prv('timeseries')||{};
    var prv_firings=get_control_prv('firings')||{};
    var prv_templates=get_control_prv('templates')||{};
    //var prv_autocorrelograms=get_control_prv('autocorrelograms');

    var params0={};
    params0.timeseries=prv_timeseries.content||null;
    params0.firings=prv_firings.content||null;
    params0.templates=prv_templates.content||null;
    params0.autocorrelograms=null;

    var north_views=(params0.north_views||'templates').split(',');
    var south_views=(params0.south_views||'autocorrelograms').split(',');
    var BG=new BanjoGenerator(jscontext);

    if ((params0.firings)&&((params0.clusters)||('t1' in params0)||('t2' in params0))) {
      BG.extractFirings(params0.firings,{clusters:params0.clusters||'',t1:params0.t1||0,t2:params0.t2||-1},function(tmp) {
        if (!tmp.success) {
          console.log ('Error extracting firings: '+tmp.error);
          return;
        }
        params0.firings=firings_out;
        step2();
      });
    }
    else {
      step2();
    }

    function step2() {

      var steps=[];

      var view_infos=[];
      for (var i in north_views) {
        view_infos.push({type:north_views[i],container:'north'});
      }
      for (var i in south_views) {
        view_infos.push({type:south_views[i],container:'south'});
      }
      for (var i in view_infos) {
        var view_info=view_infos[i];
        if (view_info.type=='templates') {
          var step0=templates_func(view_info,params0);
          if (step0) steps.push(step0);   
        }
        else if (view_info.type=='autocorrelograms') {
          var step0=autocorrelograms_func(view_info,params0);
          if (step0) steps.push(step0);   
        }
        else {
          console.log ('Unrecognized view type: '+view_info.type);
          return;
        }
      }

      steps.push(finalize);

      run_steps(steps,function() {});

    }

    function templates_func(view_info,params0) {
      if (params0.templates) {
        return function(cb) {
          //var templates=read_json_file(params0.templates);

          BG.createTemplatesView(params0.templates,{},function(tmp) {
            if (!tmp.success) {
              console.log (tmp.error);
              return;
            }
            BG.addView(view_info.container,tmp.view);
            cb();
          });
        };
      }
      else if ((params0.firings)&&(params0.timeseries)&&(!params0.templates)) {
        return function(cb) {
          BG.computeTemplates(params0.timeseries,params0.firings,{},function(tmp) {
            if (!tmp.success) {
              console.log (tmp.error);
              return;
            }
            var templates=tmp.templates_out;
            BG.createTemplatesView(templates,{},function(tmp2) {
              if (!tmp2.success) {
                console.log (tmp2.error);
                return;
              }
              BG.addView(view_info.container,tmp2.view);
              cb();
            });
          });
        };
      }
      else {
        return 0;
      }
    }

    function autocorrelograms_func(view_info,params0) {

      if (params0.autocorrelograms) {
        return function(cb) {
          //var correlograms=read_json_file(params0.autocorrelograms);

          BG.createCorrelogramsView(params0.autocorrelograms,{},function(tmp) {
            if (!tmp.success) {
              console.log (tmp.error);
              return;
            }
            BG.addView('south',tmp.view);
            cb();
          });
        };
      }
      else if ((params0.firings)&&(params0.timeseries)&&(!params0.autocorrelograms)) {
        return function(cb) {
          BG.computeAutocorrelograms(params0.firings,{},function(tmp) {
            if (!tmp.success) {
              console.log (tmp.error);
              return;
            }
            var correlograms=tmp.correlograms_out;
            BG.createCorrelogramsView(correlograms,{label:'Autocorrelograms'},function(tmp2) {
              if (!tmp2.success) {
                console.log (tmp2.error);
                return;
              }
              BG.addView('south',tmp2.view);
              cb();
            });
          });
        };
      }
      else return 0;
    }

    function finalize() {
      BG.createPageUrl(function(tmp2) {
        if (!tmp2.success) {
          console.log ('Error creating page url: '+tmp.error);
          return;
        }
        m_url_edit.val(tmp2.url);
      });
    }

    /*
    if (prv_templates) {
      BG.createTemplatesView(prv_templates.content,{},function(tmp) {
        if (tmp.success) {
          var view0=tmp.view;
          BG.addView('north',view0);
          BG.createPageUrl(function(url) {
            console.log(url);
          });
        }
        else {
          console.log('Unable to create view.');
        }
      });
    }
    */   
  }
  
  refresh_controls();
}


/*
/////////////////////////////////////////////
/////////////////////////////////////////////
var path='https://banjoview.herokuapp.com';
var scripts=[
  path+'/jsq/src/jsqcore/jsq.js',
  path+'/jsq/src/jsqcore/jsqobject.js',
  path+'/jsq/src/jsqcore/jsqwidget.js',
  path+'/jsq/src/jsqwidgets/jsqcanvaswidget.js',
  path+'/jsq/src/jsqwidgets/jsqcanvaswidget.js',
  path+'/jsq/src/jsqwidgets/jsqtabwidget.js'
];
var stylesheets=[
  path+'/jsq/src/jsqcore/jsq.css'
];
load_scripts(scripts,jsqmain);
load_stylesheets(stylesheets);


function load_scripts(scripts,callback) {
  var i=0;
  load_next();
  function load_next() {
    if (i>=scripts.length) {
      callback();
      return;
    }
    $.getScript(scripts[i],function() {
      i++;
      load_next();
    });
  }
}

function load_stylesheets(stylesheets) {
  for (var i=0; i<stylesheets.length; i++) {
    $("<link/>", {
       rel: "stylesheet",
       type: "text/css",
       href: stylesheets[i]
    }).appendTo("head");
  }
}
*/

function run_steps(steps,callback) {
  var i=0;
  next_step();
  function next_step() {
    if (i>=steps.length) {
      callback();
      return;
    }
    steps[i](function() {
      i++;
      next_step();
    });
  }
}

/////////////////////////////////////////////////////////

function BanjoGenerator(context) {
  var that=this;

  this.setServer=function(server) {m_server=server;};

  this.extractFirings=function(firings,opts,callback) {extractFirings(firings,opts,callback);};
  this.computeTemplates=function(timeseries,firings,opts,callback) {computeTemplates(timeseries,firings,opts,callback);};
  this.computeAutocorrelograms=function(firings,opts,callback) {computeAutocorrelograms(firings,opts,callback);};
  this.computeFiringsEvents=function(timeseries,firings,opts,callback) {computeFiringsEvents(timeseries,firings,opts,callback);};

  this.createTemplatesView=function(templates,opts,callback) {createTemplatesView(templates,opts,callback);};
  this.createCorrelogramsView=function(correlograms,opts,callback) {createCorrelogramsView(correlograms,opts,callback);};
  this.createFiringEventsView=function(firing_events,opts,callback) {createFiringEventsView(firing_events,opts,callback);};

  this.addView=function(container,view) {view.container=container; m_views.push(view);};
  this.createPageUrl=function(callback) {createPageUrl(callback);};

  var m_server={
    host:'http://river.simonsfoundation.org',
    port:'60001'
  };
  var m_views=[];

  function extractFirings(firings,opts,callback) {
    if ((firings)&&((opts.t1>0)||(opts.t2>=0)||(opts.clusters))) {
      mp_run_process('mountainsort.extract_firings',
        {firings:firings},
        {firings_out:true},
        {t1:opts.t1||-1,t2:opts.t2||-1,clusters:(opts.clusters||'')},
        {server:m_server},
        function(tmp) {
          if (!tmp.success) {
            callback(tmp);
            return;
          }
          tmp.outputs=tmp.outputs||{};
          var firings_out=tmp.outputs.firings_out||null;
          callback({success:true,firings_out:firings_out});
        }
      );
    }
    else {
      callback({success:true,firings:firings});
    }
  }
  function computeTemplates(timeseries,firings,opts,callback) {
    console.log ('Computing templates...');
    var clip_size=opts.clip_size||100;
    mp_run_process('mountainsort.compute_templates',
      {timeseries:timeseries,firings:firings},
      {templates_out:true},
      {clip_size:clip_size},
      {server:m_server},
      function(tmp) {
        if (!tmp.success) {
          callback(tmp);
          return;
        }
        tmp.outputs=tmp.outputs||{};
        var templates_out=tmp.outputs.templates_out||null;
        callback({success:true,templates_out:templates_out});
      }
    );
  }
  function computeAutocorrelograms(firings,opts,callback) {
    console.log ('Computing autocorrelograms...');
    var bin_size_msec=opts.bin_size_msec||2;
    var max_dt_msec=opts.max_dt_msec||100;
    var samplerate=opts.samplerate||30000;
    mp_run_process('banjoview.cross_correlograms',
      {firings:firings},
      {correlograms_out:true},
      {bin_size_msec:bin_size_msec,max_dt_msec:max_dt_msec,samplerate:samplerate,mode:'autocorrelograms'},
      {server:m_server},
      function(tmp) {
        if (!tmp.success) {
          callback(tmp);
          return;
        }
        tmp.outputs=tmp.outputs||{};
        var correlograms_out=tmp.outputs.correlograms_out||null;
        console.log (JSON.stringify(correlograms_out));
        callback({success:true,correlograms_out:correlograms_out});
      }
    );
  }

  function createTemplatesView(templates,opts,callback) {
    console.log ('Creating templates view...');
    get_url_for_prv(templates,function(tmp) {
      if (!tmp.success) {
        callback({success:false,error:tmp.error||''});
        return;
      }
      var view0={view_type:'templates',templates_url:tmp.url,label:'Templates'};
      callback({success:true,view:view0});
    });
  }

  function createCorrelogramsView(correlograms,opts,callback) {
    console.log ('Creating correlograms view...');
    get_url_for_prv(correlograms,function(tmp) {
      if (!tmp.success) {
        callback({success:false,error:tmp.error||''});
        return;
      }
      var view0={view_type:'correlograms',correlograms_url:tmp.url,label:opts.label||'Correlograms'};
      callback({success:true,view:view0});
    });
  }

  function createPageUrl(callback) {
    console.log ('Creating page url...');
    var config={views:m_views};
    url4text(JSON.stringify(config),function(tmp) {
      if (!tmp.success) {
        callback({success:false,error:tmp.error});
        return;
      }
      var url0='http://banjoview.herokuapp.com?config_url='+jscontext.btoa(tmp.url);
      callback({success:true,url:url0});
    });
  }

  function get_url_for_prv(prv,callback) {
    console.log ('Getting url for prv...');
    var server_url=m_server.host+':'+m_server.port;
    var url0=server_url+'/prvbucketserver?a=locate&checksum='+prv.original_checksum+'&size='+prv.original_size+'&fcs='+(prv.original_fcs||'');
    jscontext.http_get_text(url0,function(tmp) {
      if (!tmp.success) {
        callback(tmp);
        return;
      }
      var txt=tmp.text;
      if (!starts_with(txt,'http')) {
        callback({success:false,error:'Error getting url for prv: '+txt});
        return;
      }
      callback({success:true,url:txt});
    });
  }

  function mp_run_process(processor_name,inputs,outputs_to_return,params,opts,callback) {
    var request={
      action:'run_process',
      processor_name:processor_name,
      inputs:inputs,
      outputs:outputs_to_return,
      parameters:params
    };
    var server_url=m_server.host+':'+m_server.port;
    var url0=server_url+'/mountainprocess?a=mountainprocess&mpreq='+JSON.stringify(request);
    jscontext.http_get_json(url0,function(tmp) {
      if (!tmp.success) {
        callback({success:false,error:tmp.error});
        return;
      }
      if (!tmp.object.success) {
        callback({success:false,error:tmp.object.error});
        return; 
      }
      callback({success:true,outputs:tmp.object.outputs});
    });
  }
}

function starts_with(str,str2) {
  return (str.slice(0,str2.length)==str2);
}

function ends_with(str,str2) {
  if (str2.length>str.length) return false;
  return (str.slice(str.length-str2.length)==str2);
}

function url4text(txt,callback) {
  console.log ('Getting url4text...');
  jscontext.http_post_json('https://url4text.herokuapp.com/api/text/',{text:txt},cb);
  function cb(tmp) {
    if (!tmp.success) {
      callback(tmp);
      return;
    }
    response=tmp.response;
    var url0=response.raw||0;
    callback({success:true,url:url0});
  }
}

