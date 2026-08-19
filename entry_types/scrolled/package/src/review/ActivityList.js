import React, {useState} from 'react';

import {useI18n} from 'pageflow-scrolled/frontend';
import {Thread} from './Thread';
import {CommentThreadReadsSnapshot} from './commentThreadReadsSnapshot';
import {useActivityEntries} from './activityEntries';
import {postUpdateThreadMessage} from './postMessage';

import styles from './ActivityList.module.css';

export function ActivityList({onEntryClick, highlightedThreadId, pageSize = 30}) {
  return (
    <CommentThreadReadsSnapshot>
      <Entries onEntryClick={onEntryClick}
               highlightedThreadId={highlightedThreadId}
               pageSize={pageSize} />
    </CommentThreadReadsSnapshot>
  );
}

// Reading the entries has to happen inside the snapshot for the freeze to
// apply.
function Entries({onEntryClick, highlightedThreadId, pageSize}) {
  const {t} = useI18n({locale: 'ui'});
  const entries = useActivityEntries();
  const [pages, setPages] = useState(1);

  if (!entries.length) {
    return (
      <p className={styles.blankSlate}>
        {t('pageflow_scrolled.review.activity.no_activity_yet')}
      </p>
    );
  }

  const shown = entries.slice(0, pages * pageSize);

  return (
    <div className={styles.list}>
      {shown.map(entry =>
        <Entry key={entry.key}
               entry={entry}
               highlighted={entry.threadId === highlightedThreadId}
               onClick={onEntryClick && (() => onEntryClick(entry))} />
      )}

      {shown.length < entries.length &&
        <button className={styles.showMore} onClick={() => setPages(pages + 1)}>
          {t('pageflow_scrolled.review.activity.show_more')}
        </button>}
    </div>
  );
}

function Entry({entry, highlighted, onClick}) {
  const [expanded, setExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Thread thread={entry.thread}
            visibleReplyCount={expanded ? undefined : 1}
            onExpandReplies={() => setExpanded(true)}
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
            onClick={onClick}
            highlighted={highlighted}
            onResolve={() => postUpdateThreadMessage({
              threadId: entry.threadId,
              resolved: !entry.resolved
            })} />
  );
}

