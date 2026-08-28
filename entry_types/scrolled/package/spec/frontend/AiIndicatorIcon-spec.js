import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import {AiIndicatorIcon, useAiIndicatorLabel} from 'frontend/AiIndicatorIcon';

import {renderInEntry} from 'support';
import {useFakeTranslations} from 'pageflow/testHelpers';

describe('AiIndicatorIcon', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.ai_indicators.ai_generated': 'AI generated'
  });

  it('renders icon for kind', () => {
    const {container} = renderInEntry(<AiIndicatorIcon kind="ai_generated" />);

    expect(container.querySelector('svg')).toHaveAttribute('data-file-name',
                                                           'SvgAiGenerated');
  });

  it('renders different icon per kind', () => {
    const {container} = renderInEntry(<AiIndicatorIcon kind="ai_modified" />);

    expect(container.querySelector('svg')).toHaveAttribute('data-file-name',
                                                           'SvgAiModified');
  });

  it('renders nothing for unknown kind', () => {
    const {container} = renderInEntry(<AiIndicatorIcon kind="ai_dreamed" />);

    expect(container.querySelector('svg')).toBeNull();
  });

  it('renders translated label for screen readers', () => {
    const {queryByRole} = renderInEntry(<AiIndicatorIcon kind="ai_generated" />);

    expect(queryByRole('img', {name: 'AI generated'})).not.toBeNull();
  });
});

describe('useAiIndicatorLabel', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.ai_indicators.ai_generated': 'AI generated'
  });

  function Probe({kind}) {
    const aiIndicatorLabel = useAiIndicatorLabel();

    return <span>{aiIndicatorLabel(kind)}</span>;
  }

  it('translates kind', () => {
    const {container} = renderInEntry(<Probe kind="ai_generated" />);

    expect(container).toHaveTextContent('AI generated');
  });
});
