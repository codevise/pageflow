import {PublishEntryView} from 'pageflow/editor';

import Backbone from 'backbone';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {within} from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

describe('PublishEntryView', () => {
  useFakeTranslations({
    'pageflow.editor.templates.publish_entry.date': 'Published until date'
  });

  it('sets published until date based on passed duration if not set yet', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-05-31'));

    const view = new PublishEntryView({
      model: new Backbone.Model(),
      account: new Backbone.Model(),
      config: {
        defaultPublishedUntilDurationInMonths: 24
      }
    });

    view.render();

    const {getByLabelText} = within(view.el);

    expect(getByLabelText('Published until date')).toHaveValue('31.05.2022');
  });

  it('keeps published until date if still in the future', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-05-31'));

    const view = new PublishEntryView({
      model: new Backbone.Model({
        published_until: '2020-07-01'
      }),
      account: new Backbone.Model(),
      config: {
        defaultPublishedUntilDurationInMonths: 24
      }
    });

    view.render();

    const {getByLabelText} = within(view.el);

    expect(getByLabelText('Published until date')).toHaveValue('01.07.2020');
  });

  it('sets published until date based on passed duration if passed', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-05-31'));

    const view = new PublishEntryView({
      model: new Backbone.Model({
        published_until: '2020-03-01'
      }),
      account: new Backbone.Model(),
      config: {
        defaultPublishedUntilDurationInMonths: 24
      }
    });

    view.render();

    const {getByLabelText} = within(view.el);

    expect(getByLabelText('Published until date')).toHaveValue('31.05.2022');
  });
});
