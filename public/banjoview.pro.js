#!/usr/bin/env nodejs

//////////////////////////////////////////////////////////////////////
var opts={PROJECTPATH:__dirname, SOURCEPATH:['.'], SCRIPTS:[], STYLESHEETS:[]};

//////////////////////////////////////////////////////////////////////
//require('../../jsqcore/jsqcore.pri').load(opts);
opts.SOURCEPATH.push('jsq/src/jsqcore');
opts.SCRIPTS.push(
	'jquery.min.js','jsq.js','jsqobject.js','jsqwidget.js','jsqcanvaswidget.js'
);
opts.STYLESHEETS.push(
	'jsq.css'
);

//////////////////////////////////////////////////////////////////////
//require('../jsq/jsqwidgets/jsqwidgets.pri').load(opts);
opts.SOURCEPATH.push('jsq/src/jsqwidgets')
opts.SCRIPTS.push(
	'jsqcanvaswidget.js','jsqtabwidget.js'
);

//////////////////////////////////////////////////////////////////////
opts.TARGET = 'index.html';
opts.SCRIPTS.push('banjoview.js','localstorage.js');
opts.STYLESHEETS.push('banjoview.css');


opts.SOURCEPATH.push('common/mda')
opts.SCRIPTS.push(
	'mda.js'
);
opts.STYLESHEETS.push(
	'jsq.css'
);

opts.SOURCEPATH.push('core')
opts.SCRIPTS.push(
	'mvabstractview.js','mvcontext.js',
	'mvcontrolpanel.js','mvmainwindow.js','mvabstractcontrolwidget.js',
	'mvpanelwidget.js','tabber.js','tabberframe.js'
);

opts.SOURCEPATH.push('views')
opts.SCRIPTS.push(
	'mvtemplatesview.js','histogramview.js','mvhistogramgrid.js','mvamphistview.js','mvcrosscorrelogramsview.js','firingeventsview.js'
);

opts.SOURCEPATH.push('controlwidgets')
opts.SCRIPTS.push(
	'generalcontrolwidget.js'
);

opts.SOURCEPATH.push('banjocreate')
opts.SCRIPTS.push(
	'banjocreate.js','jquery-ui.min.js','banjocreatemainwindow.js','prvlistwidget.js','prvlistmanager.js',
	'upload_file.js','make_editable.js','processlistwidget.js','processlistmanager.js','editprocessdialog.js',
	'processormanager.js','selectprocessordialog.js','processmanager.js','jscontext.js','banjoviewgenerator.js',
	'banjolog.js','banjologwidget.js'
);
opts.STYLESHEETS.push(
	'banjocreate.css','jquery-ui.min.css'
);

//////////////////////////////////////////////////////////////////////
require(__dirname+'/jsq/jsqmake/jsqmake.js').jsqmake(opts);
