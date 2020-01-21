import {TextInputView} from 'pageflow/ui';

import {FileSettingsDialogView} from 'pageflow/editor';

import * as support from '$support';
import {Tabs} from '$support/dominos/ui';

describe('FileSettingsDialogView', () => {
  var f = support.factories;

  support.setupGlobals({entry: f.entry});

  it('renders settingsDialogTabs of file type', () => {
    var fileType = f.fileType({
      settingsDialogTabs: [
        {name: 'custom', view: TextInputView}
      ]
    });
    var view = new FileSettingsDialogView({
      model: f.file({}, {
        fileType: fileType
      })
    });

    view.render();
    var tabView = Tabs.find(view);

    expect(tabView.tabNames()).toEqual(expect.arrayContaining(['custom']));
  });
});