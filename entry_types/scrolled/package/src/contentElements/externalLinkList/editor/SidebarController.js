import {SidebarListView} from './SidebarListView';
import {SidebarEditLinkView} from './SidebarEditLinkView';
import {ExternalLinkCollection} from './models/ExternalLinkCollection';
import Marionette from 'backbone.marionette';

export const SidebarController = Marionette.Controller.extend({
  initialize: function(options) {
    this.region = options.region; 
  },

  links: function(id) {    
    this.setModel(id);
    //if not done without timeout another empty tab view is shown in the sidebar
    //to me it seems to be the problem of some method call ordering which gets fixed with this
    //hack but in future it should be fixed without having to use setTimeout
    setTimeout(() => {
      this.region.show(new SidebarListView({
        model: this.linksCollection,
        contentElement: this.model,
        entry: this.options.entry
      }));
    }, 0);
  },

  link: function(id, link_id) {
    this.setModel(id);
    setTimeout(() => {
      this.region.show(new SidebarEditLinkView({
        model: this.linksCollection.get(link_id),
        collection: this.linksCollection,
        contentElement: this.model,
        entry: this.options.entry
      }));
    }, 0);
  },
  setModel: function (id) {
    this.model = this.options.entry.contentElements.get(id);
    var configuration = this.model.configuration;
    if (!configuration.get('links')) {
      configuration.set('links', []);
    }
    this.linksCollection = new ExternalLinkCollection(configuration.get('links'), {
      entry: this.options.entry,
      configuration: configuration
    });
  }
});