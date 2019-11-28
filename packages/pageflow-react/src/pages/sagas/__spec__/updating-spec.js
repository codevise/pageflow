import updating from '../updating';
import {updatePageAttribute, updatePageLink} from '../../actions';

import Backbone from 'backbone';

import {runSaga} from 'support/sagas';

describe('updating saga', () => {
  it('updates page configuration on update page action', () => {
    const page = new Backbone.Model({perma_id: 5});
    page.configuration = new Backbone.Model();
    const collection = new Backbone.Collection([page]);

    runSaga(updating, {args: [collection]})
      .dispatch(updatePageAttribute({id: 5, name: 'title', value: 'New Title'}));

    expect(page.configuration.get('title')).toBe('New Title');
  });

  it('updates page link on update page link action', () => {
    const pageLinks = new Backbone.Collection([{id: '5:4'}]);
    const page = new Backbone.Model({perma_id: 5});
    page.pageLinks = () => pageLinks;
    const collection = new Backbone.Collection([page]);

    runSaga(updating, {args: [collection]})
      .dispatch(updatePageLink({
        pageId: 5,
        linkId: '5:4',
        name: 'style',
        value: 'circle'
      }));

    expect(pageLinks.first().get('style')).toBe('circle');
  });
});
