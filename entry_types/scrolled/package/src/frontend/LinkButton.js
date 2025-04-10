import React from 'react';
import classNames from 'classnames';
import styles from './LinkButton.module.css';
import {EditableLink} from './EditableLink';
import {EditableInlineText} from './EditableInlineText';
import {Text} from './Text';
import {utils} from './utils';
import {useI18n} from './i18n';
import {useContentElementEditorState} from './useContentElementEditorState';

export function LinkButton({
  href,
  openInNewTab,
  value,
  onTextChange,
  onLinkChange,
  scaleCategory,
  className,
  actionButtonVisible,
  linkPreviewPosition,
  linkPreviewDisabled,
  children,
  ...props
}) {
  const {t} = useI18n({locale: 'ui'});
  const {isEditable} = useContentElementEditorState();

  return (
    <Text inline scaleCategory={scaleCategory}>
      <EditableLink href={href}
                    openInNewTab={openInNewTab}
                    linkPreviewPosition={linkPreviewPosition}
                    linkPreviewDisabled={utils.isBlankEditableTextValue(value) || linkPreviewDisabled}
                    actionButtonVisible={actionButtonVisible}
                    className={classNames(styles.button, className, {[styles.editable]: isEditable})}
                    onChange={onLinkChange}
                    {...props}>
        <EditableInlineText value={value}
                           onChange={onTextChange}
                           placeholder={t('pageflow_scrolled.inline_editing.type_text')} />
        {children}
      </EditableLink>
    </Text>
  );
}
