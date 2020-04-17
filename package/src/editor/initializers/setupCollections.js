import Backbone from 'backbone';
import _ from 'underscore';

import {events} from 'pageflow/frontend';

import {ChaptersCollection} from '../collections/ChaptersCollection';
import {FilesCollection} from '../collections/FilesCollection';
import {PagesCollection} from '../collections/PagesCollection';

import {StorylineOrdering} from '../models/StorylineOrdering';
import {StorylinesCollection} from '../collections/StorylinesCollection';
import {ThemesCollection} from '../collections/ThemesCollection';
import {Theming} from '../models/Theming';
import {WidgetsCollection} from '../collections/WidgetsCollection';
import {app} from '../app';
import {editor} from '../base';

import {state} from '$state';

app.addInitializer(function(options) {
  state.files = FilesCollection.createForFileTypes(editor.fileTypes, options.files);

  state.imageFiles = state.files.image_files;
  state.videoFiles = state.files.video_files;
  state.audioFiles = state.files.audio_files;
  state.textTrackFiles = state.files.text_track_files;

  var widgets = new WidgetsCollection(options.widgets, {
    widgetTypes: editor.widgetTypes
  });

  state.themes = new ThemesCollection(options.themes);
  state.pages = new PagesCollection(options.pages);
  state.chapters = new ChaptersCollection(options.chapters);
  state.storylines = new StorylinesCollection(options.storylines);
  state.entry = editor.createEntryModel(options, {widgets: widgets});
  state.theming = new Theming(options.theming);
  state.account = new Backbone.Model(options.account);

  widgets.subject = state.entry;

  state.storylineOrdering = new StorylineOrdering(state.storylines, state.pages);
  state.storylineOrdering.sort({silent: true});
  state.storylineOrdering.watch();

  state.pages.sort();

  state.storylines.on('sort', _.debounce(function() {
    state.storylines.saveOrder();
  }, 100));

  editor.failures.watch(state.entry);
  editor.failures.watch(state.pages);
  editor.failures.watch(state.chapters);

  editor.savingRecords.watch(state.pages);
  editor.savingRecords.watch(state.chapters);

  events.trigger('seed:loaded');
});
