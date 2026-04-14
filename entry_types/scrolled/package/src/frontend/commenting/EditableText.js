import React, {useCallback, useMemo} from 'react';
import classNames from 'classnames';
import {createEditor, Text as SlateText, Range} from 'slate';
import {Slate, Editable, withReact} from 'slate-react';

import {Text} from '../Text';
import {PlainEditableText, renderElement, renderLeaf} from '../EditableText';
import {useContentElementAttributes} from '../useContentElementAttributes';
import {useAddCommentMode} from './AddCommentModeProvider';
import {useSelectedSubject} from './SelectedSubjectProvider';
import {AddCommentHint} from './AddCommentHint';
import {slateSelection} from './slateSelection';

import textStyles from '../EditableText.module.css';
import overlayStyles from './AddCommentOverlay.module.css';
import highlightStyles from './EditableTextHighlight.module.css';

const defaultValue = [{
  type: 'paragraph',
  children: [{text: ''}],
}];

const emptyDecorations = [];

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
  const {contentElementPermaId} = useContentElementAttributes();
  const {active, deactivate} = useAddCommentMode();
  const {subjectRange, select} = useSelectedSubject('ContentElement', contentElementPermaId);

  const handleMouseUp = useSelectTextOnMouseUp(active, editor, deactivate, select);

  const decorate = useCallback(([node, path]) => {
    if (!subjectRange || !SlateText.isText(node)) return emptyDecorations;

    const nodeRange = {
      anchor: {path, offset: 0},
      focus: {path, offset: node.text.length}
    };

    const intersection = Range.intersection(subjectRange, nodeRange);
    if (!intersection) return emptyDecorations;

    return [{...intersection, commentHighlight: true}];
  }, [subjectRange]);

  const renderLeafCb = useCallback(({attributes, children, leaf}) => {
    if (leaf.commentHighlight) {
      children = <span className={highlightStyles.highlight}>{children}</span>;
    }
    return renderLeaf({attributes, children, leaf});
  }, []);

  return (
    <div className={classNames(textStyles.root, className,
                              {[overlayStyles.highlight]: active && !subjectRange})}
         data-add-comment-overlay
         style={{position: 'relative'}}>
      <Text scaleCategory={scaleCategory}
            typographyVariant={typographyVariant}
            typographySize={typographySize}>
        <Slate editor={editor}
               value={value || defaultValue}
               onChange={() => {}}>
          <Editable key={subjectRange ? 'highlighted' : 'plain'}
                    onMouseUp={handleMouseUp}
                    readOnly
                    decorate={decorate}
                    renderElement={renderElement}
                    renderLeaf={renderLeafCb} />
        </Slate>
      </Text>
      {active && !subjectRange && <AddCommentHint />}
    </div>
  );
}

function useSelectTextOnMouseUp(active, editor, deactivate, select) {
  return useCallback(() => {
    if (!active) return;

    const slateRange = slateSelection.inEditor(editor);
    if (!slateRange) return;

    deactivate();
    select({showNewForm: true, subjectRange: slateRange});
  }, [active, editor, deactivate, select]);
}

function withLinks(editor) {
  const {isInline} = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  return editor;
}
