import React from 'react';
import {FloatingArrow} from '@floating-ui/react';

import {useI18n} from '../i18n';
import {useLinkedEntryDestination} from 'pageflow-scrolled/entryState';
import {
  LinkTooltipProvider as SharedLinkTooltipProvider,
  useLinkTooltip
} from '../../shared/linkTooltip';

import styles from './LinkTooltip.module.css';

import ExternalLinkIcon from '../inlineEditing/images/externalLink.svg';

export function LinkTooltipProvider({children}) {
  return (
    <SharedLinkTooltipProvider tooltip={LinkTooltip}>
      {children}
    </SharedLinkTooltipProvider>
  );
}

export function usePreviewableLinkDestination(href) {
  const destination = useLinkedEntryDestination(href?.entry ? href : {});

  return destination && previewLabels[destination.linkedEntry.publicationState] ?
         destination :
         null;
}

function LinkTooltip({setFloating, floatingStyles, floatingContext, arrowRef, state}) {
  const {keep, deactivate} = useLinkTooltip();
  const destination = usePreviewableLinkDestination(state?.href);
  const {t} = useI18n({locale: 'ui'});

  if (!destination) {
    return null;
  }

  const {linkedEntry} = destination;
  const labels = previewLabels[linkedEntry.publicationState];

  return (
    <div ref={setFloating}
         className={styles.linkTooltip}
         onClick={event => event.stopPropagation()}
         onMouseEnter={keep}
         onMouseLeave={deactivate}
         style={floatingStyles}>
      <FloatingArrow ref={arrowRef}
                     context={floatingContext} />
      <div className={styles.entry}>
        <span>
          {destination.section ?
           `${t('pageflow_scrolled.review.link_tooltip.section_in')} ${linkedEntry.title}` :
           [linkedEntry.title, destination.chapter?.title].filter(Boolean).join(' › ')}
        </span>
        <span className={styles.pill}>
          {t(`pageflow_scrolled.review.link_tooltip.${labels.state}`)}
        </span>
      </div>
      <div className={styles.previewLink}>
        <a href={destination.previewUrl}
           target="_blank"
           rel="noopener noreferrer">
          {t(`pageflow_scrolled.review.link_tooltip.${labels.link}`)}
          <ExternalLinkIcon width={10} height={10} />
        </a>
      </div>
    </div>
  );
}

const previewLabels = {
  not_published: {state: 'not_published', link: 'open_preview'},
  published_with_password_protection: {state: 'password_protected', link: 'open_draft_preview'}
};
