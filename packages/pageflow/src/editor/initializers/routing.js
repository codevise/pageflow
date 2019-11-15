import _ from 'underscore';

import {SidebarController} from '../controllers/SidebarController';
import {SidebarRouter} from '../routers/SidebarRouter';
import {app} from '../app';
import {editor} from '../base';

import {state} from '$state';

app.addInitializer(function() {
  _.each(editor.sideBarRoutings, function(options) {
    new options.router({
      controller: new options.controller({
        region: app.sidebarRegion,
        entry: state.entry
      })
    });
  });

  editor.router = new SidebarRouter({
    controller: new SidebarController({
      region: app.sidebarRegion,
      entry: state.entry
    })
  });

  window.editor = editor.router;
});
