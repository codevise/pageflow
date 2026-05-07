import React, {useCallback, useState} from 'react';
import {Editor, Transforms} from 'slate';
import {ReactEditor, useSlate} from 'slate-react';

import {useFloating, FloatingPortal, shift, offset} from '@floating-ui/react';

import {Toolbar} from '../Toolbar';
import {useI18n} from '../../i18n';
import {useSelectLinkDestination} from '../useSelectLinkDestination';
import {useFloatingPortalRoot} from '../../FloatingPortalRootProvider';
import {useEffectiveSelection} from './useEffectiveSelection';
import {isMarkActive, toggleMark} from './marks';

import BoldIcon from '../images/bold.svg';
import UnderlineIcon from '../images/underline.svg';
import ItalicIcon from '../images/italic.svg';
import StrikethroughIcon from '../images/strikethrough.svg';
import SubIcon from '../images/sub.svg';
import SupIcon from '../images/sup.svg';
import LinkIcon from '../images/link.svg';

export function HoveringToolbar({children}) {
  const editor = useSlate()
  const {t} = useI18n({locale: 'ui'});
  const selectLinkDestination = useSelectLinkDestination();

  const [isOpen, setIsOpen] = useState(false);

  const {refs, floatingStyles} = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(5),
      shift(
        {
          crossAxis: true,
          padding: {left: 10, right: 10}
        }
      )
    ]
  });

  useEffectiveSelection(editor, useCallback(selection => {
    if (!selection) {
      setIsOpen(false);
      return;
    }

    const domRange = ReactEditor.toDOMRange(editor, selection);

    refs.setPositionReference({
      getBoundingClientRect: () => domRange.getBoundingClientRect(),
      getClientRects: () => domRange.getClientRects()
    });

    setIsOpen(true);
  }, [editor, refs]));

  const floatingPortalRoot = useFloatingPortalRoot();

  return (
    <>
      {isOpen &&
       <FloatingPortal root={floatingPortalRoot}>
         <div ref={refs.setFloating}
              style={floatingStyles}>
           {renderToolbar(editor, t, selectLinkDestination)}
         </div>
       </FloatingPortal>}
      {children}
    </>
  );
}

function renderToolbar(editor, t, selectLinkDestination) {
  const buttons = [
    {
      name: 'bold',
      text: t('pageflow_scrolled.inline_editing.formats.bold'),
      icon: BoldIcon
    },
    {
      name: 'italic',
      text: t('pageflow_scrolled.inline_editing.formats.italic'),
      icon: ItalicIcon
    },
    {
      name: 'underline',
      text: t('pageflow_scrolled.inline_editing.formats.underline'),
      icon: UnderlineIcon
    },
    {
      name: 'strikethrough',
      text: t('pageflow_scrolled.inline_editing.formats.strikethrough'),
      icon: StrikethroughIcon
    },
    {
      name: 'sub',
      text: t('pageflow_scrolled.inline_editing.formats.sub'),
      icon: SubIcon
    },
    {
      name: 'sup',
      text: t('pageflow_scrolled.inline_editing.formats.sup'),
      icon: SupIcon
    },
    {
      name: 'link',
      text: isButtonActive(editor, 'link') ?
            t('pageflow_scrolled.inline_editing.remove_link') :
            t('pageflow_scrolled.inline_editing.insert_link'),
      icon: LinkIcon
    }
  ].map(button => ({...button, active: isButtonActive(editor, button.name)}));

  return (
    <Toolbar buttons={buttons}
             onButtonClick={name => handleButtonClick(editor, name, selectLinkDestination)}/>
  );
}

function handleButtonClick(editor, format, selectLinkDestination) {
  if (format === 'link') {
    if (isLinkActive(editor)) {
      unwrapLink(editor);
    }
    else {
      selectLinkDestination().then(({href, openInNewTab}) => {
        wrapLink(editor, href, openInNewTab);
      }, () => {});
    }
  }
  else {
    toggleMark(editor, format);
  }
}

function isButtonActive(editor, format) {
  if (format === 'link') {
    return isLinkActive(editor);
  }
  else {
    return isMarkActive(editor, format);
  }
}

function unwrapLink(editor) {
  Transforms.unwrapNodes(editor, {match: n => n.type === 'link'});
}

function wrapLink(editor, href, openInNewTab) {
  const link = {
    type: 'link',
    href,
    openInNewTab,
    children: [],
  };

  Transforms.wrapNodes(editor, link, {split: true});
  Transforms.collapse(editor, {edge: 'end'});
}

function isLinkActive(editor) {
  const [link] = Editor.nodes(editor, {match: n => n.type === 'link'});
  return !!link;
}
