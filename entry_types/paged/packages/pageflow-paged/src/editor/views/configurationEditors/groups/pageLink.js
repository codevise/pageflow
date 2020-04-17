import {ConfigurationEditorTabView, TextInputView} from 'pageflow/ui';

import {PageLinkInputView} from '../../inputs/PageLinkInputView';

ConfigurationEditorTabView.groups.define('page_link', function() {
  this.input('label', TextInputView);
  this.input('target_page_id', PageLinkInputView);
  this.group('page_transitions', {
    includeBlank: true
  });
});
