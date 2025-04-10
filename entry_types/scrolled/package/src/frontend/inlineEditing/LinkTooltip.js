import React, {useContext, useState, createContext, useMemo, useRef} from 'react';
import classNames from 'classnames';

import {useI18n} from '../i18n';
import {useChapter, useFile} from '../../entryState';
import {SectionThumbnail} from '../SectionThumbnail';

import styles from './LinkTooltip.module.css';

import ExternalLinkIcon from './images/externalLink.svg';

const UpdateContext = createContext();

export function LinkTooltipProvider({
  disabled, position, children, align = 'left', gap = 10
}) {
  const [state, setState] = useState();
  const outerRef = useRef();

  const update = useMemo(() => {
    let timeout;

    return {
      activate(href, openInNewTab, linkRef) {
        clearTimeout(timeout);
        timeout = null;

        const outerRect = outerRef.current.getBoundingClientRect();
        const linkRect = linkRef.current.getBoundingClientRect();

        setState({
          href,
          openInNewTab,
          top: position === 'below' ?
               linkRect.bottom - outerRect.top + gap :
               'auto',
          bottom: position === 'above' ?
                  outerRect.bottom - linkRect.top + gap :
                  'auto',
          left: linkRect.left - outerRect.left +
                (align === 'center' ? linkRect.width / 2 : 0)
        });
      },

      keep() {
        clearTimeout(timeout);
        timeout = null;
      },

      deactivate() {
        if (!timeout) {
          timeout = setTimeout(() => {
            timeout = null;
            setState(null)
          }, 200);
        }
      }
    }
  }, [position, align, gap]);

  return (
    <UpdateContext.Provider value={update}>
      <div ref={outerRef}>
        <LinkTooltip state={state}
                     disabled={disabled}
                     position={position}
                     align={align} />
        {children}
      </div>
    </UpdateContext.Provider>
  );
}

export function LinkPreview({href, openInNewTab, children, className}) {
  const {activate, deactivate} = useContext(UpdateContext);
  const ref = useRef();
  return (
    <span ref={ref}
          className={className}
          onMouseEnter={() => activate(href, openInNewTab, ref)}
          onMouseLeave={deactivate}
          onMouseDown={deactivate}>
      {children}
    </span>
  );
}

export function LinkTooltip({disabled, position, align, state}) {
  const {keep, deactivate} = useContext(UpdateContext);

  if (disabled || !state || !state.href) {
    return null;
  }

  return (
    <div className={classNames(styles.linkTooltip,
                               styles[`position-${position}`],
                               styles[`align-${align}`])}
         onClick={e => e.stopPropagation()}
         onMouseEnter={keep}
         onMouseLeave={deactivate}
         style={{top: state.top, bottom: state.bottom, left: state.left}}>
      <LinkDestination href={state.href} openInNewTab={state.openInNewTab} />
    </div>
  );
}

function LinkDestination({href, openInNewTab}) {
  if (href?.chapter) {
    return (
      <ChapterLinkDestination permaId={href.chapter} />
    )
  }
  else if (href?.section) {
    return (
      <SectionLinkDestination permaId={href.section} />
    )
  }
  else if (href?.file) {
    return (
      <FileLinkDestination fileOptions={href.file} />
    )
  }
  else {
    return (
      <ExternalLinkDestination href={href} openInNewTab={openInNewTab} />
    );
  }
}

function ChapterLinkDestination({permaId}) {
  const chapter = useChapter({permaId});
  const {t} = useI18n({locale: 'ui'});

  if (!chapter) {
    return (
      <span>{t('pageflow_scrolled.inline_editing.link_tooltip.deleted_chapter')}</span>
    );
  }

  return (
    <a href={`#${chapter.chapterSlug}`}
       title={t('pageflow_scrolled.inline_editing.link_tooltip.visit_chapter')}>
      <span className={styles.chapterNumber}>
        {t('pageflow_scrolled.inline_editing.link_tooltip.chapter_number',
           {number: chapter.index + 1})}
      </span> {chapter.title}
    </a>
  );
}

function SectionLinkDestination({permaId}) {
  const {t} = useI18n({locale: 'ui'});

  return (
    <div className={styles.thumbnail}>
      <SectionThumbnail sectionPermaId={permaId} />
      <a href={`#section-${permaId}`}
         className={styles.thumbnailClickMask}
         title={t('pageflow_scrolled.inline_editing.link_tooltip.visit_section')}>
      </a>
    </div>
  );
}

function ExternalLinkDestination({href, openInNewTab}) {
  const {t} = useI18n({locale: 'ui'});

  return (
    <>
      <a href={href}
         target="_blank"
         rel="noopener noreferrer">
        {href}
        <ExternalLinkIcon width={10} height={10} />
      </a>
      <div className={styles.newTab}>
        {openInNewTab ?
         t('pageflow_scrolled.inline_editing.link_tooltip.opens_in_new_tab') :
         t('pageflow_scrolled.inline_editing.link_tooltip.opens_in_same_tab')}
      </div>
    </>
  );
}

function FileLinkDestination({fileOptions}) {
  const file = useFile(fileOptions);
  const {t} = useI18n({locale: 'ui'});

  if (!file) {
    return (
      <span>
        {t('pageflow_scrolled.inline_editing.link_tooltip.deleted_file')}
      </span>
    );
  }

  return (
    <a href={file.urls.original}
       target="_blank"
       rel="noopener noreferrer">
      {file.urls.original.split('/').pop()}
      <ExternalLinkIcon width={10} height={10} />
    </a>
  );
}
