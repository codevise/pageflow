import React from 'react';
import 'contentElements/inlineVideo/frontend';
import 'support/mediaElementStub';
import {renderInContentElement, useContentElementMatchers} from 'pageflow-scrolled/testHelpers';
import {useFakeTranslations} from 'pageflow/testHelpers';
import '@testing-library/jest-dom/extend-expect';

import {InlineVideo} from 'contentElements/inlineVideo/InlineVideo';
import {usePortraitOrientation} from 'frontend/usePortraitOrientation';
jest.mock('frontend/usePortraitOrientation');

describe('InlineVideo', () => {
  useContentElementMatchers();

  useFakeTranslations({
    'pageflow_scrolled.public.enter_fullscreen': 'Enter fullscreen',
    'pageflow_scrolled.public.exit_fullscreen': 'Exit fullscreen'
  });

  beforeEach(() => {
    usePortraitOrientation.mockReturnValue(false);
  });

  function renderInlineVideo({configuration = {id: 100}} = {}) {
    return renderInContentElement(
      <InlineVideo contentElementId={42}
                   sectionProps={{isIntersecting: false}}
                   configuration={configuration} />,
      {seed: {
        fileUrlTemplates: {
          videoFiles: {
            medium: ':id_partition/medium/:basename.mp4',
            high: ':id_partition/high/:basename.mp4'
          }
        },
        videoFiles: [{permaId: 100, isReady: true, variants: ['medium', 'high']}]
      }}
    );
  }

  describe('fullscreen button', () => {
    it('is rendered when enableFullscreen is set', () => {
      const {queryByTitle} = renderInlineVideo({
        configuration: {id: 100, enableFullscreen: true}
      });

      expect(queryByTitle('Enter fullscreen')).not.toBeNull();
    });

    it('is not rendered when enableFullscreen is not set', () => {
      const {queryByTitle} = renderInlineVideo({
        configuration: {id: 100}
      });

      expect(queryByTitle('Enter fullscreen')).toBeNull();
    });

    it('is not rendered for backdrop position', () => {
      const {queryByTitle} = renderInlineVideo({
        configuration: {id: 100, enableFullscreen: true, position: 'backdrop'}
      });

      expect(queryByTitle('Enter fullscreen')).toBeNull();
    });

    it('is not rendered for loop playback', () => {
      const {queryByTitle} = renderInlineVideo({
        configuration: {id: 100, enableFullscreen: true, playbackMode: 'loop'}
      });

      expect(queryByTitle('Enter fullscreen')).toBeNull();
    });
  });
});
