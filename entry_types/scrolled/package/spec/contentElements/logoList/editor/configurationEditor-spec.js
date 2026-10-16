import 'contentElements/logoList/editor';

import {renderContentElementConfigurationEditor, useEditorGlobals} from 'support';

describe('logoList configuration editor', () => {
  const {createEntry} = useEditorGlobals();

  function renderConfigurationEditor({configuration = {}, themeProperties = {}} = {}) {
    const entry = createEntry({
      themeOptions: {properties: {root: themeProperties}},
      contentElements: [{id: 1, typeName: 'logoList', configuration}]
    });

    return renderContentElementConfigurationEditor({
      entry,
      contentElement: entry.contentElements.get(1)
    });
  }

  it('displays logo height input if theme defines scale', () => {
    const configurationEditor = renderConfigurationEditor({
      themeProperties: {'logoListLogoHeight-sm': '2rem', 'logoListLogoHeight-md': '3rem'}
    });

    expect(configurationEditor.inputPropertyNames()).toContain('logoHeight');
  });

  it('hides logo height input if theme does not define scale', () => {
    const configurationEditor = renderConfigurationEditor();

    expect(configurationEditor.inputPropertyNames()).not.toContain('logoHeight');
  });

  it('displays marquee speed input if marquee is enabled', () => {
    const configurationEditor = renderConfigurationEditor({
      configuration: {marquee: true},
      themeProperties: {'logoListMarqueeSpeed-sm': '0.75', 'logoListMarqueeSpeed-md': '1'}
    });

    expect(configurationEditor.visibleInputPropertyNames()).toContain('marqueeSpeed');
  });

  it('hides marquee speed input if marquee is disabled', () => {
    const configurationEditor = renderConfigurationEditor({
      themeProperties: {'logoListMarqueeSpeed-sm': '0.75', 'logoListMarqueeSpeed-md': '1'}
    });

    expect(configurationEditor.visibleInputPropertyNames()).not.toContain('marqueeSpeed');
  });

  it('hides marquee speed input if theme does not define scale', () => {
    const configurationEditor = renderConfigurationEditor({configuration: {marquee: true}});

    expect(configurationEditor.inputPropertyNames()).not.toContain('marqueeSpeed');
  });
});
