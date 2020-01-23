export class ContentElementTypeRegistry {
  constructor() {
    this.contentElementTypes = {};
  }

  register(typeName, options) {
    this.contentElementTypes[typeName] = options;
  }

  setupConfigurationEditor(name, configurationEditorView, options) {
    if (!this.contentElementTypes[name]) {
      throw new Error(`Unknown content element type ${name}`);
    }

    return this.contentElementTypes[name].configurationEditor.call(configurationEditorView, options);
  }

  toArray() {
    return Object.keys(this.contentElementTypes).map(typeName => ({
      typeName
    }));
  }
}
