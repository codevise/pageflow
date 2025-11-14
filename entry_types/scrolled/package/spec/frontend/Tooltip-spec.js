import React from 'react'
import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';

import {Tooltip} from 'frontend/Tooltip';

describe('Tooltip', () => {
  it('renders trigger', () => {
    const {getByTestId} = render(
      <Tooltip name="test">
        {(triggerProps) => <button data-testid="trigger" {...triggerProps}>trigger</button>}
      </Tooltip>
    );
    expect(getByTestId('trigger')).toBeDefined();
  });

  it('renders content', () => {
    const {getByTestId} = render(
      <Tooltip name="test" content={<div data-testid="content">content</div>}>
        {() => <button>trigger</button>}
      </Tooltip>
    );
    expect(getByTestId('content')).toBeDefined();
  });

  it('opens tooltip when button is clicked', async () => {
    const {getByTestId} = render(
      <Tooltip name="test" content={<div data-testid="content">content</div>}>
        {(triggerProps) => <button data-testid="trigger" {...triggerProps}>trigger</button>}
      </Tooltip>
    );

    const user = userEvent.setup();
    const button = getByTestId('trigger');

    expect(button.getAttribute('aria-expanded')).toBe('false');

    await user.click(button);

    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes tooltip when button is clicked again', async () => {
    const {getByTestId} = render(
      <Tooltip name="test" content={<div data-testid="content">content</div>}>
        {(triggerProps) => <button data-testid="trigger" {...triggerProps}>trigger</button>}
      </Tooltip>
    );

    const user = userEvent.setup();
    const button = getByTestId('trigger');

    await user.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    await user.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes tooltip when ESC key is pressed', async () => {
    const {getByTestId} = render(
      <Tooltip name="test" content={<div data-testid="content">content</div>}>
        {(triggerProps) => <button data-testid="trigger" {...triggerProps}>trigger</button>}
      </Tooltip>
    );

    const user = userEvent.setup();
    const button = getByTestId('trigger');

    await user.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    await user.keyboard('{Escape}');
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('returns focus to button when ESC key is pressed', async () => {
    const {getByTestId} = render(
      <Tooltip name="test" content={<button data-testid="content-button">content button</button>}>
        {(triggerProps) => <button data-testid="trigger" {...triggerProps}>trigger</button>}
      </Tooltip>
    );

    const user = userEvent.setup();
    const button = getByTestId('trigger');
    const contentButton = getByTestId('content-button');

    await user.click(button);
    contentButton.focus();

    expect(document.activeElement).toBe(contentButton);

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(document.activeElement).toBe(button);
    });
  });

  it('sets aria-expanded and aria-controls attributes', async () => {
    const {getByTestId} = render(
      <Tooltip name="test" content={<div data-testid="content">content</div>}>
        {(triggerProps) => <button data-testid="trigger" {...triggerProps}>trigger</button>}
      </Tooltip>
    );

    const user = userEvent.setup();
    const button = getByTestId('trigger');

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe('tooltip-test');

    await user.click(button);

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-controls')).toBe('tooltip-test');
  });

  it('does not toggle on click when openOnHover is true', async () => {
    const {getByTestId} = render(
      <Tooltip name="test" openOnHover content={<div data-testid="content">content</div>}>
        {(triggerProps) => <button data-testid="trigger" {...triggerProps}>trigger</button>}
      </Tooltip>
    );

    const user = userEvent.setup();
    const button = getByTestId('trigger');

    expect(button.getAttribute('aria-expanded')).toBeNull();

    await user.click(button);

    expect(button.getAttribute('aria-expanded')).toBeNull();
  });

  it('sets aria-describedby when openOnHover is true', () => {
    const {getByTestId} = render(
      <Tooltip name="test" openOnHover content={<div data-testid="content">content</div>}>
        {(triggerProps) => <button data-testid="trigger" {...triggerProps}>trigger</button>}
      </Tooltip>
    );

    const button = getByTestId('trigger');

    expect(button.getAttribute('aria-describedby')).toBe('tooltip-test');
  });

  it('does not toggle on click when fixed is true', async () => {
    const {getByTestId} = render(
      <Tooltip name="test" fixed content={<div data-testid="content">content</div>}>
        {(triggerProps) => <button data-testid="trigger" {...triggerProps}>trigger</button>}
      </Tooltip>
    );

    const user = userEvent.setup();
    const button = getByTestId('trigger');

    expect(button.getAttribute('aria-expanded')).toBeNull();

    await user.click(button);

    expect(button.getAttribute('aria-expanded')).toBeNull();
  });

  it('closes tooltip when focus leaves the container', async () => {
    const {getByTestId} = render(
      <>
        <Tooltip name="test" content={<button data-testid="content-button">content button</button>}>
          {(triggerProps) => <button data-testid="trigger" {...triggerProps}>trigger</button>}
        </Tooltip>
        <button data-testid="outside">outside</button>
      </>
    );

    const user = userEvent.setup();
    const button = getByTestId('trigger');
    const contentButton = getByTestId('content-button');

    await user.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    contentButton.focus();
    await user.keyboard('{Tab}');

    expect(button.getAttribute('aria-expanded')).toBe('false');
  });
});
