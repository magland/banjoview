function ProcessManager(O,prv_list_manager,jscontext) {
	O=O||this;
	JSQObject(O);

	this.runProcess=function(process,callback) {runProcess(process,callback);};
	
	var m_server={
		host:'http://river.simonsfoundation.org',
		port:60001
	};

	function runProcess(process,callback) {
		var prv_inputs={};
		for (var key in process.inputs) {
			var val=process.inputs[key];
			if (val) {
				var prv=prv_list_manager.prv(val);
				if (!prv) {
					callback({success:false,error:'Unable to find prv with name: '+val});
					return;
				}
				prv_inputs[key]=prv;
			}
		}
		var outputs_to_return={};
		for (var key in process.outputs) {
			var val=process.outputs[key];
			if (val) {
				outputs_to_return[key]=true;
			}
		}
		mp_run_process(process.processor_name,prv_inputs,outputs_to_return,process.parameters,{},function(tmp) {
			if (!tmp.success) {
				callback(tmp);
				return;
			}
			var outputs0=tmp.outputs;
			for (var key in process.outputs) {
				var val=process.outputs[key];
				if (val) {
					var prv=outputs0[key];
					if (prv) {
						prv_list_manager.setPrv(val,prv);
						prv_list_manager.checkOnServer(val);
					}
				}
			}
			callback({success:true});
		});
	}
	function mp_run_process(processor_name,inputs,outputs_to_return,params,opts,callback) {
		var prv_inputs={};
		var request={
		  action:'run_process',
		  processor_name:processor_name,
		  inputs:inputs,
		  outputs:outputs_to_return,
		  parameters:params
		};
		var server_url=m_server.host+':'+m_server.port;
		var url0=server_url+'/mountainprocess?a=mountainprocess&mpreq='+JSON.stringify(request);
		console.log(url0);
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