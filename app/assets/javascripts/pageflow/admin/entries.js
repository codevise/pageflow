jQuery(function($) {
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
          var entryAccountId = $(draggable).find('.account a').data('id');
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

      $('#folders_sidebar_section')
        .append('<a href="#" class="edit_toggle edit" title="Bearbeiten"></a>')
        .append('<a href="#" class="edit_toggle done" title="Fertig"></a>');

      $('#folders_sidebar_section .edit_toggle').on('click', function() {
        $('#folders_sidebar_section').toggleClass('editable');
      });
    }

    function isAllFolder(folder) {
      return $(folder).data('role') === 'all';
    }
  });
});
