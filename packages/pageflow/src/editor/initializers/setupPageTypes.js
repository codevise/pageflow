import {app} from '../app';
import {editor} from '../base';

app.addInitializer(function(options) {
  editor.pageTypes.setup(options.page_types);
});