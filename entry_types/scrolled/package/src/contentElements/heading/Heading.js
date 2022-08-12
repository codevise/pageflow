import React from 'react';
import classNames from 'classnames';
import {
  withShadowClassName,
  Text,
  EditableInlineText,
  useContentElementConfigurationUpdate,
  useI18n,
  useIsStaticPreview
} from 'pageflow-scrolled/frontend';

import styles from './Heading.module.css';

export function Heading({configuration, sectionProps}) {
  const level = configuration.level || sectionProps.sectionIndex;
  const firstSectionInEntry = level === 0;
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {t} = useI18n({locale: 'ui'});
  const isStaticPreview = useIsStaticPreview();

  const legacyValue = configuration.children;

  // Prevent collision with legacy editor rules for h2 elements. We do
  // not care about header structure in the static preview thumbnails.
  const Tag = firstSectionInEntry || isStaticPreview ? 'h1' : 'h2';

  return (
    <Tag className={classNames(styles.root,
                               configuration.typographyVariant &&
                               `typography-heading-${configuration.typographyVariant}`,
                               {[styles[sectionProps.layout]]:
                                 configuration.position === 'wide' ||
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
