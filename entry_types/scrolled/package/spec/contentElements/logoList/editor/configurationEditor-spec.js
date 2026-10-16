import 'contentElements/logoList/editor';

import {SliderInput} from 'pageflow/testHelpers';
import {renderContentElementConfigurationEditor, useEditorGlobals} from 'support';

describe('logoList configuration editor', () => {
  const {createEntry} = useEditorGlobals();

  const marqueeSpeedScale = {
    'logoListMarqueeSpeed-sm': '0.75',
    'logoListMarqueeSpeed-md': '1'
  };

  function render({configuration = {}, themeProperties = {}} = {}) {
    const entry = createEntry({
      themeOptions: {properties: {root: themeProperties}},
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

    expect(configurationEditor.inputPropertyNames()).toContain('logoHeight');
  });

  it('hides logo height input if theme does not define scale', () => {
    const {configurationEditor} = render();

    expect(configurationEditor.inputPropertyNames()).not.toContain('logoHeight');
  });

  it('displays marquee speed input if marquee is enabled', () => {
    const {configurationEditor} = render({
      configuration: {marquee: true},
      themeProperties: marqueeSpeedScale
    });

    expect(configurationEditor.visibleInputPropertyNames()).toContain('marqueeSpeed');
  });

  it('hides marquee speed input if marquee is disabled', () => {
    const {configurationEditor} = render({themeProperties: marqueeSpeedScale});

    expect(configurationEditor.visibleInputPropertyNames()).not.toContain('marqueeSpeed');
  });

  it('hides marquee speed input if theme does not define scale', () => {
    const {configurationEditor} = render({configuration: {marquee: true}});

    expect(configurationEditor.inputPropertyNames()).not.toContain('marqueeSpeed');
  });

  it('starts marquee preview when sliding speed slider', () => {
    const {configurationEditor, postCommand} = render({
      configuration: {marquee: true},
      themeProperties: marqueeSpeedScale
    });

    SliderInput.findByPropertyName('marqueeSpeed', {inView: configurationEditor})
      .startSliding();

    expect(postCommand).toHaveBeenCalledWith(1, {type: 'START_MARQUEE_PREVIEW'});
  });

  it('stops marquee preview when releasing speed slider', () => {
    const {configurationEditor, postCommand} = render({
      configuration: {marquee: true},
      themeProperties: marqueeSpeedScale
    });

    SliderInput.findByPropertyName('marqueeSpeed', {inView: configurationEditor})
      .stopSliding();

    expect(postCommand).toHaveBeenCalledWith(1, {type: 'STOP_MARQUEE_PREVIEW'});
  });
});
