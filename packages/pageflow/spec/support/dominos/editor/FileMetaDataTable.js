import $ from 'jquery';

import {Base} from '../Base';

export const FileMetaDataTable = Base.extend({
  selector: '.file_meta_data table',

  values: function() {
    return this.$el.find('.value').map(function() {
      return $(this).text();
    }).get();
  }
});