import $ from 'jquery';
import Backbone from 'backbone';

import {app} from '../app';
import {editor} from '../base';

import {EditorView} from '../views/EditorView';
import {NotificationsView} from '../views/NotificationsView';
import {ScrollingView} from '../views/ScrollingView';
import {SidebarFooterView} from '../views/SidebarFooterView';

import {state} from '$state';

app.addInitializer(function(options) {
  new EditorView({
    el: $('body')
  }).render();

  new ScrollingView({
    el: $('sidebar .scrolling'),
    region: app.sidebarRegion
  }).render();

  app.previewRegion.show(new editor.entryType.previewView({
    model: state.entry
  }));

  app.notificationsRegion.show(new NotificationsView());
  app.sidebarFooterRegion.show(new SidebarFooterView({
    model: state.entry
  }));

  Backbone.history.start({root: options.root});
});

app.addRegions({
  previewRegion: '#entry_preview',
  mainRegion: '#main_content',
  indicatorsRegion: '#editor_indicators',
  sidebarRegion: 'sidebar .container',
  dialogRegion: '.dialog_container',
  notificationsRegion: 'sidebar .notifications_container',
  sidebarFooterRegion: 'sidebar .sidebar_footer_container'
});
