import React from 'react';

import {LinkTooltipProvider, LinkPreview} from './LinkTooltip';
import {ActionButton} from './ActionButton'
import {useContentElementEditorState} from '../useContentElementEditorState';
import {useSelectLinkDestination} from './useSelectLinkDestination';
import {useI18n} from '../i18n';

import styles from './EditableLink.module.css';

export function EditableLink({
  className, href, openInNewTab, children, linkPreviewDisabled,
  onChange,
  linkPreviewPosition = 'below',
  actionButtonPosition = 'outside'
}) {
  const selectLinkDestination = useSelectLinkDestination();
  const {t} = useI18n({locale: 'ui'});
  const {isSelected} = useContentElementEditorState();

  function handleButtonClick() {
    selectLinkDestination().then(onChange, () => {});
  }

  return (
    <div className={styles.wrapper}>
      <LinkTooltipProvider disabled={linkPreviewDisabled}
                           position={linkPreviewPosition}
                           align="left"
                           gap={5}>
        <LinkPreview href={href} openInNewTab={openInNewTab} className={className}>
          {children}
        </LinkPreview>
      </LinkTooltipProvider>
      {isSelected &&
       <ActionButton text={href ?
                           t('pageflow_scrolled.inline_editing.change_link_destination') :
                           t('pageflow_scrolled.inline_editing.select_link_destination')}
                     icon="link"
                     position={actionButtonPosition}
                     onClick={handleButtonClick} />}
    </div>
  );
}
