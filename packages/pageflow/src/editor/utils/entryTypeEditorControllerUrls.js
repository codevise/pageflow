import {state} from '$state';
import {editor} from '../base';

/**
 * Mixins for Backbone models and collections that use entry type
 * specific editor controllers registered via the `editor_app` entry
 * type option.
 */
export const entryTypeEditorControllerUrls = {
  /**
   * Mixins for Backbone collections that defines `url` method.
   *
   * @param {Object} options
   * @param {String} options.resources - Path suffix of the controller route
   *
   * @example
   *
   * import {editor, entryTypeEditorControllerUrls} from 'pageflow/editor';
   *
   * editor.registerEntryType('test', {
       // ...
     });
   *
   * export const ItemsCollection = Backbone.Collection.extend({
   *   mixins: [entryTypeEditorControllerUrls.forCollection({resources: 'items'})
   * });
   *
   * new ItemsCollection().url() // => '/editor/entries/10/test/items'
   */
  forCollection({resources}) {
    return {
      url() {
        return entryTypeEditorControllerUrl(resources);
      },

      urlSuffix() {
        return `/${resources}`;
      }
    };
  },

  /**
   * Mixins for Backbone models that defines `urlRoot` method.
   *
   * @param {Object} options
   * @param {String} options.resources - Path suffix of the controller route
   *
   * @example
   *
   * import {editor, entryTypeEditorControllerUrls} from 'pageflow/editor';
   *
   * editor.registerEntryType('test', {
     // ...
     });
   *
   * export const Item = Backbone.Model.extend({
   *   mixins: [entryTypeEditorControllerUrls.forModel({resources: 'items'})
   * });
   *
   * new Item({id: 20}).url() // => '/editor/entries/10/test/items/20'
   */
  forModel({resources}) {
    return {
      urlRoot: function() {
        return this.isNew() ?
               this.collection.url() :
               entryTypeEditorControllerUrl(resources);
      }
    }
  }
}

function entryTypeEditorControllerUrl(resources) {
  return [state.entry.url(), editor.entryType.name, resources].join('/');
}
