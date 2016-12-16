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
    return this.model.get(this.options.name);
  }
});