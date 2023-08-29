import React from 'react';
import classNames from 'classnames';
import {
  withShadowClassName,
  Text,
  EditableInlineText,
  useContentElementConfigurationUpdate,
  useDarkBackground,
  useI18n,
  contentElementWidths
} from 'pageflow-scrolled/frontend';

import styles from './Heading.module.css';

export function Heading({configuration, sectionProps, contentElementWidth}) {
  const level = configuration.level || sectionProps.sectionIndex;
  const firstSectionInEntry = level === 0;
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {t} = useI18n({locale: 'ui'});
  const darkBackground = useDarkBackground();

  const legacyValue = configuration.children;
  const Tag = firstSectionInEntry ? 'h1' : 'h2';

  const forcePaddingTop = firstSectionInEntry && !('marginTop' in configuration);

  return (
    <Tag className={classNames(styles.root,
                               'scope-headings',
                               configuration.typographyVariant &&
                               `typography-heading-${configuration.typographyVariant}`,
                               darkBackground ? styles.light : styles.dark,
                               {[styles.forcePaddingTop]: forcePaddingTop},
                               {[styles[sectionProps.layout]]:
                                 contentElementWidth > contentElementWidths.md ||
                                 sectionProps.layout === 'centerRagged'},
                               {[withShadowClassName]: !sectionProps.invert})}>
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
  );
}

function getScaleCategory(configuration, firstSectionInEntry) {
  switch (configuration.textSize) {
    case 'large':
      return 'heading-lg';
    case 'medium':
      return 'heading-md';
    case 'small':
      return 'heading-sm';
    default:
      return firstSectionInEntry ? 'heading-lg' : 'heading-sm';
  }
}
