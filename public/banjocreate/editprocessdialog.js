function EditProcessDialog(O) {
	O=O||this;
	JSQWidget(O);
	O.div().addClass('EditProcessDialog');

	this.show=function() {show();};
	this.setProcess=function(process) {m_process=JSQ.clone(process); update_controls();};
	this.process=function() {return JSQ.clone(m_process);};

	var m_label='Edit process';
	var m_process={};
	var m_dialog=null;

	var table=$('<table class=Table1></table>');
	table.append('<tr><th>Processor name</th><td><span id=processor_name /></td></tr>');
	table.append('<tr><th>Inputs</th><td id=inputs></td></tr>');
	table.append('<tr><th>Outputs</th><td id=outputs></td></tr>');
	table.append('<tr><th>Parameters</th><td id=parameters></td></tr>');
	O.div().append(table);
	O.div().append('<button id=cancel_button>Cancel</button><button id=ok_button>OK</button>');
	O.div().find('#cancel_button').click(on_cancel);
	O.div().find('#ok_button').click(on_ok);

	//make_editable(O.div().find('#processor_name'));

	function show() {
		O.setSize(400,400);
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
		inputs.append(make_inputs_table(m_process.inputs));
	}

	function make_inputs_table(inputs) {
		var table=$('<table class=Table2></table>');
		for (var key in inputs) {
			var tr=make_inputs_table_row(key,inputs[key]);
			table.append(tr);
		}
		return table;
	}
	function make_inputs_table_row(key,val) {
		var tr=$('<tr><th id=key></th><td id=val></td></tr>');
		tr.find('#key').html(key+':');
		tr.find('#val').html(val);
		make_editable(tr.find('#val'));
		return tr;
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