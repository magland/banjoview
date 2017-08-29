function ProcessorManager(O) {
	O=O||this;
	JSQObject(O);

	this.loadSpec=function() {loadSpec();};
	this.processorNames=function() {return processorNames();};
	this.processorSpec=function(processor_name) {return processorSpec(processor_name);};

	var m_processor_specs={};

	function loadSpec(callback) {
		m_processor_specs=processor_manager_spec;
		if (callback) callback();
	}
	function processorNames() {
		var ret=[];
		var processors=m_processor_specs.processors||[];
		for (var i=0; i<processors.length; i++) {
			ret.push(processors[i].name);
		}
		return ret;
	}
	function processorSpec(processor_name) {
		var processors=m_processor_specs.processors||[];
		for (var i=0; i<processors.length; i++) {
			var P=processors[i];
			if (P.name==processor_name) return P;
		}
		return null;
	}
}

var processor_manager_spec={
    "processors": [
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp bandpass_filter $(arguments)",
            "inputs": [
                {
                    "name": "timeseries"
                }
            ],
            "name": "bandpass_filter",
            "outputs": [
                {
                    "name": "timeseries_out"
                }
            ],
            "parameters": [
                {
                    "name": "samplerate",
                    "optional": false
                },
                {
                    "name": "freq_min",
                    "optional": false
                },
                {
                    "name": "freq_max",
                    "optional": false
                },
                {
                    "name": "freq_wid",
                    "optional": true
                }
            ],
            "version": "0.21"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/dev/bandpass_filter_aa.js.mp bandpass_filter_aa $(arguments)",
            "inputs": [
                {
                    "name": "timeseries"
                }
            ],
            "name": "bandpass_filter_aa",
            "outputs": [
                {
                    "name": "timeseries_out"
                }
            ],
            "parameters": [
                {
                    "name": "samplerate",
                    "optional": false
                },
                {
                    "name": "freq_min",
                    "optional": false
                },
                {
                    "name": "freq_max",
                    "optional": false
                },
                {
                    "name": "freq_wid",
                    "optional": true
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "$(basepath)/run_matlab.sh $(basepath) \"opts=struct('samplerate',$samplerate$,'freq_min',$freq_min$,'freq_max',$freq_max$); run_mountainlab_setup; bandpass_filter_kernel('$timeseries$','$timeseries_out$',opts);\"",
            "inputs": [
                {
                    "name": "timeseries"
                }
            ],
            "name": "bandpass_filter_kernel",
            "outputs": [
                {
                    "name": "timeseries_out"
                }
            ],
            "parameters": [
                {
                    "name": "samplerate",
                    "optional": false
                },
                {
                    "name": "freq_min",
                    "optional": false
                },
                {
                    "name": "freq_max",
                    "optional": false
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort3/bin/mountainsort3.mp banjoview.cross_correlograms $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                }
            ],
            "name": "banjoview.cross_correlograms",
            "outputs": [
                {
                    "description": "",
                    "name": "correlograms_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "samplerate",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "max_dt_msec",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "bin_size_msec",
                    "optional": false
                },
                {
                    "default_value": "autocorrelograms",
                    "description": "autocorrelograms or matrix_of_cross_correlograms",
                    "name": "mode",
                    "optional": true
                },
                {
                    "default_value": "",
                    "description": "",
                    "name": "clusters",
                    "optional": true
                }
            ],
            "version": "0.11"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp compute_amplitudes $(arguments)",
            "inputs": [
                {
                    "name": "timeseries"
                },
                {
                    "name": "firings"
                }
            ],
            "name": "compute_amplitudes",
            "outputs": [
                {
                    "name": "firings_out"
                }
            ],
            "parameters": [
            ],
            "version": "0.22"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp compute_templates $(arguments)",
            "inputs": [
                {
                    "name": "timeseries"
                },
                {
                    "name": "firings"
                }
            ],
            "name": "compute_templates",
            "outputs": [
                {
                    "name": "templates"
                }
            ],
            "parameters": [
                {
                    "name": "clip_size",
                    "optional": false
                }
            ],
            "version": "0.11"
        },
        {
            "description": "",
            "exe_command": "cp $input$ $output$",
            "inputs": [
                {
                    "name": "input"
                }
            ],
            "name": "copy2",
            "outputs": [
                {
                    "name": "output"
                }
            ],
            "parameters": [
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "$(basepath)/copy_with_delay.sh $input$ $output$",
            "inputs": [
                {
                    "name": "input"
                }
            ],
            "name": "copy_with_delay",
            "outputs": [
                {
                    "name": "output"
                }
            ],
            "parameters": [
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp create_multiscale_timeseries $(arguments)",
            "inputs": [
                {
                    "name": "timeseries"
                }
            ],
            "name": "create_multiscale_timeseries",
            "outputs": [
                {
                    "name": "timeseries_out"
                }
            ],
            "parameters": [
            ],
            "version": "0.17"
        },
        {
            "description": "Create a spectrogram from timeseries eeg data",
            "exe_command": "$(basepath)/run_in_octave.sh 'addpath('\\''$(basepath)/octave'\\''); opts.time_resolution=$time_resolution$; eeg_spectrogram('\\''$timeseries$'\\'','\\''$spectrogram_out$'\\'',opts);'",
            "inputs": [
                {
                    "name": "timeseries"
                }
            ],
            "misc_info": "Escape single quotes in JSON octave command using '\\''",
            "name": "eeg-spectrogram",
            "outputs": [
                {
                    "name": "spectrogram_out"
                }
            ],
            "parameters": [
                {
                    "name": "time_resolution",
                    "optional": false
                }
            ],
            "version": "0.11"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp example $(arguments)",
            "inputs": [
            ],
            "name": "example",
            "outputs": [
            ],
            "parameters": [
                {
                    "name": "param1",
                    "optional": false
                },
                {
                    "name": "param2",
                    "optional": true
                }
            ],
            "version": ""
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp extract_channel_values $(arguments)",
            "inputs": [
                {
                    "name": "timeseries"
                },
                {
                    "name": "firings"
                }
            ],
            "name": "extract_channel_values",
            "outputs": [
                {
                    "name": "values"
                }
            ],
            "parameters": [
                {
                    "name": "channels",
                    "optional": false
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp extract_clips $(arguments)",
            "inputs": [
                {
                    "name": "timeseries"
                },
                {
                    "name": "firings"
                }
            ],
            "name": "extract_clips",
            "outputs": [
                {
                    "name": "clips"
                }
            ],
            "parameters": [
                {
                    "name": "clip_size",
                    "optional": false
                },
                {
                    "name": "channels",
                    "optional": true
                },
                {
                    "name": "t1",
                    "optional": true
                },
                {
                    "name": "t2",
                    "optional": true
                }
            ],
            "version": "0.13"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp extract_clips_features $(arguments)",
            "inputs": [
                {
                    "name": "timeseries"
                },
                {
                    "name": "firings"
                }
            ],
            "name": "extract_clips_features",
            "outputs": [
                {
                    "name": "features"
                }
            ],
            "parameters": [
                {
                    "name": "clip_size",
                    "optional": false
                },
                {
                    "name": "num_features",
                    "optional": false
                },
                {
                    "name": "subtract_mean",
                    "optional": true
                }
            ],
            "version": "0.12"
        },
        {
            "description": "",
            "exe_command": "$(basepath)/run_matlab.sh $(basepath) \"opts=struct('t1',$t1$,'t2',$t2$); run_mountainlab_setup; extract_time_chunk('$timeseries$','$timeseries_out$',opts);\"",
            "inputs": [
                {
                    "name": "timeseries"
                }
            ],
            "name": "extract_time_chunk",
            "outputs": [
                {
                    "name": "timeseries_out"
                }
            ],
            "parameters": [
                {
                    "name": "t1",
                    "optional": false
                },
                {
                    "name": "t2",
                    "optional": false
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp firings_subset $(arguments)",
            "inputs": [
                {
                    "name": "firings"
                }
            ],
            "name": "firings_subset",
            "outputs": [
                {
                    "name": "firings_out"
                }
            ],
            "parameters": [
                {
                    "name": "labels",
                    "optional": false
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp mask_out_artifacts $(arguments)",
            "inputs": [
                {
                    "name": "timeseries"
                }
            ],
            "name": "mask_out_artifacts",
            "outputs": [
                {
                    "name": "timeseries_out"
                }
            ],
            "parameters": [
                {
                    "name": "threshold",
                    "optional": false
                },
                {
                    "name": "interval_size",
                    "optional": false
                }
            ],
            "version": "0.31"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.apply_timestamp_offset $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                }
            ],
            "name": "mountainsort.apply_timestamp_offset",
            "outputs": [
                {
                    "description": "",
                    "name": "firings_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "timestamp_offset",
                    "optional": false
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.apply_whitening_matrix $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "whitening_matrix",
                    "optional": false
                }
            ],
            "name": "mountainsort.apply_whitening_matrix",
            "outputs": [
                {
                    "description": "",
                    "name": "timeseries_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "default_value": 0,
                    "description": "",
                    "name": "quantization_unit",
                    "optional": true
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.bandpass_filter $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                }
            ],
            "name": "mountainsort.bandpass_filter",
            "outputs": [
                {
                    "description": "",
                    "name": "timeseries_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "samplerate",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "freq_min",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "freq_max",
                    "optional": false
                },
                {
                    "default_value": 1000,
                    "description": "",
                    "name": "freq_wid",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "description": "",
                    "name": "quantization_unit",
                    "optional": true
                },
                {
                    "default_value": 1,
                    "description": "",
                    "name": "subsample_factor",
                    "optional": true
                }
            ],
            "version": "0.18"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.cluster_metrics $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                }
            ],
            "name": "mountainsort.cluster_metrics",
            "outputs": [
                {
                    "description": "",
                    "name": "cluster_metrics_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "samplerate",
                    "optional": false
                }
            ],
            "version": "0.11"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.combine_cluster_metrics $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "metrics_list",
                    "optional": false
                }
            ],
            "name": "mountainsort.combine_cluster_metrics",
            "outputs": [
                {
                    "description": "",
                    "name": "metrics_out",
                    "optional": false
                }
            ],
            "parameters": [
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort3/bin/mountainsort3.mp mountainsort.combine_firing_segments $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings_list",
                    "optional": false
                }
            ],
            "name": "mountainsort.combine_firing_segments",
            "outputs": [
                {
                    "description": "",
                    "name": "firings_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "default_value": 60,
                    "description": "",
                    "name": "clip_size",
                    "optional": true
                },
                {
                    "default_value": 0.59999999999999998,
                    "description": "",
                    "name": "match_score_threshold",
                    "optional": true
                },
                {
                    "default_value": 10,
                    "description": "",
                    "name": "offset_search_radius",
                    "optional": true
                }
            ],
            "version": "0.13"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.combine_firings $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "firings_list",
                    "optional": false
                }
            ],
            "name": "mountainsort.combine_firings",
            "outputs": [
                {
                    "description": "",
                    "name": "firings_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "default_value": "true",
                    "description": "",
                    "name": "increment_labels",
                    "optional": true
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.compute_amplitudes $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "event_times",
                    "optional": false
                }
            ],
            "name": "mountainsort.compute_amplitudes",
            "outputs": [
                {
                    "description": "",
                    "name": "amplitudes_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "central_channel",
                    "optional": false
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.compute_templates $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                }
            ],
            "name": "mountainsort.compute_templates",
            "outputs": [
                {
                    "description": "",
                    "name": "templates_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "clip_size",
                    "optional": false
                },
                {
                    "default_value": "",
                    "description": "Comma-separated list of clusters to inclue",
                    "name": "clusters",
                    "optional": true
                }
            ],
            "version": "0.11"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.compute_whitening_matrix $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries_list",
                    "optional": false
                }
            ],
            "name": "mountainsort.compute_whitening_matrix",
            "outputs": [
                {
                    "description": "",
                    "name": "whitening_matrix_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "channels",
                    "optional": true
                }
            ],
            "version": "0.11"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.concat_event_times $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "event_times_list",
                    "optional": false
                }
            ],
            "name": "mountainsort.concat_event_times",
            "outputs": [
                {
                    "description": "",
                    "name": "event_times_out",
                    "optional": false
                }
            ],
            "parameters": [
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.concat_firings $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "firings_list",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "timeseries_list",
                    "optional": true
                }
            ],
            "name": "mountainsort.concat_firings",
            "outputs": [
                {
                    "description": "",
                    "name": "firings_out",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "timeseries_out",
                    "optional": true
                }
            ],
            "parameters": [
            ],
            "version": "0.13"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort3/bin/mountainsort3.mp mountainsort.concat_timeseries $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries_list",
                    "optional": false
                }
            ],
            "name": "mountainsort.concat_timeseries",
            "outputs": [
                {
                    "description": "",
                    "name": "timeseries_out",
                    "optional": false
                }
            ],
            "parameters": [
            ],
            "version": "0.11"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.confusion_matrix $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "firings1",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings2",
                    "optional": false
                }
            ],
            "name": "mountainsort.confusion_matrix",
            "outputs": [
                {
                    "description": "",
                    "name": "confusion_matrix_out",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "matched_firings_out",
                    "optional": true
                },
                {
                    "description": "",
                    "name": "label_map_out",
                    "optional": true
                },
                {
                    "description": "",
                    "name": "firings2_relabeled_out",
                    "optional": true
                },
                {
                    "description": "",
                    "name": "firings2_relabel_map_out",
                    "optional": true
                }
            ],
            "parameters": [
                {
                    "default_value": 30,
                    "description": "",
                    "name": "max_matching_offset",
                    "optional": true
                },
                {
                    "default_value": "false",
                    "description": "",
                    "name": "relabel_firings2",
                    "optional": true
                }
            ],
            "version": "0.17"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.consolidate_clusters $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "event_times",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "labels",
                    "optional": false
                }
            ],
            "name": "mountainsort.consolidate_clusters",
            "outputs": [
                {
                    "description": "",
                    "name": "labels_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "central_channel",
                    "optional": false
                },
                {
                    "default_value": 0.90000000000000002,
                    "description": "",
                    "name": "consolidation_factor",
                    "optional": true
                }
            ],
            "version": "0.13"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.create_firings $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "event_times",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "labels",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "amplitudes",
                    "optional": true
                }
            ],
            "name": "mountainsort.create_firings",
            "outputs": [
                {
                    "description": "",
                    "name": "firings_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "central_channel",
                    "optional": false
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.detect_events $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                }
            ],
            "name": "mountainsort.detect_events",
            "outputs": [
                {
                    "description": "",
                    "name": "event_times_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "central_channel",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "detect_threshold",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "detect_interval",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "sign",
                    "optional": false
                },
                {
                    "default_value": 1,
                    "description": "",
                    "name": "subsample_factor",
                    "optional": true
                }
            ],
            "version": "0.13"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.extract_clips $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "event_times",
                    "optional": false
                }
            ],
            "name": "mountainsort.extract_clips",
            "outputs": [
                {
                    "description": "",
                    "name": "clips_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "clip_size",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "channels",
                    "optional": true
                }
            ],
            "version": "0.11"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort3/bin/mountainsort3.mp mountainsort.extract_firings $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "metrics",
                    "optional": true
                }
            ],
            "name": "mountainsort.extract_firings",
            "outputs": [
                {
                    "description": "",
                    "name": "firings_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "default_value": "",
                    "description": "",
                    "name": "exclusion_tags",
                    "optional": true
                },
                {
                    "default_value": "",
                    "description": "",
                    "name": "clusters",
                    "optional": true
                },
                {
                    "default_value": "",
                    "description": "",
                    "name": "t1",
                    "optional": true
                },
                {
                    "default_value": "",
                    "description": "",
                    "name": "t2",
                    "optional": true
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.extract_geom_channels $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "geom",
                    "optional": false
                }
            ],
            "name": "mountainsort.extract_geom_channels",
            "outputs": [
                {
                    "description": "",
                    "name": "geom_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "channels",
                    "optional": false
                }
            ],
            "version": "0.11"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.extract_neighborhood_timeseries $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                }
            ],
            "name": "mountainsort.extract_neighborhood_timeseries",
            "outputs": [
                {
                    "description": "",
                    "name": "timeseries_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "channels",
                    "optional": false
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.extract_segment_firings $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                }
            ],
            "name": "mountainsort.extract_segment_firings",
            "outputs": [
                {
                    "description": "",
                    "name": "firings_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "t1",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "t2",
                    "optional": false
                }
            ],
            "version": "0.11"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.extract_segment_timeseries $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                }
            ],
            "name": "mountainsort.extract_segment_timeseries",
            "outputs": [
                {
                    "description": "",
                    "name": "timeseries_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "t1",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "t2",
                    "optional": false
                },
                {
                    "default_value": "",
                    "description": "Comma-separated list of channels to extract",
                    "name": "channels",
                    "optional": true
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.extract_time_interval $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries_list",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                }
            ],
            "name": "mountainsort.extract_time_interval",
            "outputs": [
                {
                    "description": "",
                    "name": "timeseries_out",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "t1",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "t2",
                    "optional": false
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.fit_stage $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                }
            ],
            "name": "mountainsort.fit_stage",
            "outputs": [
                {
                    "description": "",
                    "name": "firings_out",
                    "optional": false
                }
            ],
            "parameters": [
            ],
            "version": "0.17"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.generate_background_dataset $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "event_times",
                    "optional": false
                }
            ],
            "name": "mountainsort.generate_background_dataset",
            "outputs": [
                {
                    "description": "",
                    "name": "timeseries_out",
                    "optional": false
                }
            ],
            "parameters": [
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.isolation_metrics $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                }
            ],
            "name": "mountainsort.isolation_metrics",
            "outputs": [
                {
                    "description": "",
                    "name": "metrics_out",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "pair_metrics_out",
                    "optional": true
                }
            ],
            "parameters": [
                {
                    "default_value": "false",
                    "description": "",
                    "name": "compute_bursting_parents",
                    "optional": true
                }
            ],
            "version": "0.15j"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.link_segments $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings_prev",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "Kmax_prev",
                    "optional": false
                }
            ],
            "name": "mountainsort.link_segments",
            "outputs": [
                {
                    "description": "",
                    "name": "firings_out",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "Kmax_out",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings_subset_out",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "Kmax_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "t1",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "t2",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "t1_prev",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "t2_prev",
                    "optional": false
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.load_test $(arguments)",
            "inputs": [
            ],
            "name": "mountainsort.load_test",
            "outputs": [
                {
                    "description": "",
                    "name": "stats_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "num_read_bytes",
                    "optional": true
                },
                {
                    "description": "",
                    "name": "num_write_bytes",
                    "optional": true
                },
                {
                    "description": "",
                    "name": "num_cpu_ops",
                    "optional": true
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.misc_test $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "dir",
                    "optional": false
                }
            ],
            "name": "mountainsort.misc_test",
            "outputs": [
                {
                    "description": "",
                    "name": "info_out",
                    "optional": false
                }
            ],
            "parameters": [
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort3/bin/mountainsort3.mp mountainsort.mountainsort3 $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "geom",
                    "optional": false
                }
            ],
            "name": "mountainsort.mountainsort3",
            "outputs": [
                {
                    "description": "",
                    "name": "firings_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "default_value": 0,
                    "description": "",
                    "name": "adjacency_radius",
                    "optional": true
                },
                {
                    "default_value": "true",
                    "description": "",
                    "name": "consolidate_clusters",
                    "optional": true
                },
                {
                    "default_value": 0.90000000000000002,
                    "description": "",
                    "name": "consolidation_factor",
                    "optional": true
                },
                {
                    "default_value": 50,
                    "description": "",
                    "name": "clip_size",
                    "optional": true
                },
                {
                    "default_value": 10,
                    "description": "",
                    "name": "detect_interval",
                    "optional": true
                },
                {
                    "default_value": 3,
                    "description": "",
                    "name": "detect_threshold",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "description": "",
                    "name": "detect_sign",
                    "optional": true
                },
                {
                    "default_value": "true",
                    "description": "",
                    "name": "merge_across_channels",
                    "optional": true
                },
                {
                    "default_value": "true",
                    "description": "",
                    "name": "fit_stage",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "description": "Start timepoint to do the sorting (default 0 means start at beginning)",
                    "name": "t1",
                    "optional": true
                },
                {
                    "default_value": -1,
                    "description": "End timepoint for sorting (default -1 means go to end of timeseries)",
                    "name": "t2",
                    "optional": true
                }
            ],
            "version": "0.14"
        },
        {
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/algs/mountainsort2.js.mp mountainsort.ms2_001 $(arguments)",
            "inputs": [
                {
                    "description": "preprocessed timeseries (M x N)",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "Timestamps for all events",
                    "name": "prescribed_event_times",
                    "optional": true
                },
                {
                    "description": "Timestamps for all events",
                    "name": "event_times",
                    "optional": true
                },
                {
                    "description": "Amplitudes for all events",
                    "name": "amplitudes",
                    "optional": true
                },
                {
                    "description": "Event clips (perhaps whitened)",
                    "name": "clips",
                    "optional": true
                }
            ],
            "name": "mountainsort.ms2_001",
            "outputs": [
                {
                    "name": "event_times_out",
                    "optional": true
                },
                {
                    "name": "amplitudes_out",
                    "optional": true
                },
                {
                    "name": "clips_out",
                    "optional": true
                },
                {
                    "description": "The labeled events (R x L), R=3 or 4",
                    "name": "firings_out",
                    "optional": true
                },
                {
                    "description": "",
                    "name": "whitening_matrix_out",
                    "optional": true
                }
            ],
            "parameters": [
                {
                    "description": "sample rate for timeseries",
                    "name": "samplerate",
                    "optional": false
                },
                {
                    "default_value": 3600,
                    "name": "segment_duration_sec",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "name": "num_threads",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "name": "central_channel",
                    "optional": true
                },
                {
                    "default_value": 2,
                    "name": "clip_size_msec",
                    "optional": true
                },
                {
                    "default_value": 1,
                    "name": "detect_interval_msec",
                    "optional": true
                },
                {
                    "default_value": 3,
                    "name": "detect_threshold",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "name": "detect_sign",
                    "optional": true
                },
                {
                    "default_value": "false",
                    "name": "whiten",
                    "optional": true
                },
                {
                    "default_value": "false",
                    "name": "consolidate_clusters",
                    "optional": true
                },
                {
                    "default_value": "false",
                    "name": "fit_stage",
                    "optional": true
                },
                {
                    "default_value": 1,
                    "name": "subsample_factor",
                    "optional": true
                },
                {
                    "default_value": "",
                    "name": "channels",
                    "optional": true
                }
            ],
            "version": "0.29"
        },
        {
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/algs/mountainsort2.js.mp mountainsort.ms2_001_multichannel $(arguments)",
            "inputs": [
                {
                    "description": "preprocessed timeseries (M x N)",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "Timestamps for all events",
                    "name": "prescribed_event_times",
                    "optional": true
                },
                {
                    "description": "Timestamps for all events",
                    "name": "event_times",
                    "optional": true
                },
                {
                    "description": "Amplitudes for all events",
                    "name": "amplitudes",
                    "optional": true
                },
                {
                    "description": "Event clips (perhaps whitened)",
                    "name": "clips",
                    "optional": true
                },
                {
                    "name": "geom"
                }
            ],
            "name": "mountainsort.ms2_001_multichannel",
            "outputs": [
                {
                    "name": "event_times_out",
                    "optional": true
                },
                {
                    "name": "amplitudes_out",
                    "optional": true
                },
                {
                    "name": "clips_out",
                    "optional": true
                },
                {
                    "description": "The labeled events (R x L), R=3 or 4",
                    "name": "firings_out",
                    "optional": true
                },
                {
                    "description": "",
                    "name": "whitening_matrix_out",
                    "optional": true
                }
            ],
            "parameters": [
                {
                    "description": "sample rate for timeseries",
                    "name": "samplerate",
                    "optional": false
                },
                {
                    "default_value": 3600,
                    "name": "segment_duration_sec",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "name": "num_threads",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "name": "central_channel",
                    "optional": true
                },
                {
                    "default_value": 2,
                    "name": "clip_size_msec",
                    "optional": true
                },
                {
                    "default_value": 1,
                    "name": "detect_interval_msec",
                    "optional": true
                },
                {
                    "default_value": 3,
                    "name": "detect_threshold",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "name": "detect_sign",
                    "optional": true
                },
                {
                    "default_value": "false",
                    "name": "whiten",
                    "optional": true
                },
                {
                    "default_value": "false",
                    "name": "consolidate_clusters",
                    "optional": true
                },
                {
                    "default_value": "false",
                    "name": "fit_stage",
                    "optional": true
                },
                {
                    "default_value": 1,
                    "name": "subsample_factor",
                    "optional": true
                },
                {
                    "default_value": "",
                    "name": "channels",
                    "optional": true
                },
                {
                    "name": "adjacency_radius"
                }
            ],
            "version": "0.29-0.15"
        },
        {
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/algs/mountainsort2.js.mp mountainsort.ms2_002 $(arguments)",
            "inputs": [
                {
                    "description": "preprocessed timeseries (M x N)",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "Timestamps for all events",
                    "name": "prescribed_event_times",
                    "optional": true
                },
                {
                    "description": "Timestamps for all events",
                    "name": "event_times",
                    "optional": true
                },
                {
                    "description": "Amplitudes for all events",
                    "name": "amplitudes",
                    "optional": true
                },
                {
                    "description": "Event clips (from preprocessed timeseries)",
                    "name": "clips",
                    "optional": true
                }
            ],
            "name": "mountainsort.ms2_002",
            "outputs": [
                {
                    "name": "event_times_out",
                    "optional": true
                },
                {
                    "name": "amplitudes_out",
                    "optional": true
                },
                {
                    "name": "clips_out",
                    "optional": true
                },
                {
                    "description": "The labeled events (R x L), R=3 or 4",
                    "name": "firings_out",
                    "optional": true
                }
            ],
            "parameters": [
                {
                    "description": "sample rate for timeseries",
                    "name": "samplerate",
                    "optional": false
                },
                {
                    "default_value": 3600,
                    "name": "segment_duration_sec",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "name": "num_threads",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "name": "central_channel",
                    "optional": true
                },
                {
                    "default_value": 2,
                    "name": "clip_size_msec",
                    "optional": true
                },
                {
                    "default_value": 1,
                    "name": "detect_interval_msec",
                    "optional": true
                },
                {
                    "default_value": 3,
                    "name": "detect_threshold",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "name": "detect_sign",
                    "optional": true
                },
                {
                    "default_value": "false",
                    "name": "consolidate_clusters",
                    "optional": true
                },
                {
                    "default_value": 0.90000000000000002,
                    "name": "consolidation_factor",
                    "optional": true
                },
                {
                    "default_value": "false",
                    "name": "fit_stage",
                    "optional": true
                },
                {
                    "default_value": 1,
                    "name": "subsample_factor",
                    "optional": true
                },
                {
                    "default_value": "",
                    "name": "channels",
                    "optional": true
                }
            ],
            "version": "0.1"
        },
        {
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/algs/mountainsort2.js.mp mountainsort.ms2_002_multineighborhood $(arguments)",
            "inputs": [
                {
                    "description": "preprocessed timeseries (M x N)",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "Timestamps for all events",
                    "name": "prescribed_event_times",
                    "optional": true
                },
                {
                    "description": "Timestamps for all events",
                    "name": "event_times",
                    "optional": true
                },
                {
                    "description": "Amplitudes for all events",
                    "name": "amplitudes",
                    "optional": true
                },
                {
                    "description": "Event clips (from preprocessed timeseries)",
                    "name": "clips",
                    "optional": true
                },
                {
                    "name": "geom",
                    "optional": true
                }
            ],
            "name": "mountainsort.ms2_002_multineighborhood",
            "outputs": [
                {
                    "name": "event_times_out",
                    "optional": true
                },
                {
                    "name": "amplitudes_out",
                    "optional": true
                },
                {
                    "name": "clips_out",
                    "optional": true
                },
                {
                    "description": "The labeled events (R x L), R=3 or 4",
                    "name": "firings_out",
                    "optional": true
                }
            ],
            "parameters": [
                {
                    "description": "sample rate for timeseries",
                    "name": "samplerate",
                    "optional": false
                },
                {
                    "default_value": 3600,
                    "name": "segment_duration_sec",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "name": "num_threads",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "name": "central_channel",
                    "optional": true
                },
                {
                    "default_value": 2,
                    "name": "clip_size_msec",
                    "optional": true
                },
                {
                    "default_value": 1,
                    "name": "detect_interval_msec",
                    "optional": true
                },
                {
                    "default_value": 3,
                    "name": "detect_threshold",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "name": "detect_sign",
                    "optional": true
                },
                {
                    "default_value": "false",
                    "name": "consolidate_clusters",
                    "optional": true
                },
                {
                    "default_value": 0.90000000000000002,
                    "name": "consolidation_factor",
                    "optional": true
                },
                {
                    "default_value": "false",
                    "name": "fit_stage",
                    "optional": true
                },
                {
                    "default_value": 1,
                    "name": "subsample_factor",
                    "optional": true
                },
                {
                    "default_value": "",
                    "name": "channels",
                    "optional": true
                },
                {
                    "name": "adjacency_radius"
                },
                {
                    "default_value": "true",
                    "name": "consolidate_clusters",
                    "optional": true
                },
                {
                    "default_value": 0.90000000000000002,
                    "name": "consolidation_factor",
                    "optional": true
                }
            ],
            "version": "0.1-0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.reorder_labels $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "templates",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                }
            ],
            "name": "mountainsort.reorder_labels",
            "outputs": [
                {
                    "description": "",
                    "name": "firings_out",
                    "optional": false
                }
            ],
            "parameters": [
            ],
            "version": "0.11"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort3/bin/mountainsort3.mp mountainsort.run_metrics_script $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "metrics",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "script",
                    "optional": false
                }
            ],
            "name": "mountainsort.run_metrics_script",
            "outputs": [
                {
                    "description": "",
                    "name": "metrics_out",
                    "optional": false
                }
            ],
            "parameters": [
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.sort_clips $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "clips",
                    "optional": false
                }
            ],
            "name": "mountainsort.sort_clips",
            "outputs": [
                {
                    "description": "",
                    "name": "labels_out",
                    "optional": false
                }
            ],
            "parameters": [
            ],
            "version": "0.11a"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.split_firings $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries_list",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                }
            ],
            "name": "mountainsort.split_firings",
            "outputs": [
                {
                    "description": "",
                    "name": "firings_out_list",
                    "optional": false
                }
            ],
            "parameters": [
            ],
            "version": "0.15"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort3/bin/mountainsort3.mp mountainsort.synthesize_timeseries $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "waveforms",
                    "optional": false
                }
            ],
            "name": "mountainsort.synthesize_timeseries",
            "outputs": [
                {
                    "description": "",
                    "name": "timeseries_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "default_value": 0,
                    "description": "",
                    "name": "noise_level",
                    "optional": true
                },
                {
                    "default_value": 0,
                    "description": "",
                    "name": "duration",
                    "optional": true
                },
                {
                    "default_value": 13,
                    "description": "",
                    "name": "waveform_upsample_factor",
                    "optional": true
                }
            ],
            "version": "0.12"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.whiten $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                }
            ],
            "name": "mountainsort.whiten",
            "outputs": [
                {
                    "description": "",
                    "name": "timeseries_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "default_value": 0,
                    "description": "",
                    "name": "quantization_unit",
                    "optional": true
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort2/bin/mountainsort2.mp mountainsort.whiten_clips $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "clips",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "whitening_matrix",
                    "optional": false
                }
            ],
            "name": "mountainsort.whiten_clips",
            "outputs": [
                {
                    "description": "",
                    "name": "clips_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "default_value": 0,
                    "description": "",
                    "name": "quantization_unit",
                    "optional": true
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/dev/mountainsort_cluster_aa.js.mp mountainsort_cluster_aa $(arguments)",
            "inputs": [
                {
                    "description": "preprocessed timeseries (M x N)",
                    "name": "timeseries"
                },
                {
                    "description": "detected events (2 x L) -- first row is channel number, second row is timestamp",
                    "name": "detect"
                },
                {
                    "description": "geom.csv file -- electrode geometry",
                    "name": "geom"
                }
            ],
            "name": "mountainsort_cluster_aa",
            "outputs": [
                {
                    "description": "The labeled events (3 x L)",
                    "name": "firings_out"
                }
            ],
            "parameters": [
                {
                    "description": "sample rate for timeseries",
                    "name": "samplerate",
                    "optional": false
                },
                {
                    "description": "corresponds to geom; determines electrode neighborhoods",
                    "name": "adjacency_radius",
                    "optional": false
                }
            ],
            "version": "0.1"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp mv_compute_templates $(arguments)",
            "inputs": [
                {
                    "name": "timeseries"
                },
                {
                    "name": "firings"
                }
            ],
            "name": "mv_compute_templates",
            "outputs": [
                {
                    "name": "templates"
                },
                {
                    "name": "stdevs"
                }
            ],
            "parameters": [
                {
                    "name": "clip_size",
                    "optional": false
                }
            ],
            "version": "0.13"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp mv_discrimhist $(arguments)",
            "inputs": [
                {
                    "name": "timeseries"
                },
                {
                    "name": "firings"
                }
            ],
            "name": "mv_discrimhist",
            "outputs": [
                {
                    "name": "output"
                }
            ],
            "parameters": [
                {
                    "name": "clusters",
                    "optional": false
                },
                {
                    "name": "method",
                    "optional": true
                }
            ],
            "version": "0.23"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp mv_subfirings $(arguments)",
            "inputs": [
                {
                    "name": "firings"
                }
            ],
            "name": "mv_subfirings",
            "outputs": [
                {
                    "name": "firings_out"
                }
            ],
            "parameters": [
                {
                    "name": "labels",
                    "optional": false
                },
                {
                    "name": "max_per_label",
                    "optional": true
                }
            ],
            "version": "0.11"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort3/bin/mountainsort3.mp spikeview.metrics1 $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                }
            ],
            "name": "spikeview.metrics1",
            "outputs": [
                {
                    "description": "",
                    "name": "metrics_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "description": "",
                    "name": "samplerate",
                    "optional": false
                }
            ],
            "version": "0.13"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/packages/mountainsort3/bin/mountainsort3.mp spikeview.templates $(arguments)",
            "inputs": [
                {
                    "description": "",
                    "name": "timeseries",
                    "optional": false
                },
                {
                    "description": "",
                    "name": "firings",
                    "optional": false
                }
            ],
            "name": "spikeview.templates",
            "outputs": [
                {
                    "description": "",
                    "name": "templates_out",
                    "optional": false
                }
            ],
            "parameters": [
                {
                    "default_value": 100,
                    "description": "",
                    "name": "clip_size",
                    "optional": true
                },
                {
                    "default_value": 500,
                    "description": "",
                    "name": "max_events_per_template",
                    "optional": true
                },
                {
                    "description": "",
                    "name": "samplerate",
                    "optional": true
                },
                {
                    "description": "",
                    "name": "freq_min",
                    "optional": true
                },
                {
                    "description": "",
                    "name": "freq_max",
                    "optional": true
                },
                {
                    "default_value": "false",
                    "description": "",
                    "name": "subtract_temporal_mean",
                    "optional": true
                }
            ],
            "version": "0.16"
        },
        {
            "description": "",
            "exe_command": "$(basepath)/run_matlab.sh $(basepath)/synthesize_matlab \"opts=struct('M',$M$,'T',$T$,'K',$K$,'duration',$duration$,'noise_level',$noise_level$,'firing_rate_range',[$firing_rate_min$,$firing_rate_max$],'amp_variation_range',[$amp_variation_min$,$amp_variation_max$]); synthesize_timeseries_001('$timeseries$','$firings_true$','$waveforms$',opts);\"",
            "inputs": [
            ],
            "name": "synthesize_timeseries_001_matlab",
            "outputs": [
                {
                    "name": "waveforms"
                },
                {
                    "name": "timeseries"
                },
                {
                    "name": "firings_true"
                }
            ],
            "parameters": [
                {
                    "name": "M",
                    "optional": false
                },
                {
                    "name": "T",
                    "optional": false
                },
                {
                    "name": "K",
                    "optional": false
                },
                {
                    "name": "duration",
                    "optional": false
                },
                {
                    "name": "noise_level",
                    "optional": false
                },
                {
                    "name": "firing_rate_min",
                    "optional": false
                },
                {
                    "name": "firing_rate_max",
                    "optional": false
                },
                {
                    "name": "amp_variation_min",
                    "optional": false
                },
                {
                    "name": "amp_variation_max",
                    "optional": false
                }
            ],
            "version": "0.13"
        },
        {
            "description": "",
            "exe_command": "/home/magland/dev/mountainlab/cpp/mountainprocess/processors/mountainsort.mp whiten $(arguments)",
            "inputs": [
                {
                    "name": "timeseries"
                }
            ],
            "name": "whiten",
            "outputs": [
                {
                    "name": "timeseries_out"
                }
            ],
            "parameters": [
            ],
            "version": "0.1"
        }
    ]
}

