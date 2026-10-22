import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {screen} from '@testing-library/dom';

import {editor} from 'pageflow-scrolled/editor';

import {TrashButtonView} from 'editor/views/TrashButtonView';
import styles from 'editor/views/TrashButtonView.module.css';

import {useFakeTranslations, renderBackboneView as render} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('TrashButtonView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.entry_outline.trash': 'Deleted content'
  });

  const {createEntry} = useEditorGlobals();

  function createView(entry = createEntry({})) {
    const nudgeContainer = document.createElement('div');
    document.body.appendChild(nudgeContainer);

    return new TrashButtonView({entry, nudgeContainer});
  }

  function nextFrame() {
    return new Promise(resolve => window.requestAnimationFrame(resolve));
  }

  it('renders button with tooltip', () => {
    render(createView());

    expect(screen.getByRole('button', {name: 'Deleted content'}))
      .toHaveAttribute('title', 'Deleted content');
  });

  it('navigates to trash when clicked', async () => {
    const user = userEvent.setup();
    const navigate = jest.spyOn(editor, 'navigate').mockImplementation(() => {});
    render(createView());

    await user.click(screen.getByRole('button', {name: 'Deleted content'}));

    expect(navigate).toHaveBeenCalledWith('/scrolled/trash', {trigger: true});
    navigate.mockRestore();
  });

  describe('nudge', () => {
    it('nudges when rendered with unseen trash items', async () => {
      const entry = createEntry({});
      entry.set('hasUnseenTrashItems', true);
      const view = createView(entry);

      render(view);
      await nextFrame();

      expect(view.el).toHaveClass(styles.nudging);
      expect(entry.get('hasUnseenTrashItems')).toBe(false);
    });

    it('nudges when trash items become unseen while shown', async () => {
      const entry = createEntry({});
      const view = createView(entry);

      render(view);
      entry.set('hasUnseenTrashItems', true);
      await nextFrame();

      expect(view.el).toHaveClass(styles.nudging);
      expect(entry.get('hasUnseenTrashItems')).toBe(false);
    });

    it('does not nudge without unseen trash items', async () => {
      const view = createView();

      render(view);
      await nextFrame();

      expect(view.el).not.toHaveClass(styles.nudging);
    });

    it('centers contracting circle on button inside nudge container', async () => {
      const entry = createEntry({});
      const view = createView(entry);
      render(view);
      jest.spyOn(view.options.nudgeContainer, 'getBoundingClientRect')
        .mockReturnValue({left: 100, top: 50, width: 300, height: 500});
      jest.spyOn(view.el, 'getBoundingClientRect')
        .mockReturnValue({left: 350, top: 60, width: 32, height: 36});

      entry.set('hasUnseenTrashItems', true);
      await nextFrame();

      const circle = view.options.nudgeContainer.querySelector(`.${styles.circle}`);
      expect(circle).toHaveClass(styles.nudging);
      expect(circle.style.left).toBe('266px');
      expect(circle.style.top).toBe('28px');
    });

    it('stops nudging once icon animation ended', async () => {
      const entry = createEntry({});
      entry.set('hasUnseenTrashItems', true);
      const view = createView(entry);

      render(view);
      await nextFrame();
      view.el.querySelector(`.${styles.icon}`)
        .dispatchEvent(new Event('animationend', {bubbles: true}));

      expect(view.el).not.toHaveClass(styles.nudging);
      expect(view.options.nudgeContainer.querySelector(`.${styles.circle}`))
        .not.toHaveClass(styles.nudging);
    });
  });
});
