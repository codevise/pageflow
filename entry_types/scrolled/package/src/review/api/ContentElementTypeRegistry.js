// Kept out of the editor and frontend registries to keep Slate out of the
// always-on frontend bundle.
export class ContentElementTypeRegistry {
  constructor() {
    this.types = {};
  }

  register(typeName, options) {
    this.types[typeName] = options;
  }

  findCompareRanges(typeName) {
    return this.types[typeName]?.compareRanges;
  }

  findExtractQuote(typeName) {
    return this.types[typeName]?.extractQuote;
  }
}
