function FiringEventsView(O,mvcontext) {
	O=O||this;
	MVAbstractView(O,mvcontext);
	O.div().addClass('FiringEventsView');

	this.setEvents=function(events) {return setEvents(events);};
	this.setEventsUrl=function(url) {m_events_url=url;};

	O.prepareCalculation=function() {prepareCalculation();};
	O.runCalculation=function(opts,callback) {runCalculation(opts,callback);};
	O.onCalculationFinished=function() {onCalculationFinished();};

	O.onWheel(wheel);
	O.onMousePress(mousePress);
	O.onMouseRelease(mouseRelease);
	O.onMouseMove(mouseMove);
	O.onMouseEnter(mouseEnter);
	O.onMouseLeave(mouseLeave);
	O.onKeyPress(keyPress);

	JSQ.connect(O,'sizeChanged',O,update_layout);
	JSQ.connect(mvcontext,'selectedClustersChanged',O,update_layout);
	//JSQ.connect(mvcontext,'optionsChanged',O,O.recalculate);
	//JSQ.connect(mvcontext,'currentClusterChanged',O,update_highlighting);
	//JSQ.connect(mvcontext,'selectedClustersChanged',O,update_highlighting);

	var m_viewport=new FiringEventsViewport();
	m_viewport.setParent(O);
	var m_overlay=new FiringEventsOverlay();
	m_overlay.setViewport(m_viewport);
	m_overlay.setParent(O);
	var m_events_url='';
	var m_events=new Mda(0,0);
	var m_tmax=0;
	var m_selected_clusters={};
	update_layout();
	
	function update_layout() {
		var ss=O.size();
		m_viewport.setPosition([5,5]);
		m_viewport.setSize([ss[0]-10,ss[1]-10]);
		m_overlay.setPosition([5,5]);
		m_overlay.setSize([ss[0]-10,ss[1]-10]);
		update_viewport();
	}

	function setEvents(events) {
		m_events=events;
		auto_compute_y_range_and_tmax();
		//m_viewport.setTimeRange(0,Math.min(30000*60*60,m_tmax));
		m_viewport.setTimeRange(0,m_tmax);
		update_viewport();
	}
	var global_update_viewport_code=0;
	function update_viewport() {
		global_update_viewport_code++;
		var local_update_viewport_code=global_update_viewport_code;
		m_selected_clusters=mvcontext.selectedClusters();
		m_viewport.clearEvents();
		var timer=new Date();
		var timerange=m_viewport.timeRange();
		var t1=timerange[0],t2=timerange[1];
		var indrange=find_event_index_range_for_time_range(t1,t2);
		var increment=Math.max(1,Math.floor((indrange[1]-indrange[0]+1)/10000));
		var index_offset=0;
		var timer=new Date();
		do_next_update();
		function do_next_update() {
			if (local_update_viewport_code!=global_update_viewport_code) return;
			update_viewport_kernel(indrange,increment,index_offset);
			index_offset++;
			if (index_offset>=increment) return;
			setTimeout(do_next_update,1);
			timer=new Date();
		}
	}

	function update_viewport_kernel(index_range,index_increment,index_offset) {
		for (var i=index_range[0]+index_offset; i<=index_range[1]; i+=index_increment) {
			//if (elapsed(timer)>20) return; 
			var time0=m_events.value(1,i);
			var label0=m_events.value(2,i);
			var amp0=m_events.value(3,i);

			var use_all=$.isEmptyObject(m_selected_clusters);

			if ((label0 in m_selected_clusters)||(use_all)) {
				m_viewport.addEvent({time:time0,label:label0,amp:amp0});
			}
		}
	}

	function find_event_index_range_for_time_range(t1,t2) {
		var L=m_events.N2();
		if (L===0) return [0,-1];
		
		var i1min=0,i1max=L-1;
		while (i1max>i1min+1) {
			var i1=Math.ceil((i1min+i1max)/2);
			if (m_events.value(1,i1)<t1)
				i1min=i1;
			else
				i1max=i1;
		}

		var i2min=0,i2max=L-1;
		while (i2max>i2min+1) {
			var i2=Math.ceil((i2min+i2max)/2);
			if (m_events.value(1,i2)<t2)
				i2min=i2;
			else
				i2max=i2;
		}
		
		return [i1min,i2max];

	}

	function auto_compute_y_range_and_tmax() {
		var minval=0;
		var maxval=0;
		m_tmax=0;
		for (var i=0; i<m_events.N2(); i++) {
			var t0=m_events.value(1,i);
			var amp=m_events.value(3,i);
			if (amp<minval) minval=amp;
			if (amp>maxval) maxval=amp;
			if (t0>m_tmax) m_tmax=t0;
		}
		m_viewport.setYRange(minval,maxval);
	}

	function zoom(factor) {
		var center_time=Math.max(0,m_viewport.currentTime()); //this time should stay stationary
		var center_x=m_viewport.time2xpix(center_time); //the corresponding pixel location before the zoom
		var tr=m_viewport.timeRange(); //the time range before the zoom
		m_viewport.setTimeRange(tr[0]*factor,tr[1]*factor); //do the zoom
		var new_time=m_viewport.xpix2time(center_x); //the new time corresponding to the above pixel location
		var dt=center_time-new_time; //this is how much we need to time shift
		var new_time_range=m_viewport.timeRange(); //the new time range
		dt=Math.max(-new_time_range[0],dt);
		dt=Math.min(m_tmax-new_time_range[1],dt);
		var t1=new_time_range[0]+dt; //do the time shift
		var t2=new_time_range[1]+dt; //do the time shift
		t1=Math.max(0,t1); //make sure we are in the correct range
		t2=Math.min(t2,m_tmax); //make sure we are in the correct range
		m_viewport.setTimeRange(t1,t2); //set the new time range
		//if ((t1<tr[0])||(t2>tr[1])) //only update the events in the viewport if we have potentially new data
			update_viewport();
	}
	function vertical_zoom(factor) {
		var yr=m_viewport.yRange();
		yr[0]=yr[0]/factor;
		yr[1]=yr[1]/factor;
		m_viewport.setYRange(yr[0],yr[1]);;
		update_viewport();
	}

	function wheel(evt) {
		if (evt.delta>0) {
			zoom(1/1.2);
		}
		else if (evt.delta<0) {
			zoom(1.2);
		}
	}

	var press_anchor=[-1,-1];
	var press_anchor_trange=[-1,-1];
	var is_dragging=false;
	function mousePress(evt) {
		press_anchor=JSQ.clone(evt.pos);
		press_anchor_trange=JSQ.clone(m_viewport.timeRange());
		is_dragging=false;
	}
	function mouseRelease(evt) {
		var pos0=m_viewport.position();
		press_anchor=[-1,-1];
		if (!is_dragging) {
			var coord=m_viewport.pix2coord(evt.pos[0]-pos0[0],evt.pos[1]-pos0[1]);
			m_viewport.setCurrentTime(coord[0]);
		}
		is_dragging=false;
	}
	function mouseMove(evt) {
		if (press_anchor[0]>=0) {
			var dx=evt.pos[0]-press_anchor[0];
			var dy=evt.pos[1]-press_anchor[1];

			if ((Math.abs(dx)>=4)||(Math.abs(dy)>=4)) {
				is_dragging=true;
			}
			if (is_dragging) {
				var tr=press_anchor_trange;
				var x1=m_viewport.time2xpix(tr[0]);
				var x2=m_viewport.time2xpix(tr[1]);
				if (x2>x1) {
					var timepoints_per_pixel=(tr[1]-tr[0])/(x2-x1);
					var dt=-timepoints_per_pixel*dx;
					dt=Math.max(-tr[0],dt);
					dt=Math.min(m_tmax-tr[1],dt);
					var t1=Math.max(0,tr[0]+dt);
					var t2=Math.min(tr[1]+dt,m_tmax);
					m_viewport.setTimeRange(t1,t2);
					update_viewport();
				}
			}
		}
	}
	function mouseEnter(evt) {

	}
	function mouseLeave(evt) {
		press_anchor=[-1,-1];
	}
	function keyPress(evt) {
		var key0=evt.key;
		console.log(key0);
		if (key0==38) { //up
			vertical_zoom(1.2);
		}
		else if (key0==40) { //down
			vertical_zoom(1/1.2);
		}
		else if (key0==39) { //left
			//zoom(1.2);
		}
		else if (key0==40) { //right
			//zoom(1.2);
		}
		else if (key0==187) { //plus (or equals)
			zoom(1/1.2);
		}
		else if (key0==189) { //minus
			zoom(1.2);
		}
	}


	function Calculator() {
		var that=this;

    	//inputs
    	this.events_url;

    	//outputs
    	this.events=null;

    	this.run=function(opts,callback) {

    		if (!that.events_url) {
    			callback({success:true});
    			return;
    		}

    		var A=new Mda();
    		A.load(that.events_url,function(result) {
    			if (!result.success) {
    				callback({success:false,error:'Problem loading events: '+result.error});
    				return;
    			}
				that.events=A;
				callback({success:true});
    		});
	    };
    }
    var m_calculator=new Calculator();
    function prepareCalculation() {
    	m_calculator.events_url=m_events_url;
    }
    function runCalculation(opts,callback) {
    	m_calculator.run(opts,callback);
    }
    function onCalculationFinished() {
    	if (m_calculator.events) {
			setEvents(m_calculator.events);
		}
    }

	update_layout();
}

function FiringEventsOverlay(O) {
	O=O||this;
	JSQCanvasWidget(O);
	O.div().addClass('FiringEventsOverlay');

	this.setViewport=function(viewport) {
		m_viewport=viewport;
		JSQ.connect(m_viewport,'timerange_changed',O,O.update);
		JSQ.connect(m_viewport,'current_time_changed',O,O.update);
	};

	var m_viewport=null;

	O.onPaint(paint);

	function paint(painter) {
		painter.clearRect(0,0,O.width(),O.height());

		var current_time=m_viewport.currentTime();
		var yr=m_viewport.yRange();
		if (current_time>0) {
			var pt1=m_viewport.coord2pix(current_time,yr[0]);
			var pt2=m_viewport.coord2pix(current_time,yr[1]);

			var pen=painter.pen();
			pen.color='yellow'; pen.width=5;
			painter.setPen(pen);
			painter.drawLine(pt1[0],pt1[1],pt2[0],pt2[1]);

			var pen=painter.pen();
			pen.color='gray'; pen.width=1;
			painter.setPen(pen);
			painter.drawLine(pt1[0],pt1[1],pt2[0],pt2[1]);
		}
	}
}

function FiringEventsViewport(O) {
	O=O||this;
	JSQCanvasWidget(O);
	O.div().addClass('FiringEventsViewport');

	this.timeRange=function() {return [m_t1,m_t2];};
	this.setTimeRange=function(t1,t2) {_setTimeRange(t1,t2);};
	this.setYRange=function(y1,y2) {_setYRange(y1,y2);};
	this.yRange=function() {return [m_y1,m_y2];};
	this.clearEvents=function() {_clearEvents();};
	this.addEvent=function(evt) {_addEvent(evt);};
	this.inTimeRange=function(t0) {return ((m_t1<=t0)&&(t0<=m_t2));};
	this.setCurrentTime=function(t0) {if (m_current_time==t0) return; m_current_time=t0; O.update(); O.emit('current_time_changed');};
	this.currentTime=function() {return m_current_time;};
	this.coord2pix=function(t,y) {return coord2pix(t,y);};
	this.pix2coord=function(x0,y0) {return pix2coord(x0,y0);};
	this.time2xpix=function(t) {var tmp=coord2pix(t,0); return tmp[0];};
	this.xpix2time=function(x) {var tmp=pix2coord(x,0); return tmp[0];};
	
	var m_t1=0,m_t2=1;
	var m_y1=-1,m_y2=1;
	var m_events_by_label={};
	var m_current_time=0;
	var m_clear_required=true;

	O.onPaint(paint);

	function _setTimeRange(t1,t2) {
		if ((m_t1==t1)&&(m_t2==t2)) return;
		m_t1=t1;
		m_t2=t2;
		O.update();
		O.emit('timerange_changed');
	}
	function _setYRange(y1,y2) {
		if ((m_y1==y1)&&(m_y2==y2)) return;
		m_y1=y1;
		m_y2=y2;
		O.update();
	}
	function _clearEvents() {
		m_events_by_label={};
		m_clear_required=true;
		O.update();
	}
	function _addEvent(evt) {
		if (!(evt.label in m_events_by_label))
			m_events_by_label[evt.label]=[];
		m_events_by_label[evt.label].push(evt);
		O.update();
	}

	//var s_colors=['blue','green','red','magenta'];
	var s_colors=get_cluster_colors();
	function get_color_for_label(k) {
		return s_colors[k%s_colors.length];
	}

	function paint(painter) {
		if (m_clear_required)
			painter.clearRect(0,0,O.width(),O.height(),'lightgray');

		var max_diam=5;
		var min_diam=2;
		var diam=max_diam;
		if (m_t2>m_t1) diam=O.width()/(m_t2-m_t1)*50;
		diam=Math.min(max_diam,Math.max(min_diam,diam));

		for (var k in m_events_by_label) {
			painter.setBrush({color:get_color_for_label(k)});
			var evts=m_events_by_label[k];
			for (var i=0; i<evts.length; i++) {
				var E=evts[i];
				var pt0=coord2pix(E.time,E.amp);
				var rect=[pt0[0]-diam/2,pt0[1]-diam/2,diam,diam];
				painter.fillEllipse(rect);
			}	
		}

		m_events_by_label={};
		m_clear_required=false;

		/*
		if (m_current_time>0) {
			var pt1=coord2pix(m_current_time,m_y1);
			var pt2=coord2pix(m_current_time,m_y2);

			var pen=painter.pen();
			pen.color='yellow'; pen.width=5;
			painter.setPen(pen);
			painter.drawLine(pt1[0],pt1[1],pt2[0],pt2[1]);

			var pen=painter.pen();
			pen.color='gray'; pen.width=1;
			painter.setPen(pen);
			painter.drawLine(pt1[0],pt1[1],pt2[0],pt2[1]);
		}
		*/
    }

    var margx=0,margy=0;
    function coord2pix(t,y) {
    	if (m_t2<=m_t1) return [0,0];
    	if (m_y2<=m_y1) return [0,0];
    	var pctx=(t-m_t1)/(m_t2-m_t1);
    	var pcty=1 - (y-m_y1)/(m_y2-m_y1);
    	var W0=O.size()[0];
    	var H0=O.size()[1];
    	var x0=margx+pctx*(W0-margx*2);
    	var y0=margy+pcty*(H0-margy*2);
    	return [x0,y0];
    }
    function pix2coord(x0,y0) {
    	if (W0<=margx*2) return [0,0];
    	if (H0<=margy*2) return [0,0];
    	var W0=O.size()[0];
    	var H0=O.size()[1];
    	var pctx=(x0-margx)/(W0-margx*2);
    	var pcty=1 - (y0-margy)/(H0-margy*2);
    	var t=pctx*(m_t2-m_t1)+m_t1;
    	var y=pcty*(m_y2-m_y1)+m_y1;
    	return [t,y];
    }
}

function get_cluster_colors() {
	var ret=[
		[ 0.201, 0.000, 1.000 ],
	    [ 0.467, 1.000, 0.350 ],
	    [ 1.000, 0.000, 0.761 ],
	    [ 0.245, 0.700, 0.656 ],
	    [ 1.000, 0.839, 0.000 ],
	    [ 0.746, 0.350, 1.000 ],
	    [ 0.000, 1.000, 0.059 ],
	    [ 0.700, 0.245, 0.435 ],
	    [ 0.000, 0.555, 1.000 ],
	    [ 0.782, 1.000, 0.350 ],
	    [ 0.894, 0.000, 1.000 ],
	    [ 0.245, 0.700, 0.394 ],
	    [ 1.000, 0.055, 0.000 ],
	    [ 0.350, 0.353, 1.000 ],
	    [ 0.296, 1.000, 0.000 ],
	    [ 0.700, 0.245, 0.641 ],
	    [ 0.000, 1.000, 0.708 ],
	    [ 1.000, 0.747, 0.350 ],
	    [ 0.458, 0.000, 1.000 ],
	    [ 0.262, 0.700, 0.245 ]
	];
	for (var i=0; i<ret.length; i++) {
		for (var j=0; j<3; j++) {
			ret[i][j]=ret[i][j]*255;
		}
	}
	return ret;
}

function elapsed(timer) {
	return (new Date())-timer;
}
