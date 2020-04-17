import {CheckBoxInputView, ConfigurationEditorTabView, SelectInputView, SliderInputView, TextAreaInputView, TextInputView} from 'pageflow/ui';

import {Page} from 'pageflow/editor';

import {PageLinkInputView} from '../../inputs/PageLinkInputView';

ConfigurationEditorTabView.groups.define('general', function(options) {
  this.input('title', TextInputView, {required: true, maxLength: 5000});
  this.input('hide_title', CheckBoxInputView);
  this.input('tagline', TextInputView, {maxLength: 5000});
  this.input('subtitle', TextInputView, {maxLength: 5000});
  this.input('text', TextAreaInputView, {
    fragmentLinkInputView: PageLinkInputView,
    enableLists: true
  });
  this.input('text_position', SelectInputView, {
    values: options.supportsTextPositionCenter ?
            Page.textPositions :
            Page.textPositionsWithoutCenterOption
  });
  this.input('gradient_opacity', SliderInputView);
  this.input('invert', CheckBoxInputView);
});
