function ProcessListWidget(O,context) {
  O=O||this;
  JSQWidget(O);
  O.div().addClass('ProcessListWidget');
  O.div().addClass('ListWidget');

  var m_table=$('<table class=Table1></table>');
  
  O.div().append(m_table);
  O.div().css({overflow:"auto"});
      
  JSQ.connect(context.process_list_manager,'changed',O,refresh);
 
  function refresh() {
    var PM=context.process_list_manager;
    m_table.empty();
    m_table.append('<tr><th/><th>Processor name</th><th>Inputs</th><th>Outputs</th><th>Parameters</th></tr>');
    for (var i=0; i<PM.processCount(); i++) {
      var process=PM.process(i);
      var tr=create_process_table_row(i,process);
      m_table.append(tr);
    }
    var tr0=$('<tr><td/><td id=add></td><td /><td /><td /></tr>');
    var add_button=$('<a class=large id=add href="#">Add process</a>');
    add_button.click(add_process);
    tr0.find('#add').append(add_button);
    m_table.append(tr0);
  }
  
  function create_process_table_row(i,process) {
      var tr=$('<tr><td id=buttons></td><td><span class=large id=processor_name></span></td><td id=inputs></td><td id=outputs></td><td id=parameters></td></tr>');
      m_table.append(tr);
      tr.find('#processor_name').html(process.processor_name||'');
      tr.find('#inputs').append(create_inputs_cell(process.inputs||{}));
      tr.find('#outputs').append(create_inputs_cell(process.outputs||{}));
      tr.find('#parameters').append(create_inputs_cell(process.parameters||{}));

      var remove_button=$('<a class=remove_button />');
      tr.find('#buttons').append(remove_button);
      remove_button.click(function() {ask_remove_process(i);});

      tr.find('#buttons').append('<br/>');
      var edit_button=$('<a class=edit_button />');
      tr.find('#buttons').append(edit_button);
      edit_button.click(function() {edit_process(i);});

      tr.find('#buttons').append('<br/>');
      var run_button=$('<a class=run_button />');
      tr.find('#buttons').append(run_button);
      run_button.click(function() {run_process(i);});
  }
  function create_inputs_cell(X) {
    var ret=$('<div />');
    for (var name in X) {
      var val=X[name];
      ret.append(name+':'+val+'<br/>');
    }
    return ret;
  }
    
  function ask_remove_process(i) {
    var PM=context.process_list_manager;
    if (confirm('Remove process?')) {
      PM.removeProcess(i);
      PM.emit('save');
    }
  }
      
  function add_process() {
    var PM=context.process_list_manager;
    select_processor_name(function(processor_name) {
      if (!processor_name) return;
      var P=make_default_process(processor_name);
      PM.addProcess(P);
      PM.emit('save');
      edit_process(PM.processCount()-1);
    });
  }
  function select_processor_name(callback) {
    var X=new SelectProcessorDialog(0,context);
    JSQ.connect(X,'accepted',O,function() {
      callback(X.processorName());
    });
    X.show();
  }
  function make_default_process(processor_name) {
    var P={processor_name:processor_name,inputs:{},outputs:{},parameters:{}};
    var pp=context.processor_manager.processorSpec(processor_name);
    var inputs0=pp.inputs||[];
    var outputs0=pp.outputs||[];
    var parameters0=pp.parameters||[];
    for (var i=0; i<inputs0.length; i++) {
      P.inputs[inputs0[i].name]='';
    }
    for (var i=0; i<outputs0.length; i++) {
      P.outputs[outputs0[i].name]='';
    }
    for (var i=0; i<parameters0.length; i++) {
      P.parameters[parameters0[i].name]='';
    }

    return P;
  }

  function edit_process(i) {
    var PM=context.process_list_manager;
    var P=PM.process(i);

    var X=new EditProcessDialog(0);
    var spec=context.processor_manager.processorSpec(P.processor_name);
    if (!spec) {
      alert('Unable to find spec for processor: '+P.processor_name);
      return;
    }
    X.setProcessorSpec(spec);
    X.setProcess(P);
    X.show();
    JSQ.connect(X,'accepted',O,function() {
      PM.setProcess(i,X.process());
      PM.emit('save');
    });
  }

  function run_process(i) {
    var PM=context.process_list_manager;
    var P=PM.process(i);
    O.emit('run_process',{process:P});
  }

  refresh();
}