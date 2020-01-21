import Marionette from 'backbone.marionette';

import {EncodingConfirmation} from '../models/EncodingConfirmation';
import {EntryPublication} from '../models/EntryPublication';
import {editor} from '../base';

import {ConfirmEncodingView} from '../views/ConfirmEncodingView';
import {EditChapterView} from '../views/EditChapterView';
import {EditEntryView} from '../views/EditEntryView';
import {EditMetaDataView} from '../views/EditMetaDataView';
import {EditPageLinkView} from '../views/EditPageLinkView';
import {EditPageView} from '../views/EditPageView';
import {EditStorylineView} from '../views/EditStorylineView';
import {EditWidgetView} from '../views/EditWidgetView';
import {FilesView} from '../views/FilesView';
import {PublishEntryView} from '../views/PublishEntryView';

import {state} from '$state';

export const SidebarController = Marionette.Controller.extend({
  initialize: function(options) {
    this.region = options.region;
    this.entry = options.entry;
  },

  index: function(storylineId) {
    this.region.show(new EditEntryView({
      model: this.entry,
      storylineId: storylineId
    }));
  },

  files: function(collectionName, handler, payload, filterName) {
    this.region.show(new FilesView({
      model: this.entry,
      selectionHandler: handler && editor.createFileSelectionHandler(handler, payload),
      tabName: collectionName,
      filterName: filterName
    }));

    editor.setDefaultHelpEntry('pageflow.help_entries.files');
  },

  confirmableFiles: function(preselectedFileType, preselectedFileId) {
    this.region.show(ConfirmEncodingView.create({
      model: EncodingConfirmation.createWithPreselection({
        fileType: preselectedFileType,
        fileId: preselectedFileId
      })
    }));
  },

  metaData: function(tab) {
    this.region.show(new EditMetaDataView({
      model: this.entry,
      tab: tab,
      state: state,
      features: pageflow.features,
      editor: editor
    }));
  },

  publish: function() {
    this.region.show(PublishEntryView.create({
      model: this.entry,
      entryPublication: new EntryPublication()
    }));

    editor.setDefaultHelpEntry('pageflow.help_entries.publish');
  },

  storyline: function(id) {
    this.region.show(new EditStorylineView({
      model: this.entry.storylines.get(id)
    }));
  },

  chapter: function(id) {
    this.region.show(new EditChapterView({
      model: this.entry.chapters.get(id)
    }));
  },

  page: function(id, tab) {
    var page = this.entry.pages.get(id);

    this.region.show(new EditPageView({
      model: page,
      api: editor,
      tab: tab
    }));

    editor.setDefaultHelpEntry(page.pageType().help_entry_translation_key);
  },

  pageLink: function(linkId) {
    var pageId = linkId.split(':')[0];
    var page = state.pages.getByPermaId(pageId);

    this.region.show(new EditPageLinkView({
      model: page.pageLinks().get(linkId),
      page: page,
      api: editor
    }));
  },

  widget: function(id) {
    this.region.show(new EditWidgetView({
      model: this.entry.widgets.get(id)
    }));
  },
});
