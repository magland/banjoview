function PrvListWidget(O,context) {
  O=O||this;
  JSQWidget(O);
  O.div().addClass('PrvListWidget');
  O.div().addClass('ListWidget');

  var m_table=$('<table class=Table1></table>');
  
  O.div().append(m_table);
  O.div().css({overflow:"auto"});
      
  JSQ.connect(context.prv_list_manager,'changed',O,refresh);
 
  function refresh() {
    var PM=context.prv_list_manager;
    m_table.empty();
    m_table.append('<tr><th/><th>Prv name</th><th>On server</th><th>Size (MB)</th><th>Original fname</th><th>Checksum</th><th>Fast checksum</th></tr>')
    var names=PM.prvRecordNames();
    for (var i in names) {
      var name=names[i];
      var tr=create_prv_table_row(name);
      m_table.append(tr);
    }
    var tr0=$('<tr><td/><td id=upload></td><td /><td /><td /><td /><td /></tr>');
    var upload_button=$('<a class=large id=upload href="#">Upload prv</a>');
    upload_button.click(upload_prv);
    tr0.find('#upload').append(upload_button);
    m_table.append(tr0);
  }
  
  function create_prv_table_row(name) {
      var PM=context.prv_list_manager;
      var prv=PM.prvRecord(name);
      var content=prv.content||{};
      
      var tr=$('<tr><td id=buttons></td><td><span class=large id=name></span></td><td><span class=large id=on_server /></td><td><span class=large id=size /></td><td><span class=small id=fname /></td><td><span class=small id=checksum /></td><td><span class=small id=fcs /></td></tr>');
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
          PM.renamePrvRecord(name,new_name);
        }
      })
  }
    
  function ask_remove_prv(name) {
    var PM=context.prv_list_manager;
    if (confirm('Remove prv ('+name+')?')) {
      PM.removePrvRecord(name);
      PM.emit('save');
    }
  }
      
  function upload_prv() {
    var PM=context.prv_list_manager;
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
      PM.setPrvRecord(get_default_name(),{on_server:undefined,content:obj});
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
    var PM=context.prv_list_manager;
    var names=PM.prvRecordNames();
    var num=1;
    while (names.indexOf('prv'+num)>=0) num++;
    return 'prv'+num;
  }

  function bool2yesno(val) {
    if (val===true) return '<span class=yes>Yes</span>';
      else if (val===false) return '<span class=no>No</span>';
      else return '<span class=unknown>Unknown</span>';
  }

  function starts_with(str,str2) {
    return (str.slice(0,str2.length)==str2);
  }

  function ends_with(str,str2) {
    if (str2.length>str.length) return false;
    return (str.slice(str.length-str2.length)==str2);
  }
    
  refresh();
}