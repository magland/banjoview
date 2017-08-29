function BanjoGenerator(jscontext) {
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
}