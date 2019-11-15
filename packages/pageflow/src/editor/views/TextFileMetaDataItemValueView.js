import {FileMetaDataItemValueView} from './FileMetaDataItemValueView';

/**
 * Renders the value of the attribute given in `options.name`.
 *
 * @see {@link module:pageflow/editor.FileMetaDataItemValueView
 * FileMetaDataItemValueView} for further options.
 *
 * @since 12.0
 *
 * @class
 * @memberof module:pageflow/editor
 */
export const TextFileMetaDataItemValueView = FileMetaDataItemValueView.extend({
  getText: function() {
    var model;

    if (this.options.fromConfiguration) {
      model = this.model.configuration;
    }
    else {
      model = this.model;
    }

    return model.get(this.options.name);
  }
});