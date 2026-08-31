import Backbone from 'backbone';

import {ScrolledEntry} from './ScrolledEntry';

// Bypasses the constructor, which requires a running editor. Only the
// theme-derived accessors work; anything else throws.
export function createDefaultsEntry({seed, themeName}) {
  const entry = Object.create(ScrolledEntry.prototype);

  entry.scrolledSeed = seed;
  entry.metadata = new Backbone.Model({theme_name: themeName});

  return entry;
}
