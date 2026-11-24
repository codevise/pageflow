import 'contentElements/logoList/editor';
import $ from 'jquery';
import '@testing-library/jest-dom/extend-expect';

import {SliderInput} from 'pageflow/testHelpers';
import {renderContentElementConfigurationEditor, useEditorGlobals} from 'support';

describe('logoList configuration editor', () => {
  const {createEntry} = useEditorGlobals();

  const marqueeSpeedScale = {
    'logoListMarqueeSpeed-sm': '0.75',
    'logoListMarqueeSpeed-md': '1'
  };

  function render({configuration = {}, themeProperties = {}, themeTranslations} = {}) {
    const entry = createEntry({
      themeOptions: {properties: {root: themeProperties}},
      themeTranslations,
      contentElements: [{id: 1, typeName: 'logoList', configuration}]
    });
    const contentElement = entry.contentElements.get(1);
    const postCommand = jest.fn();
    contentElement.on('postCommand', postCommand);

    const configurationEditor = renderContentElementConfigurationEditor({
      entry,
      contentElement
    });

    return {configurationEditor, postCommand};
  }

  it('displays logo height input if theme defines scale', () => {
    const {configurationEditor} = render({
      themeProperties: {'logoListLogoHeight-sm': '2rem', 'logoListLogoHeight-md': '3rem'}
    });

    expect(configurationEditor.queryByInputPropertyName('logoHeight')).toBeInTheDocument();
  });

  it('hides logo height input if theme does not define scale', () => {
    const {configurationEditor} = render();

    expect(configurationEditor.queryByInputPropertyName('logoHeight')).not.toBeInTheDocument();
  });

  it('displays marquee speed input if marquee is enabled', () => {
    const {configurationEditor} = render({
      configuration: {marquee: true},
      themeProperties: marqueeSpeedScale
    });

    expect(configurationEditor.getByInputPropertyName('marqueeSpeed')).toBeVisible();
  });

  it('hides marquee speed input if marquee is disabled', () => {
    const {configurationEditor} = render({themeProperties: marqueeSpeedScale});

    expect(configurationEditor.getByInputPropertyName('marqueeSpeed')).not.toBeVisible();
  });

  it('labels marquee speed steps with multipliers', () => {
    const {configurationEditor} = render({
      configuration: {marquee: true, marqueeSpeed: 'lg'},
      themeProperties: {...marqueeSpeedScale, 'logoListMarqueeSpeed-lg': '1.5'}
    });

    expect(new SliderInput($(configurationEditor.getByInputPropertyName('marqueeSpeed')))
      .displayedValue()).toEqual('1.5×');
  });

  it('prefers translated marquee speed labels', () => {
    const {configurationEditor} = render({
      configuration: {marquee: true, marqueeSpeed: 'md'},
      themeProperties: marqueeSpeedScale,
      themeTranslations: {scales: {logoListMarqueeSpeed: {md: 'Normal'}}}
    });

    expect(new SliderInput($(configurationEditor.getByInputPropertyName('marqueeSpeed')))
      .displayedValue()).toEqual('Normal');
  });

  it('hides marquee speed input if theme does not define scale', () => {
    const {configurationEditor} = render({configuration: {marquee: true}});

    expect(configurationEditor.queryByInputPropertyName('marqueeSpeed')).not.toBeInTheDocument();
  });

  it('starts marquee preview when sliding speed slider', () => {
    const {configurationEditor, postCommand} = render({
      configuration: {marquee: true},
      themeProperties: marqueeSpeedScale
    });

    new SliderInput($(configurationEditor.getByInputPropertyName('marqueeSpeed')))
      .startSliding();

    expect(postCommand).toHaveBeenCalledWith(1, {type: 'START_MARQUEE_PREVIEW'});
  });

  it('stops marquee preview when releasing speed slider', () => {
    const {configurationEditor, postCommand} = render({
      configuration: {marquee: true},
      themeProperties: marqueeSpeedScale
    });

    new SliderInput($(configurationEditor.getByInputPropertyName('marqueeSpeed')))
      .stopSliding();

    expect(postCommand).toHaveBeenCalledWith(1, {type: 'STOP_MARQUEE_PREVIEW'});
  });
});
