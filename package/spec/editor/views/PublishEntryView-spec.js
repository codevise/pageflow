import {PublishEntryView} from 'pageflow/editor';

import Backbone from 'backbone';
import $ from 'jquery';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('PublishEntryView', () => {
  useFakeTranslations({
    'pageflow.editor.templates.publish_entry.unlimited': 'Unlimited',
    'pageflow.editor.templates.publish_entry.date': 'Published until date',
    'pageflow.editor.templates.publish_entry.noindex': 'Set noindex',
    'pageflow.editor.templates.publish_entry.noindex_help': '',
    'pageflow.editor.templates.publish_entry.publish': 'Publish'
  });

  afterEach(() => {
    jest.useRealTimers();
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

  it('checks noindex if last published with noindex', async () => {
    const entryPublication = {
      publish: jest.fn()
    };
    entryPublication.publish.mockReturnValue(new $.Deferred().promise());
    const view = new PublishEntryView({
      model: new Backbone.Model({
        last_published_with_noindex: true
      }),
      entryPublication,
      account: new Backbone.Model(),
      config: {}
    });

    const {getByLabelText} = within(view.render().el);

    expect(getByLabelText('Set noindex')).toBeChecked();
  });

  it('does not pass noindex flag by default', async () => {
    const entryPublication = {
      publish: jest.fn()
    };
    entryPublication.publish.mockReturnValue(new $.Deferred().promise());
    const view = new PublishEntryView({
      model: new Backbone.Model(),
      entryPublication,
      account: new Backbone.Model(),
      config: {}
    });

    const user = userEvent.setup();
    const {getByRole, getByLabelText} = within(view.render().el);
    await user.click(getByLabelText('Unlimited'));
    await user.click(getByRole('button', {name: 'Publish'}));

    expect(entryPublication.publish).toHaveBeenCalledWith(expect.objectContaining({
      noindex: false
    }));
  });

  it('passes noindex flag when check box checked', async () => {
    const entryPublication = {
      publish: jest.fn()
    };
    entryPublication.publish.mockReturnValue(new $.Deferred().promise());
    const view = new PublishEntryView({
      model: new Backbone.Model(),
      entryPublication,
      account: new Backbone.Model(),
      config: {}
    });

    const user = userEvent.setup();
    const {getByRole, getByLabelText} = within(view.render().el);
    await user.click(getByLabelText('Unlimited'));
    await user.click(getByLabelText('Set noindex'));
    await user.click(getByRole('button', {name: 'Publish'}));

    expect(entryPublication.publish).toHaveBeenCalledWith(expect.objectContaining({
      noindex: true
    }));
  });
});
