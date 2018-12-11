import entryModule from 'entry';
import {entryAttribute} from 'entry/selectors';
import createStore from 'createStore';
import Backbone from 'backbone';

import {expect} from 'support';

describe('entry', () => {
  it('provides selector to get slug', () => {
    const entry = {
      slug: 'my-entry'
    };
    const store = createStore([entryModule], {entry});

    expect(entryAttribute('slug')(store.getState())).to.eq('my-entry');
  });

  it('provides selector to get title from seed', () => {
    const entry = {
      title: 'Some Title'
    };
    const store = createStore([entryModule], {entry});

    expect(entryAttribute('title')(store.getState())).to.eq('Some Title');
  });

  it('provides selector to get title from Backbone model configuration', () => {
    const entry = new Backbone.Model({
      entry_title: 'Title from Entry'
    });
    entry.configuration = new Backbone.Model({
      title: 'Title from Revision'
    });
    const store = createStore([entryModule], {entry});

    expect(entryAttribute('title')(store.getState())).to.eq('Title from Revision');
  });

  it('Backbone model title selector falls back to entry_title attribute', () => {
    const entry = new Backbone.Model({
      entry_title: 'Some Title'
    });
    entry.configuration = new Backbone.Model();
    const store = createStore([entryModule], {entry});

    expect(entryAttribute('title')(store.getState())).to.eq('Some Title');
  });

  it('title selector gets correct value after configuration change', () => {
    const entry = new Backbone.Model();
    entry.configuration =  new Backbone.Model({
      title: 'Some Title'
    });
    const store = createStore([entryModule], {entry});

    entry.configuration.set('title', 'New Title');

    expect(entryAttribute('title')(store.getState())).to.eq('New Title');
  });
});
