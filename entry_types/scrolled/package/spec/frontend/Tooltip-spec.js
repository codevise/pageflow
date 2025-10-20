import React from 'react'
import {render, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import {Tooltip} from 'frontend/Tooltip';

describe('Tooltip', () => {
  it('renders trigger', () => {
    const {getByTestId} = render(
      <Tooltip name="test">
        {(buttonProps) => <button data-testid="trigger" {...buttonProps}>trigger</button>}
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

  it('opens tooltip when button is clicked', () => {
    const {getByTestId} = render(
      <Tooltip name="test" content={<div data-testid="content">content</div>}>
        {(buttonProps) => <button data-testid="trigger" {...buttonProps}>trigger</button>}
      </Tooltip>
    );

    const button = getByTestId('trigger');

    expect(button.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(button);

    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes tooltip when button is clicked again', () => {
    const {getByTestId} = render(
      <Tooltip name="test" content={<div data-testid="content">content</div>}>
        {(buttonProps) => <button data-testid="trigger" {...buttonProps}>trigger</button>}
      </Tooltip>
    );

    const button = getByTestId('trigger');

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes tooltip when ESC key is pressed', () => {
    const {getByTestId} = render(
      <Tooltip name="test" content={<div data-testid="content">content</div>}>
        {(buttonProps) => <button data-testid="trigger" {...buttonProps}>trigger</button>}
      </Tooltip>
    );

    const button = getByTestId('trigger');

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    fireEvent.keyDown(button, {key: 'Escape'});
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('returns focus to button when ESC key is pressed', async () => {
    const {getByTestId} = render(
      <Tooltip name="test" content={<button data-testid="content-button">content button</button>}>
        {(buttonProps) => <button data-testid="trigger" {...buttonProps}>trigger</button>}
      </Tooltip>
    );

    const button = getByTestId('trigger');
    const contentButton = getByTestId('content-button');

    fireEvent.click(button);
    contentButton.focus();

    expect(document.activeElement).toBe(contentButton);

    fireEvent.keyDown(button, {key: 'Escape'});

    await waitFor(() => {
      expect(document.activeElement).toBe(button);
    });
  });

  it('sets aria-expanded and aria-controls attributes', () => {
    const {getByTestId} = render(
      <Tooltip name="test" content={<div data-testid="content">content</div>}>
        {(buttonProps) => <button data-testid="trigger" {...buttonProps}>trigger</button>}
      </Tooltip>
    );

    const button = getByTestId('trigger');

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe('tooltip-test');

    fireEvent.click(button);

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-controls')).toBe('tooltip-test');
  });

  it('does not toggle on click when openOnHover is true', () => {
    const {getByTestId} = render(
      <Tooltip name="test" openOnHover content={<div data-testid="content">content</div>}>
        {(buttonProps) => <button data-testid="trigger" {...buttonProps}>trigger</button>}
      </Tooltip>
    );

    const button = getByTestId('trigger');

    expect(button.getAttribute('aria-expanded')).toBeNull();

    fireEvent.click(button);

    expect(button.getAttribute('aria-expanded')).toBeNull();
  });

  it('does not toggle on click when fixed is true', () => {
    const {getByTestId} = render(
      <Tooltip name="test" fixed content={<div data-testid="content">content</div>}>
        {(buttonProps) => <button data-testid="trigger" {...buttonProps}>trigger</button>}
      </Tooltip>
    );

    const button = getByTestId('trigger');

    expect(button.getAttribute('aria-expanded')).toBeNull();

    fireEvent.click(button);

    expect(button.getAttribute('aria-expanded')).toBeNull();
  });

  it('closes tooltip when focus leaves the container', () => {
    const {getByTestId} = render(
      <>
        <Tooltip name="test" content={<div data-testid="content">content</div>}>
          {(buttonProps) => <button data-testid="trigger" {...buttonProps}>trigger</button>}
        </Tooltip>
        <button data-testid="outside">outside</button>
      </>
    );

    const button = getByTestId('trigger');
    const outsideButton = getByTestId('outside');

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    fireEvent.blur(button, {relatedTarget: outsideButton});

    expect(button.getAttribute('aria-expanded')).toBe('false');
  });
});
