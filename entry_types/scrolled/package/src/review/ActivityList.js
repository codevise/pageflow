import React, {useState} from 'react';

import {useI18n, useLocale} from 'pageflow-scrolled/frontend';
import {Thread} from './Thread';
import {CommentThreadReadsSnapshot} from './commentThreadReadsSnapshot';
import {useActivityEntries} from './activityEntries';
import {formatDate} from './formatDate';
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
      {dayGroups(shown).map(group =>
        <React.Fragment key={group.day}>
          <DayHeading day={group.day} at={group.at} />
          {group.entries.map(entry =>
            <Entry key={entry.key}
                   entry={entry}
                   day={group.day}
                   highlighted={entry.threadId === highlightedThreadId}
                   onClick={onEntryClick && (() => onEntryClick(entry))} />
          )}
        </React.Fragment>
      )}

      {shown.length < entries.length &&
        <button className={styles.showMore} onClick={() => setPages(pages + 1)}>
          {t('pageflow_scrolled.review.activity.show_more')}
        </button>}
    </div>
  );
}

function Entry({entry, day, highlighted, onClick}) {
  const {t} = useI18n({locale: 'ui'});
  const [expanded, setExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.entry}>
      <p className={styles.summary}>{summary(t, entry, day)}</p>
      <Thread thread={entry.thread}
              visibleReplyCount={expanded ? undefined : visibleReplyCount(entry, day)}
              onExpandReplies={() => setExpanded(true)}
              collapsed={collapsed}
              onToggle={() => setCollapsed(!collapsed)}
              onClick={onClick}
              highlighted={highlighted}
              onResolve={() => postUpdateThreadMessage({
                threadId: entry.threadId,
                resolved: !entry.resolved
              })} />
    </div>
  );
}

// What happened to the thread on the day the row is listed under, which
// is what puts it there.
function summary(t, {thread}, day) {
  const replies = thread.comments.slice(1);

  const parts = [
    onDay(thread.comments[0], day) && t('pageflow_scrolled.review.activity.summary.topic'),
    replyCountPart(t, replies.filter(reply => onDay(reply, day)).length),
    thread.resolvedAt && dayOf(thread.resolvedAt) === day &&
      t('pageflow_scrolled.review.activity.summary.resolution')
  ].filter(Boolean);

  return joinParts(t, parts);
}

function replyCountPart(t, count) {
  return count > 0 &&
         t('pageflow_scrolled.review.activity.summary.reply_count', {count});
}

function onDay(comment, day) {
  return dayOf(comment.createdAt) === day;
}

function joinParts(t, parts) {
  if (parts.length < 2) {
    return parts[0];
  }

  return [parts.slice(0, -1).join(', '), parts[parts.length - 1]]
    .join(t('pageflow_scrolled.review.activity.summary.and'));
}

// Everything said on the day the row is listed under, falling back to
// the latest reply so that a row never shows a thread without the comment
// it is listed for.
function visibleReplyCount({thread}, day) {
  const replies = thread.comments.slice(1);
  const firstOfDay = replies.findIndex(reply => dayOf(reply.createdAt) === day);

  return firstOfDay < 0 ? Math.min(replies.length, 1) : replies.length - firstOfDay;
}

function DayHeading({day, at}) {
  const {t} = useI18n({locale: 'ui'});
  const locale = useLocale({locale: 'ui'});

  return (
    <h3 className={styles.dayHeading}>
      <time dateTime={day}>{dayLabel(t, {day, at}, locale)}</time>
    </h3>
  );
}

// Grouping the shown slice rather than every entry keeps a day that spans
// the "show more" boundary from being headed twice.
function dayGroups(entries) {
  const groups = [];

  entries.forEach(entry => {
    const day = dayOf(entry.at);
    const current = groups[groups.length - 1];

    if (current && current.day === day) {
      current.entries.push(entry);
    }
    else {
      groups.push({day, at: entry.at, entries: [entry]});
    }
  });

  return groups;
}

function dayOf(at) {
  const date = new Date(at);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
}

// Formatted from a timestamp within the day: a bare date parses as UTC
// midnight, which reads as the day before west of it.
function dayLabel(t, {day, at}, locale) {
  const days = daysSince(day);

  if (days === 0) {
    return t('pageflow_scrolled.review.activity.today');
  }

  if (days === 1) {
    return t('pageflow_scrolled.review.activity.yesterday');
  }

  return formatDate(at, locale);
}

function daysSince(day) {
  const [year, month, date] = day.split('-').map(Number);
  const then = new Date(year, month - 1, date);
  const now = new Date();

  return Math.round(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()) - then) / 86400000
  );
}
