import React from 'react';
import 'contentElements/inlineImage/frontend';
import {renderContentElement, usePageObjects} from 'support/pageObjects';
import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

import {InlineImage} from 'contentElements/inlineImage/InlineImage';
import {features} from 'pageflow/frontend';
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

    it('applies box shadow on circle box', () => {
      const {getContentElement} = renderContentElement({
        typeName: 'inlineImage',
        configuration: {
          id: 100,
          boxShadow: 'md',
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
      expect(contentElement.hasBoxShadow('md')).toBe(true);
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

    it('applies box shadow on outer box with rounded styles', () => {
      const {getContentElement} = renderContentElement({
        typeName: 'inlineImage',
        configuration: {
          id: 100,
          boxShadow: 'lg',
          imageModifiers: [
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
      expect(contentElement.getBoxBorderRadius()).toEqual('md');
      expect(contentElement.hasBoxShadow('lg')).toBe(true);
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

  describe('srcset', () => {
    beforeEach(() => features.enable('frontend', ['image_srcset']));
    afterEach(() => features.enabledFeatureNames = []);

    function renderInlineImage({contentElementWidth = 0, ...seedOptions} = {}) {
      const result = renderInContentElement(
        <InlineImage contentElementId={42}
                     contentElementWidth={contentElementWidth}
                     configuration={{id: 100}} />,
        {seed: seedOptions}
      );
      result.simulateScrollPosition('near viewport');
      return result;
    }

    it('uses medium and large srcset for default width', () => {
      const {getByRole} = renderInlineImage({
        imageFileUrlTemplates: {
          medium: ':id_partition/medium/image.jpg',
          large: ':id_partition/large/image.jpg'
        },
        imageFiles: [{permaId: 100, id: 1, width: 4000, height: 3000}]
      });

      expect(getByRole('img')).toHaveAttribute('srcset',
        '000/000/001/medium/image.jpg 1024w, 000/000/001/large/image.jpg 1920w');
      expect(getByRole('img')).toHaveAttribute('sizes',
        '(min-width: 950px) 950px, 100vw');
    });

    it('uses medium, large and ultra srcset for full width', () => {
      const {getByRole} = renderInlineImage({
        contentElementWidth: 3,
        imageFileUrlTemplates: {
          medium: ':id_partition/medium/image.jpg',
          large: ':id_partition/large/image.jpg',
          ultra: ':id_partition/ultra/image.jpg'
        },
        imageFiles: [{permaId: 100, id: 1, width: 4000, height: 3000}]
      });

      expect(getByRole('img')).toHaveAttribute('srcset',
        '000/000/001/medium/image.jpg 1024w, ' +
        '000/000/001/large/image.jpg 1920w, ' +
        '000/000/001/ultra/image.jpg 3840w');
      expect(getByRole('img')).toHaveAttribute('sizes', '100vw');
    });

    it('uses medium, large and ultra srcset with 1200px sizes for xl width', () => {
      const {getByRole} = renderInlineImage({
        contentElementWidth: 2,
        imageFileUrlTemplates: {
          medium: ':id_partition/medium/image.jpg',
          large: ':id_partition/large/image.jpg',
          ultra: ':id_partition/ultra/image.jpg'
        },
        imageFiles: [{permaId: 100, id: 1, width: 4000, height: 3000}]
      });

      expect(getByRole('img')).toHaveAttribute('srcset',
        '000/000/001/medium/image.jpg 1024w, ' +
        '000/000/001/large/image.jpg 1920w, ' +
        '000/000/001/ultra/image.jpg 3840w');
      expect(getByRole('img')).toHaveAttribute('sizes',
        '(min-width: 950px) 1200px, 100vw');
    });

    it('uses computed width descriptors for portrait images', () => {
      const {getByRole} = renderInlineImage({
        imageFileUrlTemplates: {
          medium: ':id_partition/medium/image.jpg',
          large: ':id_partition/large/image.jpg'
        },
        imageFiles: [{permaId: 100, id: 1, width: 2160, height: 3840}]
      });

      expect(getByRole('img')).toHaveAttribute('srcset',
        '000/000/001/medium/image.jpg 576w, 000/000/001/large/image.jpg 1080w');
    });

    it('uses plain medium variant for small widths', () => {
      const {getByRole} = renderInlineImage({
        contentElementWidth: -1,
        imageFileUrlTemplates: {
          medium: ':id_partition/medium/image.jpg',
          large: ':id_partition/large/image.jpg'
        },
        imageFiles: [{permaId: 100, id: 1, width: 200, height: 100}]
      });

      expect(getByRole('img')).not.toHaveAttribute('srcset');
      expect(getByRole('img')).toHaveAttribute('src',
        '000/000/001/medium/image.jpg');
    });

    it('falls back to original behavior when feature is disabled', () => {
      features.enabledFeatureNames = [];

      const {getByRole} = renderInlineImage({
        imageFileUrlTemplates: {
          medium: ':id_partition/medium/image.jpg',
          large: ':id_partition/large/image.jpg'
        },
        imageFiles: [{permaId: 100, id: 1, width: 200, height: 100}]
      });

      expect(getByRole('img')).not.toHaveAttribute('srcset');
      expect(getByRole('img')).toHaveAttribute('src',
        '000/000/001/medium/image.jpg');
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
