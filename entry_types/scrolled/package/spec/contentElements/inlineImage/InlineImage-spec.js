import 'contentElements/inlineImage/frontend';
import {renderContentElement, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

import {usePortraitOrientation} from 'frontend/usePortraitOrientation';
jest.mock('frontend/usePortraitOrientation');

describe('InlineImage', () => {
  usePageObjects();

  beforeEach(() => {
    usePortraitOrientation.mockReturnValue(false);
  });

  describe('circle crop', () => {
    it('forces 1:1 aspect ratio', () => {
      const {getContentElement} = renderContentElement({
        typeName: 'inlineImage',
        configuration: {
          id: 100,
          imageModifiers: [
            {name: 'crop', value: 'circle'}
          ]
        },
        imageFiles: [{
          permaId: 100,
          width: 200,
          height: 100
        }]
      });

      const contentElement = getContentElement();
      expect(contentElement.getFitViewportAspectRatio()).toEqual('1');
    });

    it('applies circle border radius', () => {
      const {getContentElement} = renderContentElement({
        typeName: 'inlineImage',
        configuration: {
          id: 100,
          imageModifiers: [
            {name: 'crop', value: 'circle'}
          ]
        },
        imageFiles: [{
          permaId: 100,
          width: 200,
          height: 100
        }]
      });

      const contentElement = getContentElement();
      expect(contentElement.getBoxBorderRadius()).toEqual('circle');
    });

    it('overrides rounded styles', () => {
      const {getContentElement} = renderContentElement({
        typeName: 'inlineImage',
        configuration: {
          id: 100,
          imageModifiers: [
            {name: 'crop', value: 'circle'},
            {name: 'rounded', value: 'lg'}
          ]
        },
        imageFiles: [{
          permaId: 100,
          width: 200,
          height: 100
        }]
      });

      const contentElement = getContentElement();
      expect(contentElement.getBoxBorderRadius()).toEqual('circle');
    });
  });

  describe('regular crop', () => {
    it('applies aspect ratio from crop value', () => {
      const {getContentElement} = renderContentElement({
        typeName: 'inlineImage',
        configuration: {
          id: 100,
          imageModifiers: [
            {name: 'crop', value: 'square'}
          ]
        },
        imageFiles: [{
          permaId: 100,
          width: 200,
          height: 100
        }]
      });

      const contentElement = getContentElement();
      expect(contentElement.getFitViewportAspectRatio()).toEqual('square');
    });

    it('applies rounded styles independently', () => {
      const {getContentElement} = renderContentElement({
        typeName: 'inlineImage',
        configuration: {
          id: 100,
          imageModifiers: [
            {name: 'crop', value: 'square'},
            {name: 'rounded', value: 'md'}
          ]
        },
        imageFiles: [{
          permaId: 100,
          width: 200,
          height: 100
        }]
      });

      const contentElement = getContentElement();
      expect(contentElement.getFitViewportAspectRatio()).toEqual('square');
      expect(contentElement.getBoxBorderRadius()).toEqual('md');
    });
  });

  describe('portrait orientation', () => {
    it('applies circle crop when in portrait orientation', () => {
      usePortraitOrientation.mockReturnValue(true);

      const {getContentElement} = renderContentElement({
        typeName: 'inlineImage',
        configuration: {
          id: 100,
          portraitId: 101,
          imageModifiers: [
            {name: 'crop', value: 'wide'}
          ],
          portraitImageModifiers: [
            {name: 'crop', value: 'circle'}
          ]
        },
        imageFiles: [
          {
            permaId: 100,
            width: 200,
            height: 100
          },
          {
            permaId: 101,
            width: 100,
            height: 200
          }
        ]
      });

      const contentElement = getContentElement();
      expect(contentElement.getFitViewportAspectRatio()).toEqual('1');
      expect(contentElement.getBoxBorderRadius()).toEqual('circle');
    });

    it('applies landscape modifiers when not in portrait orientation', () => {
      usePortraitOrientation.mockReturnValue(false);

      const {getContentElement} = renderContentElement({
        typeName: 'inlineImage',
        configuration: {
          id: 100,
          portraitId: 101,
          imageModifiers: [
            {name: 'crop', value: 'wide'},
            {name: 'rounded', value: 'md'}
          ],
          portraitImageModifiers: [
            {name: 'crop', value: 'circle'}
          ]
        },
        imageFiles: [
          {
            permaId: 100,
            width: 200,
            height: 100
          },
          {
            permaId: 101,
            width: 100,
            height: 200
          }
        ]
      });

      const contentElement = getContentElement();
      expect(contentElement.getFitViewportAspectRatio()).toEqual('wide');
      expect(contentElement.getBoxBorderRadius()).toEqual('md');
    });
  });

  describe('basic functionality', () => {
    it('renders with FitViewport and ContentElementBox', () => {
      const {getContentElement} = renderContentElement({
        typeName: 'inlineImage',
        configuration: {
          id: 100
        },
        imageFiles: [{
          permaId: 100,
          width: 200,
          height: 100
        }]
      });

      const contentElement = getContentElement();
      expect(contentElement.hasFitViewport()).toBe(true);
      expect(contentElement.containsBox()).toBe(true);
    });

    it('uses default aspect ratio when no crop modifier and no file', () => {
      const {getContentElement} = renderContentElement({
        typeName: 'inlineImage',
        configuration: {
          // No image file id
        },
        imageFiles: []
      });

      const contentElement = getContentElement();
      expect(contentElement.getFitViewportAspectRatio()).toEqual('0.75');
    });
  });
});
