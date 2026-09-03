import {TextInputView} from 'pageflow/ui';

import {TextFileMetaDataItemValueView} from '../views/TextFileMetaDataItemValueView';

export const altMetaDataAttribute = {
  name: 'alt',
  valueView: TextFileMetaDataItemValueView,
  valueViewOptions: {
    fromConfiguration: true,
    settingsDialogTabLink: 'general'
  }
};

export const altConfigurationEditorInput = {
  name: 'alt',
  inputView: TextInputView,
  inputViewOptions: {
    maxLength: 5000
  }
};
