import entryModule from 'entry';
import {entryAttribute, isEntryReady} from 'entry/selectors';
import createStore from 'createStore';
import Backbone from 'backbone';


describe('entry', () => {
  function setup({entry} = {entry: {}}) {
    const events = {...Backbone.Events};
    const store = createStore([entryModule], {events, entry});

    return {
      events,

      select(selector) {
        return selector(store.getState());
      }
    };
  }

  it('provides selector to get slug', () => {
    const entry = {
      slug: 'my-entry'
    };
    const {select} = setup({entry});

    expect(select(entryAttribute('slug'))).toBe('my-entry');
  });

  it('provides selector to get title from seed', () => {
    const entry = {
      title: 'Some Title'
    };
    const {select} = setup({entry});

    expect(select(entryAttribute('title'))).toBe('Some Title');
  });

  it(
    'provides selector to get title from Backbone model configuration',
    () => {
      const entry = new Backbone.Model({
        entry_title: 'Title from Entry'
      });
      entry.metadata = new Backbone.Model({
        title: 'Title from Revision'
      });
      const {select} = setup({entry});

      expect(select(entryAttribute('title'))).toBe('Title from Revision');
    }
  );

  it(
    'Backbone model title selector falls back to entry_title attribute',
    () => {
      const entry = new Backbone.Model({
        entry_title: 'Some Title'
      });
      entry.metadata = new Backbone.Model();
      const {select} = setup({entry});

      expect(select(entryAttribute('title'))).toBe('Some Title');
    }
  );

  it('title selector gets correct value after configuration change', () => {
    const entry = new Backbone.Model();
    entry.metadata =  new Backbone.Model({
      title: 'Some Title'
    });
    const {select} = setup({entry});

    entry.metadata.set('title', 'New Title');

    expect(select(entryAttribute('title'))).toBe('New Title');
  });

  it('sets isEntryReady to false by default', () => {
    const {select} = setup();

    const result = select(isEntryReady);

    expect(result).toBe(false);
  });

  it('changes isEntryReady to true on ready event', () => {
    const {select, events} = setup();

    events.trigger('ready');
    const result = select(isEntryReady, events);

    expect(result).toBe(true);
  });
});
