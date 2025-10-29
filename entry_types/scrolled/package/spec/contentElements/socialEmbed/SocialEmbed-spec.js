import React from 'react';
import {waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {SocialEmbed} from 'contentElements/socialEmbed/SocialEmbed';
import {resetScripts} from 'contentElements/socialEmbed/loadScript';

describe('SocialEmbed', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.third_party_consent.confirm': 'Allow'
  });

  beforeEach(() => {
    resetScripts();
  });

  it('renders placeholder when not scrolled into viewport', async () => {
    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div data-testid="test-placeholder">{children}</div>,
      Seed: () => <div />,
      process: null
    };

    const {getByTestId} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/123'}}
        providers={[testProvider]}
      />
    );

    await waitFor(() => {
      expect(getByTestId('test-placeholder')).toBeInTheDocument();
    });
  });

  it('renders placeholder wrapping opt-in button when consent not given', async () => {
    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div data-testid="test-placeholder">{children}</div>,
      Seed: () => <div />,
      process: null
    };

    const {getByTestId, queryByRole, simulateScrollPosition} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/123'}}
        providers={[testProvider]}
      />,
      {consentState: 'undecided'}
    );

    simulateScrollPosition('near viewport');

    await waitFor(() => {
      expect(getByTestId('test-placeholder')).toBeInTheDocument();
      expect(queryByRole('button', {name: 'Allow'})).toBeInTheDocument();
    });
  });

  it('renders placeholder initially', async () => {
    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div data-testid="test-placeholder">{children}</div>,
      Seed: () => <div />,
      process: null
    };

    const {getByTestId, simulateScrollPosition} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/123'}}
        providers={[testProvider]}
      />
    );

    simulateScrollPosition('near viewport');

    await waitFor(() => {
      expect(getByTestId('test-placeholder')).toBeInTheDocument();
    });
  });

  it('renders seed when scrolled into viewport', async () => {
    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div data-testid="test-placeholder">{children}</div>,
      Seed: () => <div data-testid="test-seed" />,
      process: null
    };

    const {getByTestId, simulateScrollPosition} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/123'}}
        providers={[testProvider]}
      />
    );

    simulateScrollPosition('near viewport');

    await waitFor(() => {
      expect(getByTestId('test-seed')).toBeInTheDocument();
    });
  });

  it('attaches provider script to head when scrolled into viewport', async () => {
    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div>{children}</div>,
      Seed: () => <div />,
      process: null
    };

    const {simulateScrollPosition} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/123'}}
        providers={[testProvider]}
      />
    );

    simulateScrollPosition('near viewport');

    await waitFor(() => {
      const script = document.querySelector('script[src="https://test.com/embed.js"]');
      expect(script).toBeInTheDocument();
    });
  });

  it('calls process function when script load event triggers', async () => {
    const mockProcess = jest.fn().mockResolvedValue();
    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div>{children}</div>,
      Seed: () => <div data-testid="test-seed" />,
      process: mockProcess
    };

    const {simulateScrollPosition, getByTestId} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/123'}}
        providers={[testProvider]}
      />
    );

    simulateScrollPosition('near viewport');
    await simulateScriptLoad('https://test.com/embed.js');

    await waitFor(() => {
      expect(mockProcess).toHaveBeenCalledWith(
        expect.objectContaining({
          element: getByTestId('test-seed').parentElement,
          url: 'https://test.com/post/123',
          configuration: {provider: 'test', url: 'https://test.com/post/123'}
        })
      );
    });
  });

  it('keeps placeholder visible while process is pending', async () => {
    const processPromise = new Promise(() => {});
    const mockProcess = jest.fn().mockReturnValue(processPromise);

    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div data-testid="test-placeholder">{children}</div>,
      Seed: () => <div data-testid="test-seed" />,
      process: mockProcess
    };

    const {simulateScrollPosition, getByTestId} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/123'}}
        providers={[testProvider]}
      />
    );

    simulateScrollPosition('near viewport');
    await simulateScriptLoad('https://test.com/embed.js');

    await waitFor(() => {
      expect(mockProcess).toHaveBeenCalled();
    });

    expect(getByTestId('test-placeholder')).toBeInTheDocument();
  });

  it('removes placeholder after process resolves', async () => {
    let resolveProcess;
    const processPromise = new Promise(resolve => {
      resolveProcess = resolve;
    });
    const mockProcess = jest.fn().mockReturnValue(processPromise);

    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div data-testid="test-placeholder">{children}</div>,
      Seed: () => <div data-testid="test-seed" />,
      process: mockProcess
    };

    const {simulateScrollPosition, queryByTestId} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/123'}}
        providers={[testProvider]}
      />
    );

    simulateScrollPosition('near viewport');
    await simulateScriptLoad('https://test.com/embed.js');

    await waitFor(() => {
      expect(mockProcess).toHaveBeenCalled();
    });

    resolveProcess();

    await waitFor(() => {
      expect(queryByTestId('test-placeholder')).not.toBeInTheDocument();
    });
  });

  it('calls ready after process completes', async () => {
    const mockProcess = jest.fn().mockResolvedValue();
    const mockReady = jest.fn().mockResolvedValue();

    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div data-testid="test-placeholder">{children}</div>,
      Seed: () => <div data-testid="test-seed" />,
      process: mockProcess,
      ready: mockReady
    };

    const {simulateScrollPosition, getByTestId} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/123'}}
        providers={[testProvider]}
      />
    );

    simulateScrollPosition('near viewport');
    await simulateScriptLoad('https://test.com/embed.js');

    await waitFor(() => {
      expect(mockProcess).toHaveBeenCalled();
      expect(mockReady).toHaveBeenCalledWith({
        element: getByTestId('test-seed').parentElement
      });
    });
  });

  it('keeps placeholder visible until ready resolves', async () => {
    let resolveReady;
    const readyPromise = new Promise(resolve => {
      resolveReady = resolve;
    });
    const mockProcess = jest.fn().mockResolvedValue();
    const mockReady = jest.fn().mockReturnValue(readyPromise);

    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div data-testid="test-placeholder">{children}</div>,
      Seed: () => <div data-testid="test-seed" />,
      process: mockProcess,
      ready: mockReady
    };

    const {simulateScrollPosition, getByTestId, queryByTestId} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/123'}}
        providers={[testProvider]}
      />
    );

    simulateScrollPosition('near viewport');
    await simulateScriptLoad('https://test.com/embed.js');

    await waitFor(() => {
      expect(mockReady).toHaveBeenCalled();
    });

    // Placeholder should still be visible
    expect(getByTestId('test-placeholder')).toBeInTheDocument();

    resolveReady();

    await waitFor(() => {
      expect(queryByTestId('test-placeholder')).not.toBeInTheDocument();
    });
  });

  it('calls ready without process when script is reloaded', async () => {
    const mockReady = jest.fn().mockResolvedValue();

    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div data-testid="test-placeholder">{children}</div>,
      Seed: () => <div data-testid="test-seed" />,
      ready: mockReady
    };

    const {simulateScrollPosition, getByTestId} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/123'}}
        providers={[testProvider]}
      />
    );

    simulateScrollPosition('near viewport');
    await simulateScriptLoad('https://test.com/embed.js');

    await waitFor(() => {
      expect(mockReady).toHaveBeenCalledWith({
        element: getByTestId('test-seed').parentElement
      });
    });
  });

  it('calls process immediately if script already loaded by another content element', async () => {
    const mockProcessFirst = jest.fn().mockResolvedValue();
    const mockProcessSecond = jest.fn().mockResolvedValue();
    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div>{children}</div>,
      Seed: () => <div />,
      process: mockProcessFirst
    };

    const first = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/123'}}
        providers={[testProvider]}
      />
    );

    first.simulateScrollPosition('near viewport');
    await simulateScriptLoad('https://test.com/embed.js');

    await waitFor(() => {
      expect(mockProcessFirst).toHaveBeenCalled();
    });

    const testProviderSecond = {
      ...testProvider,
      process: mockProcessSecond
    };

    const second = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: 'https://test.com/post/456'}}
        providers={[testProviderSecond]}
      />
    );

    second.simulateScrollPosition('near viewport');

    await waitFor(() => {
      expect(mockProcessSecond).toHaveBeenCalled();
    });
  });

  it('shows placeholder when provider selected but no URL given', async () => {
    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div data-testid="test-placeholder">{children}</div>,
      Seed: () => <div />,
      process: null
    };

    const {getByTestId, simulateScrollPosition} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: ''}}
        providers={[testProvider]}
      />
    );

    simulateScrollPosition('near viewport');

    await waitFor(() => {
      expect(getByTestId('test-placeholder')).toBeInTheDocument();
    });
  });

  it('does not load script when URL is blank', async () => {
    const testProvider = {
      name: 'test',
      embedScript: 'https://test.com/embed.js',
      Placeholder: ({children}) => <div data-testid="test-placeholder">{children}</div>,
      Seed: () => <div />,
      process: null
    };

    const {simulateScrollPosition, getByTestId} = renderInContentElement(
      <SocialEmbed
        configuration={{provider: 'test', url: ''}}
        providers={[testProvider]}
      />
    );

    simulateScrollPosition('near viewport');

    await waitFor(() => {
      expect(getByTestId('test-placeholder')).toBeInTheDocument();
    });

    const script = document.querySelector('script[src="https://test.com/embed.js"]');
    expect(script).not.toBeInTheDocument();
  });
});

async function simulateScriptLoad(src) {
  await waitFor(() => {
    const script = document.querySelector(`script[src="${src}"]`);
    expect(script).toBeInTheDocument();
  });

  const script = document.querySelector(`script[src="${src}"]`);
  script.dispatchEvent(new Event('load'));
}
