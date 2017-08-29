function ProcessManager(O,context) {
	O=O||this;
	JSQObject(O);
	var category='ProcessManager';

	this.runProcess=function(process,callback) {runProcess(process,callback);};

	function runProcess(process,callback) {
		var prv_inputs={};
		for (var key in process.inputs) {
			var val=process.inputs[key];
			if (val) {
				var prv=context.prv_list_manager.prv(val);
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
						context.prv_list_manager.setPrv(val,prv);
						context.prv_list_manager.checkOnServer(val);
					}
				}
			}
			callback({success:true});
		});
	}
	function mp_run_process(processor_name,inputs,outputs_to_return,params,opts,callback) {
		var jscontext=context.jscontext;
		var prv_inputs={};
		var request={
		  action:'run_process',
		  processor_name:processor_name,
		  inputs:inputs,
		  outputs:outputs_to_return,
		  parameters:params
		};
		var banjoserver_url=context.banjoserver.url;
		var str='';
		str+='&processor_name='+processor_name;
		str+='&inputs='+JSON.stringify(inputs);
		str+='&outputs='+JSON.stringify(outputs_to_return);
		str+='&parameters='+JSON.stringify(params);
		if (context.banjoserver.passcode) str+='&passcode='+context.banjoserver.passcode;
		var url0=banjoserver_url+'/banjoserver?a=queue-process'+str;
		context.log(category,url0);
		jscontext.http_get_json(url0,function(tmp) {
		  if (!tmp.success) {
		  	context.log(category,tmp.error);
		    callback({success:false,error:tmp.error});
		    return;
		  }
		  if (!tmp.object.success) {
		  	context.log(category,tmp.object.error);
		    callback({success:false,error:tmp.object.error});
		    return; 
		  }
		  context.log(category,JSON.stringify(tmp.object.outputs));
		  callback({success:true,outputs:tmp.object.outputs});
		});
	}
}