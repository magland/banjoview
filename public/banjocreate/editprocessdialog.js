function EditProcessDialog(O) {
	O=O||this;
	JSQWidget(O);
	O.div().addClass('EditProcessDialog');

	this.show=function() {show();};
	this.setProcessorSpec=function(spec) {m_processor_spec=JSQ.clone(spec);};
	this.setProcess=function(process) {m_process=JSQ.clone(process); update_controls();};
	this.process=function() {return JSQ.clone(m_process);};

	var m_label='Edit process';
	var m_process={};
	var m_processor_spec={};
	var m_dialog=null;

	var table=$('<table class=Table1></table>');
	table.append('<tr><th>Processor name</th><td><span id=processor_name /></td></tr>');
	table.append('<tr><th>Inputs</th><td id=inputs></td></tr>');
	table.append('<tr><th>Outputs</th><td id=outputs></td></tr>');
	table.append('<tr><th>Parameters</th><td id=parameters></td></tr>');
	O.div().append(table);

	table.find('td').css({"max-width":"600px"});


	O.div().append('<div id=buttons><button id=cancel_button>Cancel</button><button id=ok_button>OK</button></div>');
	O.div().find('#cancel_button').click(on_cancel);
	O.div().find('#ok_button').click(on_ok);
	O.div().find('#buttons').css({position:'absolute',bottom:0,left:0});

	//make_editable(O.div().find('#processor_name'));

	function show() {
		O.setSize(600,400);
		m_dialog=$('<div id="dialog"></div>');
		var W=O.width();
		var H=O.height();
		m_dialog.css('overflow','hidden');
		m_dialog.append(O.div());
		$('body').append(m_dialog);
		m_dialog.dialog({width:W+20,
		              height:H+60,
		              resizable:false,
		              modal:true,
		              title:m_label});
	}

	function update_controls() {
		O.div().find('#processor_name').html(m_process.processor_name||'undefined');

		var inputs=O.div().find('#inputs');
		inputs.empty();
		inputs.append(make_inputs_table(m_process.inputs,m_processor_spec.inputs,on_inputs_edited));

		var outputs=O.div().find('#outputs');
		outputs.empty();
		outputs.append(make_inputs_table(m_process.outputs,m_processor_spec.outputs,on_outputs_edited));

		var parameters=O.div().find('#parameters');
		parameters.empty();
		parameters.append(make_inputs_table(m_process.parameters,m_processor_spec.parameters,on_parameters_edited));
	}

	function make_inputs_table(inputs,spec,on_edited) {
		var table=$('<table class=Table2></table>');
		for (var i=0; i<spec.length; i++) {
			var key=spec[i].name;
			var optional=spec[i].optional||false;
			var tr=make_inputs_table_row(key,inputs[key],optional,on_edited);
			table.append(tr);
		}
		/*
		for (var key in inputs) {
			var tr=make_inputs_table_row(key,inputs[key],on_edited);
			table.append(tr);
		}
		*/
		return table;
	}
	function make_inputs_table_row(key,val,optional,on_edited) {
		var tr=$('<tr><th id=key></th><td id=val></td></tr>');
		var str='';
		if (optional) str=' (optional)';
		tr.find('#key').html(key+str+':');
		tr.find('#val').html(val);
		make_editable(tr.find('#val'),function(new_val) {
			on_edited(key,new_val);
		});
		return tr;
	}

	function on_inputs_edited(key,new_val) {
		m_process.inputs[key]=new_val;
		update_controls();
	}

	function on_outputs_edited(key,new_val) {
		m_process.outputs[key]=new_val;
		update_controls();
	}

	function on_parameters_edited(key,new_val) {
		m_process.parameters[key]=new_val;
		update_controls();
	}

	function on_cancel() {
		O.emit('rejected');
		m_dialog.dialog('close');

	}
	function on_ok() {
		m_process.processor_name=O.div().find('#processor_name').html();
		O.emit('accepted');
		m_dialog.dialog('close');
	}

}