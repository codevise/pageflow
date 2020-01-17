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

    return model.get(this.options.name);
  }
});
