import React, {useContext, useEffect, useState, createContext, useMemo, useRef} from 'react';
import classNames from 'classnames';
import {
  useFloating,
  FloatingPortal,
  FloatingArrow,
  arrow,
  shift,
  offset,
  inline,
  autoUpdate
} from '@floating-ui/react';

import {useI18n} from '../i18n';
import {useChapter, useDownloadableFile} from '../../entryState';
import {useMainStoryline} from '../../entryState/structure';
import {SectionThumbnail} from '../SectionThumbnail';
import {useFloatingPortalRoot} from '../FloatingPortalRootProvider';

import styles from './LinkTooltip.module.css';

import ExternalLinkIcon from './images/externalLink.svg';

const UpdateContext = createContext();

export function LinkTooltipProvider(props) {
  const update = useContext(UpdateContext);

  if (update) {
    return props.children;
  }
  else {
    return (
      <LinkTooltipProviderInner {...props} />
    );
  }
}

export function LinkTooltipProviderInner({
  disabled, position, floatingStrategy, children, align = 'left', gap = 10
}) {
  const [state, setState] = useState();

  const arrowRef = useRef();

  const {refs, floatingStyles, context: floatingContext} = useFloating({
    strategy: floatingStrategy,
    placement: `${position === 'below' ? 'bottom' : 'top'}${align === 'left' ? '-start' : ''}`,
    middleware: [
      offset(gap),
      shift(),
      arrow({element: arrowRef, padding: 10}),
      inline()
    ],
    whileElementsMounted: autoUpdate
  });

  const update = useMemo(() => {
    let timeout;

    return {
      activate(href, openInNewTab, linkRef) {
        clearTimeout(timeout);
        timeout = null;

        refs.setReference(linkRef.current);

        setState({
          href,
          openInNewTab
        });
      },

      keep() {
        clearTimeout(timeout);
        timeout = null;
      },

      deactivate({delay = 200} = {}) {
        if (!timeout) {
          timeout = setTimeout(() => {
            timeout = null;
            setState(null)
          }, delay);
        }
      }
    }
  }, [refs]);

  return (
    <UpdateContext.Provider value={update}>
      <FloatingPortal root={useFloatingPortalRoot()}>
        <LinkTooltip state={state}
                     setFloating={refs.setFloating}
                     floatingStyles={floatingStyles}
                     floatingContext={floatingContext}
                     arrowRef={arrowRef}
                     disabled={disabled} />
      </FloatingPortal>
      {children}
    </UpdateContext.Provider>
  );
}

export function LinkPreview({disabled, href, openInNewTab, children, className}) {
  const {activate, deactivate} = useContext(UpdateContext);
  const ref = useRef();

  useEffect(() => {
    if (disabled) {
      deactivate({delay: 0})
    }
  }, [disabled, deactivate])

  return (
    <span ref={ref}
          className={className}
          onMouseEnter={() => !disabled && activate(href, openInNewTab, ref)}
          onMouseLeave={() => !disabled && deactivate()}>
      {children}
    </span>
  );
}

export function LinkTooltip({disabled, setFloating, floatingStyles, floatingContext, arrowRef, state}) {
  const {keep, deactivate} = useContext(UpdateContext);

  if (disabled || !state || !state.href) {
    return null;
  }

  return (
    <div ref={setFloating}
         className={classNames(styles.linkTooltip)}
         onClick={e => e.stopPropagation()}
         onMouseEnter={keep}
         onMouseLeave={deactivate}
         style={floatingStyles}>
      <FloatingArrow ref={arrowRef}
                     context={floatingContext} />
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
  const mainStoryline = useMainStoryline();
  const {t} = useI18n({locale: 'ui'});

  if (!chapter) {
    return (
      <span>{t('pageflow_scrolled.inline_editing.link_tooltip.deleted_chapter')}</span>
    );
  }

  const isExcursion = mainStoryline && chapter.storylineId !== mainStoryline.id;

  if (isExcursion) {
    return (
      <a href={`#${chapter.chapterSlug}`}
         title={t('pageflow_scrolled.inline_editing.link_tooltip.visit_excursion')}>
        {chapter.title ?
         t('pageflow_scrolled.inline_editing.link_tooltip.excursion_with_title', {title: chapter.title}) :
         t('pageflow_scrolled.inline_editing.link_tooltip.untitled_excursion')}
      </a>
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
  const file = useDownloadableFile(fileOptions);
  const {t} = useI18n({locale: 'ui'});

  if (!file) {
    return (
      <span>
        {t('pageflow_scrolled.inline_editing.link_tooltip.deleted_file')}
      </span>
    );
  }

  return (
    <a href={file.urls.download}
       target="_blank"
       rel="noopener noreferrer">
      {file.displayName}
      <ExternalLinkIcon width={10} height={10} />
    </a>
  );
}
