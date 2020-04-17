import {update, ready} from './actions';
import reducer from './reducer';

import Backbone from 'backbone';

export default {
  init({entry, dispatch, events, isServerSide}) {
    if (!isServerSide) {
      events.once('ready', () =>
        dispatch(ready())
      );
    }

    if (Backbone.Model && entry instanceof Backbone.Model) {
      watchModel({entry, dispatch});
    }
    else {
      loadFromSeed({entry, dispatch});
    }
  },

  createReducers() {
    return {entry: reducer};
  }
};

function watchModel({entry, dispatch}) {
  updateFromModel({entry, dispatch});

  entry.metadata.on('change:title', () => {
    updateFromModel({entry, dispatch});
  });
}

function updateFromModel({entry, dispatch}) {
  dispatch(update({
    entry: {
      slug: entry.get('slug'),
      title: entry.metadata.get('title') || entry.get('entry_title'),
      publishedAt: null
    }
  }));
}

function loadFromSeed({entry, dispatch}) {
  dispatch(update({
    entry: {
      slug: entry.slug,
      title: entry.title,
      publishedAt: entry.published_at
    }
  }));
}
