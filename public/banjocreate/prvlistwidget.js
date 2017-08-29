function PrvListWidget(O,prv_manager) {
  O=O||this;
  JSQWidget(O);
  O.div().addClass('PrvListWidget');
  O.div().addClass('ListWidget');

  var PM=prv_manager;
  var m_table=$('<table class=Table1></table>');
  
  O.div().append(m_table);
  O.div().css({overflow:"auto"});
      
  JSQ.connect(PM,'changed',O,refresh);
 
  function refresh() {
    m_table.empty();
    m_table.append('<tr><th/><th>Prv name</th><th>On server</th><th>Size (MB)</th><th>Original fname</th><th>Checksum</th><th>Fast checksum</th></tr>')
    var names=PM.prvNames();
    for (var i in names) {
      var name=names[i];
      var tr=create_prv_table_row(name);
      m_table.append(tr);
    }
    var tr0=$('<tr><td/><td id=upload></td><td /><td /><td /><td /><td /></tr>');
    var upload_button=$('<a id=upload href="#">Upload prv</a>');
    upload_button.click(upload_prv);
    tr0.find('#upload').append(upload_button);
    m_table.append(tr0);
  }
  
  function create_prv_table_row(name) {
      var prv=PM.prv(name);
      var content=prv.content||{};
      
      var tr=$('<tr><td id=buttons></td><td><span id=name></span></td><td id=on_server></td><td id=size></td><td class=small id=fname></td><td class=small id=checksum></td><td class=small id=fcs></td></tr>');
      m_table.append(tr);
      tr.find('#name').html(name);
      tr.find('#on_server').html(bool2yesno(prv.on_server))
      tr.find('#size').html(content.original_size/1e6);
      tr.find('#fname').html(content.original_path);
      tr.find('#checksum').html(content.original_checksum);
      tr.find('#fcs').html(content.original_fcs);
      var remove_button=$('<a class=remove_button />');
      tr.find('#buttons').append(remove_button);
      remove_button.click(function() {ask_remove_prv(name);});
      
      make_editable(tr.find('#name'),function(new_name) {
        if (name!=new_name) {
          tr.find('#name').html('.....');
          PM.renamePrv(name,new_name);
        }
      })
  }
    
  function ask_remove_prv(name) {
    if (confirm('Remove prv ('+name+')?')) {
      PM.removePrv(name);
      PM.emit('save');
    }
  }
      
  function upload_prv() {
    var pp={
      multiple_files_mode:false,
      text_mode:true,
      validate_file:upload_validate_prv_file
    }
    upload_file(pp,function(tmp) {
      var files=tmp.files;
      if (files.length!=1) {
        alert('Unexpected problem. files.length='+files.length);
        return;
      }
      var json=files[0].file_data;
      var obj;
      try {
        obj=JSON.parse(json);
      }
      catch(err) {
        console.log (json);
        alert('Problem parsing json in .prv file');
      }
      var prv={on_server:undefined}
      PM.addPrv(get_default_name(),{on_server:undefined,content:obj});
      PM.emit('save');
      PM.checkOnServer();
    });
    function upload_validate_prv_file(ff) {
      if (!ends_with(ff.name,'.prv')) {
        alert('File must have a .prv extension');
        return false;
      }
      if (ff.size>100000) {
        alert('The selected file is too large: '+ff.size+' bytes');
        return false;
      }
      return true;
    }
  }
  
  function get_default_name() {
    var names=PM.prvNames();
    var num=1;
    while (names.indexOf('prv'+num)>=0) num++;
    return 'prv'+num;
  }

  function bool2yesno(val) {
    if (val===true) return '<span class=yes>Yes</span>';
      else if (val===false) return '<span class=no>No</span>';
      else return '<span class=unknown>Unknown</span>';
  }
    
  refresh();
}