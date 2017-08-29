function BanjoViewGenerator(jscontext) {
  var that=this;

  this.setServer=function(server) {m_server=server;};

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