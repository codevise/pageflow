import React, {useCallback, useEffect, useMemo} from 'react';
import classNames from 'classnames';
import {createEditor, Editor} from 'slate';
import {Slate, Editable, ReactEditor, withReact} from 'slate-react';

import {Text} from '../Text';
import {useCommentThreads, useCommentHighlights, decorateCommentHighlights, useRangeAnchors, RangeAnchor, commentHighlightStyles as highlightStyles} from 'pageflow-scrolled/review';
import {PlainEditableText, renderElement, renderLeaf} from '../EditableText';
import {useContentElementAttributes} from '../useContentElementAttributes';
import {useAddCommentMode} from './AddCommentModeProvider';
import {useSelectedSubject} from './SelectedSubjectProvider';
import {AddCommentHint} from './AddCommentHint';
import {PopoversColumn} from './PopoversColumn';
import {slateSelection} from './slateSelection';

import textStyles from '../EditableText.module.css';
import commentingStyles from './EditableTextHighlight.module.css';

const defaultValue = [{
  type: 'paragraph',
  children: [{text: ''}],
}];


export const EditableText = React.memo(function EditableText(props) {
  const {inlineComments} = useContentElementAttributes();

  if (inlineComments) {
    return <CommentingEditableText {...props} />;
  }

  return <PlainEditableText {...props} />;
});

function CommentingEditableText({
  value, className, scaleCategory = 'body', typographyVariant, typographySize
}) {
  const editor = useMemo(() => withLinks(withReact(createEditor())), []);
  const {anchors, registerAnchor} = useRangeAnchors();
  const {contentElementPermaId} = useContentElementAttributes();
  const {active, deactivate, preselect, clearPreselection} = useAddCommentMode();
  const {subjectRange, select} = useSelectedSubject('ContentElement', contentElementPermaId);
  const threads = useCommentThreads(
    {subjectType: 'ContentElement', subjectId: contentElementPermaId},
    {resolved: false}
  );

  const highlights = useCommentHighlights(threads, subjectRange);

  usePreselection(editor, contentElementPermaId, threads, active, preselect, clearPreselection);
  const handleMouseUp = useSelectTextOnMouseUp(active, editor, threads, deactivate, select);

  const decorate = useMemo(
    () => decorateCommentHighlights(editor, highlights),
    [editor, highlights]
  );

  const renderLeafCb = useCallback(({attributes, children, leaf}) => {
    if (leaf.commentHighlight) {
      children = (
        <ClickableHighlight subjectRange={leaf.subjectRange}>
          {children}
        </ClickableHighlight>
      );
    }

    if (leaf.firstInRange) {
      children = (
        <RangeAnchor rangeKey={leaf.rangeKey} onRegister={registerAnchor}>
          {children}
        </RangeAnchor>
      );
    }

    return renderLeaf({attributes, children, leaf});
  }, [registerAnchor]);

  return (
    <div ref={anchors.containerRef}
         className={classNames(textStyles.root, className,
                              {[commentingStyles.activeOverlay]: active && !subjectRange})}
         data-add-comment-overlay
         style={{position: 'relative'}}>
      <Text scaleCategory={scaleCategory}
            typographyVariant={typographyVariant}
            typographySize={typographySize}>
        <Slate editor={editor}
               value={value || defaultValue}
               onChange={() => {}}>
          <Editable key={(subjectRange ? 'highlighted' : 'plain') + threads.length}
                    onMouseUp={handleMouseUp}
                    readOnly
                    decorate={decorate}
                    renderElement={renderElement}
                    renderLeaf={renderLeafCb} />
        </Slate>
      </Text>
      {active && !subjectRange && <AddCommentHint />}
      <PopoversColumn highlights={highlights}
                      anchors={anchors} />
    </div>
  );
}

function ClickableHighlight({subjectRange, children}) {
  const {contentElementPermaId} = useContentElementAttributes();
  const {deactivate} = useAddCommentMode();
  const {isSelected, select} = useSelectedSubject('ContentElement', contentElementPermaId, subjectRange);

  function handleClick(event) {
    if (event.target.closest('a')) return;
    if (isSelected) return;

    deactivate();
    select();
  }

  return (
    <span className={classNames(highlightStyles.highlight,
                                {[highlightStyles.selected]: isSelected,
                                 [commentingStyles.clickable]: !isSelected})}
          data-comment-highlight
          onClick={handleClick}>
      {children}
    </span>
  );
}

function useSelectTextOnMouseUp(active, editor, threads, deactivate, select) {
  return useCallback((event) => {
    if (!active) return;

    const slateRange = slateSelection.inEditor(editor) ||
                       topLevelRangeFromEvent(editor, event);
    if (!slateRange) return;

    const matchingThread = findMatchingThread(threads, slateRange);

    deactivate();
    select({
      subjectRange: matchingThread?.subjectRange || slateRange,
      showNewForm: !matchingThread
    });
  }, [active, editor, threads, deactivate, select]);
}

function topLevelRangeFromEvent(editor, event) {
  if (event.target.closest('a')) return null;
  if (event.target.closest('[data-comment-highlight]')) return null;

  try {
    const node = ReactEditor.toSlateNode(editor, event.target);
    const path = ReactEditor.findPath(editor, node);
    if (!path.length) return null;
    return Editor.range(editor, [path[0]]);
  }
  catch (e) {
    return null;
  }
}

function usePreselection(editor, contentElementPermaId, threads, active, preselect, clearPreselection) {
  useEffect(() => {
    function handleSelectionChange() {
      if (active) return;

      const slateRange = slateSelection.inEditor(editor);

      if (slateRange) {
        const matchingThread = findMatchingThread(threads, slateRange);

        preselect({
          subjectType: 'ContentElement',
          subjectId: contentElementPermaId,
          subjectRange: matchingThread?.subjectRange || slateRange,
          showNewForm: !matchingThread
        });
      }
      else {
        clearPreselection(contentElementPermaId);
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [editor, contentElementPermaId, threads, active, preselect, clearPreselection]);
}

function findMatchingThread(threads, slateRange) {
  const key = JSON.stringify(slateRange);
  return threads.find(t => JSON.stringify(t.subjectRange) === key);
}

function withLinks(editor) {
  const {isInline} = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  return editor;
}
