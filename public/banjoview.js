function jsqmain(query) {
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
                	view_type:'correlograms',
                	correlograms_url:'http://river.simonsfoundation.org:60001/prvbucket/U7IEG0.autocorrelograms_ms2mn.json',
                	container:'south',
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