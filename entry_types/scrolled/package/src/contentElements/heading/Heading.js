import React from 'react';
import classNames from 'classnames';
import {
  withShadowClassName,
  paletteColor,
  Text,
  EditableInlineText,
  useContentElementConfigurationUpdate,
  useContentElementEditorState,
  useDarkBackground,
  useI18n,
  contentElementWidths,
  utils
} from 'pageflow-scrolled/frontend';

import styles from './Heading.module.css';

export function Heading({configuration, sectionProps, contentElementWidth}) {
  const level = configuration.level || sectionProps.sectionIndex;
  const firstSectionInEntry = level === 0;
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {t} = useI18n({locale: 'ui'});
  const darkBackground = useDarkBackground();
  const {isSelected} = useContentElementEditorState();

  const legacyValue = configuration.children;
  const Tag = firstSectionInEntry ? 'h1' : 'h2';

  const forcePaddingTop = firstSectionInEntry && !('marginTop' in configuration);

  function renderSubtitle(name) {
    const value = configuration[name];

    if (!isSelected && utils.isBlankEditableTextValue(value)) {
      return null;
    }

    return (
      <Text scaleCategory={getScaleCategory(configuration, firstSectionInEntry, name)}>
        <div className={styles[name]}
             role="doc-subtitle">
          <EditableInlineText value={value}
                              hyphens={configuration.hyphens}
                              placeholder={t(`pageflow_scrolled.inline_editing.type_${name}`)}
                              onChange={value => updateConfiguration({[name]: value})} />
        </div>
      </Text>
    );
  }

  return (
    <header className={classNames(styles.root,
                                  {[styles.forcePaddingTop]: forcePaddingTop},
                                  {[styles[sectionProps.layout]]:
                                    contentElementWidth > contentElementWidths.md ||
                                   sectionProps.layout === 'centerRagged'},
                                  {[withShadowClassName]: !sectionProps.invert})}>
      {renderSubtitle('tagline')}
      <Tag className={classNames(styles.main,
                                 'scope-headings',
                                 configuration.typographyVariant &&
                                 `typography-heading-${configuration.typographyVariant}`,
                                 darkBackground ? styles.light : styles.dark)}
           style={{color: paletteColor(configuration.color)}}>
        <Text scaleCategory={getScaleCategory(configuration, firstSectionInEntry)}
              inline={true}>
          <EditableInlineText value={configuration.value}
                              defaultValue={legacyValue}
                              hyphens={configuration.hyphens}
                              placeholder={firstSectionInEntry ?
                                           t('pageflow_scrolled.inline_editing.type_title') :
                                           t('pageflow_scrolled.inline_editing.type_heading')}
                              onChange={value => updateConfiguration({value})} />
        </Text>
      </Tag>
      {renderSubtitle('subtitle')}
    </header>
  );
}

function getScaleCategory(configuration, firstSectionInEntry, suffix = '') {
  const base = `heading${capitalize(suffix)}`;

  switch (configuration.textSize) {
    case 'large':
      return `${base}-lg`;
    case 'medium':
      return `${base}-md`;
    case 'small':
      return `${base}-sm`;
    default:
      return firstSectionInEntry ? `${base}-lg` : `${base}-sm`;
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
