import I18n from 'i18n-js';
import {editor} from 'pageflow-scrolled/editor';
import {UrlInputView, TextInputView, ColorInputView} from 'pageflow/ui';
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
        displayPropertyName: 'displayUrl',
        required: true,
        permitHttps: true
      });
      this.view(DatawrapperAdView);
      this.input('title', TextInputView, {
        placeholder: I18n.t('pageflow_scrolled.public.chart.default_title')
      });
      this.input('backgroundColor', ColorInputView,{
        defaultValue: '#323d4d'
      });

      this.group('ContentElementCaption');
      this.group('ContentElementPosition');
    });
  }
});
