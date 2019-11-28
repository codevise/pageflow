import $ from 'jquery';

import {Base} from '../Base';

export const Tabs = Base.extend({
  selector: '.tabs_view',

  tabNames: function() {
    return this.$el.find('[data-tab-name]').map(function() {
      return $(this).data('tabName');
    }).get();
  },

  tabLabels: function() {
    return this.$el.find('[data-tab-name]').map(function() {
      return $(this).text();
    }).get();
  }
});
