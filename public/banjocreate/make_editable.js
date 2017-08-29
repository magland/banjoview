function make_editable(elmt,on_edit_complete) {
    elmt.addClass('editable');
    elmt.click(function(e) {
      edit_element(elmt);
    });
    elmt.focusout(function () {
      finalize_edit_element(elmt);
    });
    
    function edit_element(elmt) {
      if (elmt.hasClass('editing')) return;
      elmt.addClass('editing');
      var val=elmt.html();
      elmt.html('<input class="edit_input" type="text" value="'+val+'" />');
      var edit_input=elmt.find('.edit_input');
      edit_input.select();
      edit_input.focus();
      edit_input.keyup(function (event) {
        if (event.keyCode == 13) {
          finalize_edit_element(elmt);
        }
      });
    }

    function finalize_edit_element(elmt) {
      if (!elmt.hasClass('editing')) return;
      elmt.removeClass('editing');
      var edit_input=elmt.find('.edit_input');
      var val=edit_input.val();
      if (on_edit_complete) {
        on_edit_complete(val);
        elmt.html('');
      }
      else {
        elmt.html(val);
      }
    }
}