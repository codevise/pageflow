import React from 'react';

import {LinkTooltipProvider, LinkPreview} from './LinkTooltip';
import {ActionButtons} from './ActionButtons'
import {useContentElementEditorState} from '../useContentElementEditorState';
import {useWidgetEditorState} from './SelectableWidgetDecorator';
import {useSelectLinkDestination} from './useSelectLinkDestination';
import {useI18n} from '../i18n';

import styles from './EditableLink.module.css';

export function EditableLink({
  className, href, openInNewTab, children,
  onChange,
  linkPreviewDisabled,
  linkPreviewPosition = 'below',
  linkPreviewAlign = 'center',
  actionButtonPosition = 'outside',
  actionButtonVisible = 'whenSelected',
  actionButtonPortal,
  allowRemove = false
}) {
  const selectLinkDestination = useSelectLinkDestination();
  const {t} = useI18n({locale: 'ui'});
  const {isSelected: inSelectedContentElement} = useContentElementEditorState();
  const {isSelected: inSelectedWidget} = useWidgetEditorState();

  if (actionButtonVisible === 'whenSelected') {
    actionButtonVisible = inSelectedContentElement || inSelectedWidget;
  }

  function handleSelectLinkDestination() {
    selectLinkDestination().then(onChange, () => {});
  }

  function handleRemoveLink() {
    onChange(null);
  }

  return (
    <div className={styles.wrapper}>
      <LinkTooltipProvider position={linkPreviewPosition}
                           align={linkPreviewAlign}
                           gap={5}>
        <LinkPreview disabled={linkPreviewDisabled}
                     href={href}
                     openInNewTab={openInNewTab}
                     className={className}>
          {children}
        </LinkPreview>
      </LinkTooltipProvider>
      {actionButtonVisible &&
       <ActionButtons buttons={[{icon: 'link',
                                 text: href ?
                                   t('pageflow_scrolled.inline_editing.change_link_destination') :
                                   t('pageflow_scrolled.inline_editing.select_link_destination'),
                                 onClick: handleSelectLinkDestination},
                                ...(allowRemove && href ? [{icon: 'unlink',
                                                           iconOnly: true,
                                                           text: t('pageflow_scrolled.inline_editing.remove_link'),
                                                           onClick: handleRemoveLink}] : [])]}
                      position={actionButtonPosition}
                      portal={actionButtonPortal} />}
    </div>
  );
}
