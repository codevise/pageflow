jQuery(function($) {
  var switchFolderSelect = function() {
    var account = $(this).find('option:selected').text();
    if($('#entry_folder_input :selected').parent().attr('label') !== account) {
      $('option[value=""]').prop('selected', 'selected');
    };
    $('#entry_folder_input').val(0).find('optgroup').each(function(){
      var optgroup_account = this.label,
          isCorrectAccount = (optgroup_account === account);
      $(this).children('option').each(function(){
        var $option = $(this);
        $option.prop('disabled', !isCorrectAccount);
      });
    });
  };

  $('.entry_account_input').change(switchFolderSelect);
  $('.entry_account_input').trigger('change');

  $('.admin_entries').each(function() {
    if ($('#folders_sidebar_section').length) {
      $('#index_table_entries tr').draggable({
        helper: function() {
          var title = $('.title a', this).text();
          return $('<div class="dragged_entry" />').text(title);
        },

        cursorAt: { left: 5, top: 5 },
        distance: 3,
        appendTo: '#wrapper'
      });

      $('#folders_sidebar_section ul.folders > li').droppable({
        tolerance: 'pointer',
        hoverClass: 'drop_over',

        accept: function(draggable) {
          var entryAccountId = $(draggable).find('.col-account a').data('id');
          var folderAccountId = $(this).parents('.accounts > li').data('id');

          return !entryAccountId ||
            entryAccountId == folderAccountId ||
            isAllFolder(this);
        },

        activate: function() {
          $(this).addClass('drop_target');
        },

        deactivate: function() {
          $(this).removeClass('drop_target drop_over');
        },

        drop: function(event, ui) {
          var folderId = $(this).data('id');
          var entryId = $(ui.draggable).attr('id').replace('pageflow_entry_', '');

          $.ajax({
            url: '/admin/entries/' + entryId,
            method: 'put',
            dataType: 'json',
            data: {
              entry: {
                folder_id: folderId || ''
              }
            }
          }).done(function() {
            location.reload();
          });
        }
      });

      if ($('#folders_sidebar_section a.new').length > 0) {
        $('#folders_sidebar_section')
          .append('<a href="#" class="edit_toggle edit" title="Bearbeiten"></a>')
          .append('<a href="#" class="edit_toggle done" title="Fertig"></a>');
      }

      $('#folders_sidebar_section .edit_toggle').on('click', function() {
        $('#folders_sidebar_section').toggleClass('editable');
      });
    }

    function isAllFolder(folder) {
      return $(folder).data('role') === 'all';
    }
  });

  $('.admin_entries form.entry').each(function() {
    var accountSelect = $('#entry_account_id', this);
    var entryTypeInput = $('#entry_type_name_input', this);
    var entryTypeSelect = $('#entry_type_name', this);
    var entryTypeOptions = $('#entry_type_name option', this);

    function updateEntryTypeOptions() {
      var selectedAccountId = accountSelect.val();
      hideAllOptions();

      $.get('/admin/entries/entry_types?account_id=' + selectedAccountId)
        .done(function(response) {
          var typeNames = response.map(function(item) {
            return item.type_name;
          });
          updateForm(typeNames);
          if (currentSelectedUnavailable(typeNames)) {
            updateSelected(typeNames[0]);
          }
          if (response.length < 2) {
            hideInput();
          } else {
            showInput();
          }
        });
    }

    function updateForm(entryTypes) {
      entryTypes.forEach(showOption);
    }

    function currentSelectedUnavailable(entryTypes) {
      var selectedEntryType = entryTypeSelect.children('option:selected').val();

      return !entryTypes.includes(selectedEntryType);
    }

    function updateSelected(firstAvailable) {
      entryTypeSelect.val(firstAvailable);
    }

    function hideInput() {
      entryTypeInput.hide();
    }

    function showInput() {
      entryTypeInput.show();
    }

    function hideAllOptions() {
      entryTypeOptions.each(function() {
        $(this).hide();
      });
    }

    function showOption(entryType) {
      $('#entry_type_name option[value=' + entryType + ']').show();
    }

    if (entryTypeOptions.length > 1) {
      accountSelect.on('change', updateEntryTypeOptions);
      updateEntryTypeOptions();
    }
  });
});
