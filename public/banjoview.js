function jsqmain(query) {
    query=query||{};

    if ((query.mode||'')=='create') {
        var LS=new LocalStorage();
        var X=new BanjoCreateMainWindow(0);
        X.load(LS.readObject('BanjoCreateMainWindow'));
        X.showFullBrowser();

        JSQ.connect(X,'save',0,function() {
            LS.writeObject('BanjoCreateMainWindow',X.save());
        });
        return;
    }

    console.log('query='+JSON.stringify(query));
    var config=null;
    var config_str=query.config||'';
    if (query.config) {
        config=JSON.parse(atob(query.config));
        load_from_config(config);
    }
    else if (query.config_url) {
        console.log(atob(query.config_url));
        $.get(atob(query.config_url),function(txt) {
            config=JSON.parse(txt);
            load_from_config(config);
        });
    }
    else {
        config={views:[{
                    view_type:'templates',
                    templates_url:'http://river.simonsfoundation.org:60001/prvbucket/templates0.mda',
                    container:'north',
                    label:'Templates'
                },{
		    		view_type:'firing_events',
		    		firing_events_url:'http://river.simonsfoundation.org:60001/prvbucket/_mountainprocess/output_firings_out_881f814d85',
		    		container:'south',
		    		label:'Firing events'
		    	},{
                	view_type:'correlograms',
                	correlograms_url:'http://river.simonsfoundation.org:60001/prvbucket/XC39L9.autocorrelograms_ms2mn.json',
                	container:'north',
                	label:'Auto Correlograms'
                }]};
        load_from_config(config);
    }
}

function load_from_config(config) {
    var mvcontext=new MVContext();
    var MW=new MVMainWindow(0,mvcontext);
    MW.showFullBrowser();
    MW.setControlPanelVisible(false);

    var views0=config.views||[];
    console.log ('Loading '+views0.length+' views...');
    for (var i in views0) {
        var view0=views0[i];
        if (view0.view_type) {
            console.log('Loading view: '+view0.view_type+' '+JSON.stringify(view0));
            if (!view0.container) view0.container=get_container_from_index(i);
            if (!view0.label) view0.label=view0.view_type;
            var X=create_view(view0);
            if (X) MW.addView(view0.container,view0.label,X);
        }
        else {
            console.warn('No view_type found for view at index '+i);
        }
    }
    console.log ('.');

    function create_view(view0) {
        if (view0.view_type=='templates') {
            var X=new MVTemplatesView(0,mvcontext);
            if (view0.templates_url)
                X.setTemplatesUrl(view0.templates_url);
            else
                console.warn('No templates_url found for view_type='+view0.view_type);
            return X;
        }
        else if (view0.view_type=='correlograms') {
            var X=new MVCrossCorrelogramsView(0,mvcontext);
            if (view0.correlograms_url)
                X.setCorrelogramsUrl(view0.correlograms_url);
            else
                console.warn('No correlograms_url found for view_type='+view0.view_type);
            return X;
        }
        else if (view0.view_type=='firing_events') {
            var X=new FiringEventsView(0,mvcontext);
            if (view0.firing_events_url)
                X.setEventsUrl(view0.firing_events_url);
            else {
            	var test=make_test_events();
            	X.setEvents(test);
                //console.warn('No correlograms_url found for view_type='+view0.view_type);
            }
            return X;
        }
        else {
        	console.warn('Unrecognized view type: '+view0.view_type);
        	return 0;
        }
    }

    function get_container_from_index(i) {
        if (i%2===0) return 'north';
        else return 'south';
    }
    function create_static_view(mvcontext,obj) {
        var X;
        if (obj['view-type']=="MVCrossCorrelogramsWidget") {
            X=new MVCrossCorrelogramsView(0,mvcontext,obj.options.mode);
        }
        else if (obj['view-type']=="MVClusterDetailWidget") {
            X=new MVTemplatesView(0,mvcontext);
        }
        else {
            alert('Unknown view-type: '+obj['view-type']);
            return 0;
        }    
        X.loadStaticView(obj);
        return X;
    }
}

function make_test_events() {
	var L=200;
	var X=new Mda(4,L);
	for (var i=0; i<L; i++) {
		var t0=i/L*1000;
		var k0=1;
		var amp0=Math.random()*2-1;
		X.setValue(t0,1,i);
		X.setValue(k0,2,i);
		X.setValue(amp0,3,i);
	}
	return X;
}