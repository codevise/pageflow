import {ConfigurationEditorView} from 'pageflow/ui';

export const PageLinkConfigurationEditorView = ConfigurationEditorView.extend({
  configure: function() {
    this.tab('general', function() {
      this.group('page_link');
    });
  }
});
