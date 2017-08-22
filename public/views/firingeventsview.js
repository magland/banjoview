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

	JSQ.connect(O,'sizeChanged',O,update_layout);
	//JSQ.connect(mvcontext,'optionsChanged',O,O.recalculate);
	//JSQ.connect(mvcontext,'currentClusterChanged',O,update_highlighting);
	//JSQ.connect(mvcontext,'selectedClustersChanged',O,update_highlighting);

	var m_viewport=new FiringEventsViewport();
	m_viewport.setParent(O);
	var m_events_url='';
	var m_events=new Mda(0,0);
	var m_tmax=0;
	
	function update_layout() {
		var ss=O.size();
		m_viewport.setPosition([5,5]);
		m_viewport.setSize([ss[0]-10,ss[1]-10]);
	}

	function setEvents(events) {
		m_events=events;
		auto_compute_y_range_and_tmax();
		update_viewport();
	}
	function update_viewport() {
		m_viewport.clearEvents();
		for (var i=0; i<m_events.N2(); i++) {
			var time0=m_events.value(1,i);
			if (m_viewport.inTimeRange(time0)) {
				var label0=m_events.value(2,i);
				var amp0=m_events.value(3,i);
				m_viewport.addEvent({time:time0,label:label0,amp:amp0});
			}
		}
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
		var tr=m_viewport.timeRange();
		tr[1]=tr[1]*factor;
		if (tr[1]>m_tmax) tr[1]=m_tmax;
		m_viewport.setTimeRange(tr[0],tr[1]);
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
		press_anchor_trange=[m_t1,m_t2];
		is_dragging=false;
	}
	function mouseRelease(evt) {
		press_anchor=[-1,-1];
		if (!is_dragging) {
			var coord=pix2coord(evt.pos[0],evt.pos[1]);
			setCurrentTime(coord[0]);
		}
		is_dragging=false;
	}
	function mouseMove(evt) {
		/*
		if (press_anchor[0]>=0) {
			var dx=evt.pos[0]-press_anchor[0];
			var dy=evt.pos[1]-press_anchor[1];

			if ((Math.abs(dx)>=4)||(Math.abs(dy)>=4)) {
				is_dragging=true;
			}
			if (is_dragging) {
				if (columnCount()>1) {
					m_viewport_geom[0]=press_anchor_viewport_geom[0]+dx/O.size()[0];
				}
				if (rowCount()>1) {
					m_viewport_geom[1]=press_anchor_viewport_geom[1]+dy/O.size()[1];
				}
				update_layout();
			}
		}
		*/
	}
	function mouseEnter(evt) {

	}
	function mouseLeave(evt) {
		press_anchor=[-1,-1];
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

function FiringEventsViewport(O) {
	O=O||this;
	JSQCanvasWidget(O);
	O.div().addClass('FiringEventsViewport');

	this.timeRange=function() {return [m_t1,m_t2];};
	this.setTimeRange=function(t1,t2) {_setTimeRange(t1,t2);};
	this.setYRange=function(y1,y2) {_setYRange(y1,y2);};
	this.clearEvents=function() {_clearEvents();};
	this.addEvent=function(evt) {_addEvent(evt);};
	this.inTimeRange=function(t0) {return ((m_t1<=t0)&&(t0<=m_t2));};
	this.setCurrentTime=function(t0) {m_current_time=t0; update();};
	
	var m_t1=0,m_t2=100000;
	var m_y1=-1,m_y2=1;
	var m_events_by_label={};
	var m_current_time=8000;

	O.onPaint(paint);

	function _setTimeRange(t1,t2) {
		if ((m_t1==t1)&&(m_t2==t2)) return;
		m_t1=t1;
		m_t2=t2;
		O.update();
	}
	function _setYRange(y1,y2) {
		if ((m_y1==y1)&&(m_y2==y2)) return;
		m_y1=y1;
		m_y2=y2;
		O.update();
	}
	function _clearEvents() {
		m_events_by_label={};
		O.update();
	}
	function _addEvent(evt) {
		if (!(evt.label in m_events_by_label))
			m_events_by_label[evt.label]=[];
		m_events_by_label[evt.label].push(evt);
		O.update();
	}

	var s_colors=['blue','green','red','magenta'];
	function get_color_for_label(k) {
		return s_colors[k%s_colors.length];
	}

	function paint(painter) {
		painter.fillRect(0,0,O.width(),O.height(),'lightgray');

		var max_diam=5;
		var min_diam=2;
		var diam=max_diam;
		if (m_t2>m_t1) diam=O.width()/(m_t2-m_t1)*50;
		diam=Math.min(max_diam,Math.max(min_diam,diam));

		for (var k in m_events_by_label) {
			painter.setBrush({color:get_color_for_label(k)});
			var evts=m_events_by_label[k];
			var increment=Math.max(1,Math.floor(evts.length/1000));
			for (var i=0; i<evts.length; i+=increment) {
				var E=evts[i];
				var pt0=coord2pix(E.time,E.amp);
				var rect=[pt0[0]-diam/2,pt0[1]-diam/2,diam,diam];
				painter.fillEllipse(rect);
			}	
		}

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

		
		
		/*
		var template0=m_CD.template0;
		var M=template0.N1();
		var T=template0.N2();
		var W0=O.width();
		var H0=O.height();
		var Tmid = Math.floor((T + 1) / 2) - 1;
		var top_height=20;
		var bottom_height=30;
		var xmargin=1,ymargin=8;

		var rect2=[0+xmargin,0+ymargin,W0-xmargin*2,H0-ymargin*2];
		m_top_rect=[rect2[0],rect2[1],rect2[2],top_height];
		m_template_rect=[rect2[0],rect2[1]+top_height,rect2[2],rect2[3]-bottom_height-top_height];		
		m_bottom_rect=[rect2[0],rect2[1]+rect2[3]-bottom_height,rect2[2],bottom_height];

		//firing rate disk
	    {
	    	var disksize=get_disksize_for_firing_rate(m_CD.firing_rate);
	    	painter.setBrush({color:'lightgray'});
	    	var ww=Math.min(m_bottom_rect[2],m_bottom_rect[3])*disksize;
	    	var tmp=[m_bottom_rect[0],m_bottom_rect[1]+m_bottom_rect[3]-ww,ww,ww];
	    	tmp[0]=tmp[0]+(m_bottom_rect[2]-ww)/2;
	    	tmp[1]=tmp[1]-(m_bottom_rect[3]-ww)/2;
	    	painter.fillEllipse(tmp);
	    }

	    // group label
		{
			painter.setBrush({color:'gray'});
			var group_label=m_CD.k;
			var txt=group_label;
			var font=painter.font();
	        font["pixel-size"]=12;
	        painter.setFont(font);

	        var pen=painter.pen();
	        pen.width=1;
	        pen.color='darkblue';
	        painter.setPen(pen);
	        painter.drawText(m_top_rect, {AlignCenter:1,AlignBottom:1}, txt);
	    }

		{
			//the midline
			var view_background=[245,245,245];
			var midline_color=lighten(view_background,0.9);
			var pt0=coord2pix(0,Tmid,0);
			var pen=painter.pen(); pen.color=midline_color; pen.width=1;
			painter.setPen(pen);
			painter.drawLine(pt0[0],0,pt0[0],H0);
		}

		// render the events
		for (var m=0; m<M; m++) {
			var col=get_channel_color(m+1);
			var pen=painter.pen(); pen.color=col; pen.width=1;
			painter.setPen(pen);
			{
				//the template
				var ppath=new JSQPainterPath();
				for (var t=0; t<T; t++) {
					var val=template0.value(m,t);
					var pt=coord2pix(m,t,val);
					if (t===0) ppath.moveTo(pt);
					else ppath.lineTo(pt);
				}
				painter.drawPath(ppath);
			}
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
    	if (m_t2<=m_t1) return [0,0];
    	if (m_y2<=m_y1) return [0,0];

/*
    	var
    	var pctx=(t-m_t1)/(m_t2-m_t1);
    	var pcty=1 - (y-m_y1)/(m_y2-m_y1);
    	var W0=O.size()[0];
    	var H0=O.size()[1];
    	var margx=0,margy=0;
    	var x0=margx+pctx*(W0-margx*2);
    	var y0=margy+pcty*(H0-margy*2);
    	return [x0,y0];*/
    }

	
}


/*
function FiringEventsViewPanel(O) {
	O=O||this;
	JSQCanvasWidget(O);
	O.div().addClass('FiringEventsViewPanel');

	this.setChannelColors=function(list) {m_channel_colors=JSQ.clone(list);};
	this.setTemplate=function(template) {m_template=template; O.update();};
	this.setVerticalScaleFactor=function(factor) {
		m_vert_scale_factor=factor;
		O.update();
	};

	O.onPaint(paint);

	function paint(painter) {
		var M=m_template.N1();
		var T=m_template.N2();
		var W0=O.width();
		var H0=O.height();
		var Tmid = Math.floor((T + 1) / 2) - 1;

		{
			//the midline
			var view_background=[245,245,245];
			var midline_color=lighten(view_background,0.9);
			var pt0=coord2pix(0,Tmid,0);
			var pen=painter.pen(); pen.color=midline_color; pen.width=1;
			painter.setPen(pen);
			painter.drawLine(pt0[0],0,pt0[0],H0);
		}

		for (var m=0; m<M; m++) {
			var col=get_channel_color(m+1);
			var pen=painter.pen(); pen.color=col; pen.width=1;
			painter.setPen(pen);
			{
				//the template
				var ppath=new JSQPainterPath();
				for (var t=0; t<T; t++) {
					var val=m_template.value(m,t);
					var pt=coord2pix(m,t,val);
					if (t===0) ppath.moveTo(pt);
					else ppath.lineTo(pt);
				}
				painter.drawPath(ppath);
			}
		}
    }

    function coord2pix(m,t,val) {
    	var M=m_template.N1();
    	var T=m_template.N2();
    	var W0=O.size()[0];
    	var H0=O.size()[1];
    	var pctx=0,pcty=0;
    	if (T) pctx=(t+0.5)/T;
    	if (M) pcty=(m+0.5-val*m_vert_scale_factor)/M;
    	var margx=4,margy=5;
    	var x0=margx+pctx*(W0-margx*2);
    	var y0=margy+pcty*(H0-margy*2);
    	return [x0,y0];
    }

	var m_template=new Mda();
	var m_vert_scale_factor=1;
	var m_channel_colors=[];

	function lighten(col,val) {
		var ret=[col[0]*val,col[1]*val,col[2]*val];
		ret=[Math.min(255,ret[0]),Math.min(255,ret[1]),Math.min(255,ret[2])];
		return ret;
	}

	function get_channel_color(m) {
		if (m <= 0)
	        return [0,0,0];
	    if (m_channel_colors.length===0)
	        return [0,0,0];
	    return m_channel_colors[(m - 1) % m_channel_colors.length];	
	}
}

*/