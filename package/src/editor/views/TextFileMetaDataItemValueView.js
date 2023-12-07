import {FileMetaDataItemValueView} from './FileMetaDataItemValueView';

export const TextFileMetaDataItemValueView = FileMetaDataItemValueView.extend({
  getText: function() {
    var model;

    if (this.options.fromConfiguration) {
      model = this.model.configuration;
    }
    else {
      model = this.model;
    }

    const value = model.get(this.options.name);

    if (value && this.options.formatValue) {
      return this.options.formatValue(value);
    }

    return value;
  }
});
