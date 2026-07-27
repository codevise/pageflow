// Holds per content element type behavior needed to display comment
// threads. Available both in the editor and in the frontend commenting
// mode. Kept separate from the editor and frontend registries so subject
// range logic (ordering ranges, reading the text they cover) can be shared
// by both without pulling Slate into the always-on frontend bundle.
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
