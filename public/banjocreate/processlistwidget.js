function ProcessListWidget(O,process_list_manager,processor_manager) {
  O=O||this;
  JSQWidget(O);
  O.div().addClass('ProcessListWidget');
  O.div().addClass('ListWidget');

  var PM=process_list_manager;
  var m_table=$('<table class=Table1></table>');
  
  O.div().append(m_table);
  O.div().css({overflow:"auto"});
      
  JSQ.connect(PM,'changed',O,refresh);
 
  function refresh() {
    m_table.empty();
    m_table.append('<tr><th/><th>Processor name</th><th>Inputs</th><th>Outputs</th><th>Parameters</th></tr>')
    for (var i=0; i<PM.processCount(); i++) {
      var process=PM.process(i);
      var tr=create_process_table_row(i,process);
      m_table.append(tr);
    }
    var tr0=$('<tr><td/><td id=add></td><td /><td /><td /></tr>');
    var add_button=$('<a id=add href="#">Add process</a>');
    add_button.click(add_process);
    tr0.find('#add').append(add_button);
    m_table.append(tr0);
  }
  
  function create_process_table_row(i,process) {
      var tr=$('<tr><td id=buttons></td><td><span id=processor_name></span></td><td id=inputs></td><td id=outputs></td><td id=parameters></td></tr>');
      m_table.append(tr);
      tr.find('#processor_name').html(process.processor_name||'');

      var remove_button=$('<a class=remove_button />');
      tr.find('#buttons').append(remove_button);
      remove_button.click(function() {ask_remove_process(i);});

      tr.find('#buttons').append(' ');

      var edit_button=$('<a class=edit_button />');
      tr.find('#buttons').append(edit_button);
      edit_button.click(function() {edit_process(i);});
  }
    
  function ask_remove_process(i) {
    if (confirm('Remove process?')) {
      PM.removeProcess(i);
      PM.emit('save');
    }
  }
      
  function add_process() {
    var processor_name=prompt('Processor name:');
    if (!processor_name) return;
    var P=make_default_process(processor_name);
    PM.addProcess(P);
    edit_process(PM.processCount()-1);
  }
  function make_default_process(processor_name) {
    var P={processor_name:processor_name,inputs:{},outputs:{},parameters:{}};
    var pp=processor_manager.processorSpec(processor_name);
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
    var P=PM.process(i);
    console.log('Edit process: '+P.processor_name);

    var X=new EditProcessDialog(0);
    X.setProcess(PM.process(i));
    X.show();
    JSQ.connect(X,'accepted',O,function() {
      PM.setProcess(i,X.process());
    });
  }

  refresh();
}