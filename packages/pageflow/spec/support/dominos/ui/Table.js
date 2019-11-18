import $ from 'jquery';

import {Base} from '../Base';

export const Table = Base.extend({
  selector: '.table_view',

  columnNames: function() {
    return this.$el.find('th').map(function() {
      return $(this).data('columnName');
    }).get();
  }
});
