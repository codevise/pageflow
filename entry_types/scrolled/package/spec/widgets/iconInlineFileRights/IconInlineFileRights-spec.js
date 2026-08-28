import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import {IconInlineFileRights} from 'widgets/iconInlineFileRights/IconInlineFileRights';

import {renderInEntry} from 'support';
import {useFakeTranslations} from 'pageflow/testHelpers';

describe('IconInlineFileRights', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.ai_indicators.ai': 'AI'
  });

  it('renders items in tooltip', () => {
    const {container} = renderInEntry(
      <IconInlineFileRights hasRights={true}>
        <ul><li>Some rights</li></ul>
      </IconInlineFileRights>
    );

    expect(container).toHaveTextContent('Some rights');
  });

  it('renders copyright icon for rights', () => {
    const {container} = renderInEntry(
      <IconInlineFileRights hasRights={true} />
    );

    expect(container.querySelector('[data-file-name="SvgCopyright"]')).not.toBeNull();
  });

  it('renders ai icon for ai indicators', () => {
    const {queryByRole} = renderInEntry(
      <IconInlineFileRights hasAiIndicators={true} />
    );

    expect(queryByRole('img', {name: 'AI'})).not.toBeNull();
  });

  it('renders both icons in shared button', () => {
    const {queryAllByRole, getByRole} = renderInEntry(
      <IconInlineFileRights hasRights={true} hasAiIndicators={true} />
    );

    expect(queryAllByRole('button')).toHaveLength(1);
    expect(getByRole('button')).toContainElement(getByRole('img', {name: 'AI'}));
  });

  it('renders copyright icon last for the tooltip arrow to point at it', () => {
    const {getByRole} = renderInEntry(
      <IconInlineFileRights hasRights={true} hasAiIndicators={true} />
    );

    const icons = getByRole('button').querySelectorAll('svg');

    expect(icons[icons.length - 1]).toHaveAttribute('data-file-name', 'SvgCopyright');
  });

  it('does not render copyright icon without rights', () => {
    const {container} = renderInEntry(
      <IconInlineFileRights hasAiIndicators={true} />
    );

    expect(container.querySelector('[data-file-name="SvgCopyright"]')).toBeNull();
  });

  it('does not render ai icon without ai indicators', () => {
    const {queryByRole} = renderInEntry(
      <IconInlineFileRights hasRights={true} />
    );

    expect(queryByRole('img')).toBeNull();
  });

  it('renders nothing in afterElement context', () => {
    const {container} = renderInEntry(
      <IconInlineFileRights context="afterElement" hasAiIndicators={true} />
    );

    expect(container.textContent).toEqual('');
  });
});
