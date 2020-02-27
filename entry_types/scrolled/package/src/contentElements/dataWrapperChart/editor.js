import {editor} from 'pageflow-scrolled/editor';
import {UrlInputView} from 'pageflow/ui';
import {DatawrapperAdView} from './editor/DataWrapperAdView';

editor.contentElementTypes.register('dataWrapperChart', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('url', UrlInputView, {
         supportedHosts: [
          'http://cf.datawrapper.de',
          'https://cf.datawrapper.de',
          'http://datawrapper.dwcdn.de',
          'https://datawrapper.dwcdn.de',
          'http://datawrapper.dwcdn.net',
          'https://datawrapper.dwcdn.net',
          'http://charts.datawrapper.de',
          'https://charts.datawrapper.de',
        ],
        displayPropertyName: 'url',
        required: true,
        permitHttps: true
      });
      this.view(DatawrapperAdView);
    });
  }
});
