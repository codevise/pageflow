import '@testing-library/jest-dom/extend-expect';
import {act, waitFor} from '@testing-library/react';
import {useFakeFeatures} from 'pageflow/testHelpers';

import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects/inlineEditing';

import badgeStyles from 'review/Badge.module.css';
import sectionStyles from 'frontend/inlineEditing/SectionDecorator.module.css';

describe('inline editing section comment badges', () => {
  useInlineEditingPageObjects();
  useFakeFeatures('frontend', ['commenting']);

  it('does not display comment icon when section is not selected', () => {
    const {queryByRole} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{sectionId: 1, permaId: 100}]
      }
    });

    expect(queryByRole('status')).not.toBeInTheDocument();
  });

  it('displays dot badge when threads exist and section is not selected', async () => {
    const {getByRole} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{sectionId: 1, permaId: 100}]
      }
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'REVIEW_STATE_RESET',
          payload: {
            currentUser: {id: 1},
            commentThreads: [{
              id: 1,
              subjectType: 'Section',
              subjectId: 10,
              comments: [{id: 100, body: 'Review this'}]
            }]
          }
        },
        origin: window.location.origin
      }));
    });

    await waitFor(() => {
      expect(getByRole('status')).toBeInTheDocument();
      expect(getByRole('status')).not.toHaveTextContent(/\d/);
    });
  });

  it('renders badge in active mode when newThread is selected on the section', () => {
    const {getByRole} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{sectionId: 1, permaId: 100}]
      }
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'SELECT',
          payload: {type: 'newThread', subjectType: 'Section', subjectId: 10}
        },
        origin: window.location.origin
      }));
    });

    expect(getByRole('status')).toHaveClass(badgeStyles.active);
  });

  it('keeps the badge sticky when section comments are selected without threads', () => {
    const {getByRole} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{sectionId: 1, permaId: 100}]
      }
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'SELECT',
          payload: {type: 'sectionComments', id: 1}
        },
        origin: window.location.origin
      }));
    });

    expect(getByRole('status').closest(`.${sectionStyles.commentBadge}`))
      .toHaveClass(sectionStyles.sticky);
  });

  it('renders the section as selected when its comments are selected', () => {
    const {getByLabelText} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{sectionId: 1, permaId: 100}]
      }
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'SELECT',
          payload: {type: 'sectionComments', id: 1}
        },
        origin: window.location.origin
      }));
    });

    expect(getByLabelText('Select section')).toHaveClass(sectionStyles.selected);
  });

  it('renders the section as selected when a new thread on it is selected', () => {
    const {getByLabelText} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{sectionId: 1, permaId: 100}]
      }
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'SELECT',
          payload: {type: 'newThread', subjectType: 'Section', subjectId: 10}
        },
        origin: window.location.origin
      }));
    });

    expect(getByLabelText('Select section')).toHaveClass(sectionStyles.selected);
  });

  it('keeps the badge sticky when a new thread on the section is selected', () => {
    const {getByRole} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{sectionId: 1, permaId: 100}]
      }
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'SELECT',
          payload: {type: 'newThread', subjectType: 'Section', subjectId: 10}
        },
        origin: window.location.origin
      }));
    });

    expect(getByRole('status').closest(`.${sectionStyles.commentBadge}`))
      .toHaveClass(sectionStyles.sticky);
  });

  it('scrolls the section into view on SELECT_COMMENT_THREAD for one of its threads', async () => {
    const {getByRole, getByLabelText} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{sectionId: 1, permaId: 100}]
      }
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'REVIEW_STATE_RESET',
          payload: {
            currentUser: {id: 1},
            commentThreads: [{
              id: 1, subjectType: 'Section', subjectId: 10,
              comments: [{id: 100, body: 'Review this'}]
            }]
          }
        },
        origin: window.location.origin
      }));
    });

    await waitFor(() => {
      expect(getByRole('status')).toBeInTheDocument();
    });

    const section = getByLabelText('Select section');
    section.scrollIntoView = jest.fn();

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {type: 'SELECT_COMMENT_THREAD', payload: {threadId: 1}},
        origin: window.location.origin
      }));
    });

    expect(section.scrollIntoView).toHaveBeenCalled();
  });
});
