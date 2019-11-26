import {app} from '../app';
import {editor} from '../base';

app.addInitializer(function(options) {
  editor.fileImporters.setup(options.config.fileImporters);
});
