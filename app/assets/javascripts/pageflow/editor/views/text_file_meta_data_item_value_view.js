/**
 * Renders the value of the attribute given in `options.name`.
 *
 * @see {@link module:pageflow/editor.pageflow.FileMetaDataItemValueView
 * pageflow.FileMetaDataItemValueView} for further options.
 *
 * @since edge
 *
 * @class
 * @memberof module:pageflow/editor
 */
pageflow.TextFileMetaDataItemValueView = pageflow.FileMetaDataItemValueView.extend({
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