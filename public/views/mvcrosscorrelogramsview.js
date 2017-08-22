function MVCrossCorrelogramsView(O,mvcontext) {
	O=O||this;
	var pair_mode=true;
	MVHistogramGrid(O,mvcontext,pair_mode);
	O.div().addClass('MVCrossCorrelogramsView');

	this.setHistograms=function(histograms) {return setHistograms(histograms);};
	this.setHistogramsUrl=function(url) {m_histograms_url=url;};

	O.prepareCalculation=function() {prepareCalculation();};
	O.runCalculation=function(opts,callback) {runCalculation(opts,callback);};
	O.onCalculationFinished=function() {onCalculationFinished();};

	var m_histograms={};
	var m_histograms_url='';

	var m_calculator=new MVCrossCorrelogramsViewCalculator();
	function prepareCalculation() {
		m_calculator.histograms_url=m_histograms_url;
	}
	function runCalculation(opts,callback) {
		m_calculator.run(opts,callback);
	}
	function onCalculationFinished() {
		if (m_calculator.histograms) {
			setHistograms(m_calculator.histograms);
		}
	}

	function setHistograms(histograms) {
		m_histograms=JSON.parse(JSON.stringify(histograms));

		var histogram_views=[];
		for (var i in m_histograms) {
			var HH=m_histograms[i];
			var k1=HH.k1||0;
			var k2=HH.k2||0;
			var dt_min_msec=HH.dt_min_msec||0;
			var bin_size_msec=HH.bin_size_msec||1;
			var counts=HH.counts||[];
			var HV=new HistogramView();
			var data0=make_data_to_generate_histogram(dt_min_msec,bin_size_msec,counts);
			HV.setData(data0);
			HV.setBins(HH.dt_min_msec,HH.dt_min_msec+counts.length*HH.bin_size_msec,counts.length);
			HV.setProperty('k',k1);
			HV.setProperty('k1',k1);
			HV.setProperty('k2',k2);
			HV.setTitle(k1+'/'+k2);
			histogram_views.push(HV);
		}

    	O.setHistogramViews(histogram_views);
	}	

	function make_data_to_generate_histogram(tmin,bin_size,counts) {
		var ret=[];
		for (var i=0; i<counts.length; i++) {
			var val=tmin+bin_size*(i+0.5);
			for (var j=0; j<counts[i]; j++) {
				ret.push(val);
			}
		}
		return ret;
	}
}

function MVCrossCorrelogramsViewCalculator() {
	var that=this;

	//input
	this.histograms_url='';

	//output
	this.histograms=null;

	this.run=function(opts,callback) {
		if (!that.histograms_url) {
			callback({success:true});
			return;
		}

		$.get(that.histograms_url,function(txt) {
			console.log(txt);
			var obj=JSON.parse(txt);
			that.histograms=obj.histograms||null;
			callback({success:true});
		});

		
	};
}
