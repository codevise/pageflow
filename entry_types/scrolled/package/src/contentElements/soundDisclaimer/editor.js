import I18n from 'i18n-js';

import {editor} from 'pageflow-scrolled/editor';
import {TextInputView} from 'pageflow/ui';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('soundDisclaimer', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline'],

  configurationEditor({entry}) {
    this.tab('general', function() {
      this.input('mutedText', TextInputView, {
        placeholder: I18n.t('pageflow_scrolled.public.sound_disclaimer.help_muted', {
          locale: entry.metadata.get('locale')
        })
      });

      this.input('unmutedText', TextInputView, {
        placeholder: I18n.t('pageflow_scrolled.public.sound_disclaimer.help_unmuted', {
          locale: entry.metadata.get('locale')
        })
      });
    });
  }
});
