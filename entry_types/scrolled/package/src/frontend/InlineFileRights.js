import React from 'react';

import {AiIndicatorIcon} from './AiIndicatorIcon';
import {useI18n} from './i18n';
import {isBlank} from './utils/blank';
import {Widget} from './Widget';

import styles from './InlineFileRights.module.css';

export function InlineFileRights({items = [],
                                  context = 'standAlone',
                                  position,
                                  playerControlsFadedOut,
                                  playerControlsStandAlone,
                                  configuration = {}}) {
  const filteredItems = items.filter(item =>
    item.file && (hasRights(item.file) || hasAiIndicator(item.file))
  );

  if (!filteredItems.length) {
    return null;
  }

  return (
    <Widget role="inlineFileRights"
            props={{context, position,
                    playerControlsFadedOut, playerControlsStandAlone,
                    configuration,
                    hasRights: filteredItems.some(({file}) => hasRights(file)),
                    hasAiIndicators: filteredItems.some(({file}) => hasAiIndicator(file))}}>
      <ul className={styles.list}>
        {filteredItems.map(({label, file}) =>
          <Item key={`${label}-${file.id}`} label={label} file={file} />
        )}
      </ul>
    </Widget>
  );
}

function Item({label, file}) {
  const {t} = useI18n();

  return (
    <li data-rights={hasRights(file) ? '' : undefined}>
      {(label || hasRights(file)) &&
       <span data-part="rights">
         {label &&
           <span data-label>{t(label, {scope: 'pageflow_scrolled.public.inline_file_rights_labels'})}: </span>}
         {hasRights(file) && renderRights(file)}
         {hasRights(file) && renderLicense(file)}
       </span>}
      {hasAiIndicator(file) && ' '}
      {renderAiIndicator(file)}
    </li>
  );
}

function hasRights(file) {
  return file.inlineRights && !isBlank(file.rights);
}

function hasAiIndicator(file) {
  return !!file.configuration.ai_indicator;
}

function renderRights(file) {
  if (isBlank(file.configuration.source_url)) {
    return file.rights;
  }
  else {
    return (
      <a href={file.configuration.source_url} target="_blank" rel="noopener noreferrer">
        {file.rights}
      </a>
    );
  }
}

function renderLicense(file) {
  if (!file.license) {
    return null;
  }

  return (
    <>
      {' '}(<a href={file.license.url} target="_blank" rel="noopener noreferrer">{file.license.name}</a>)
    </>
  );
}

function renderAiIndicator(file) {
  if (!hasAiIndicator(file)) {
    return null;
  }

  return (
    <span data-part="ai-indicator">
      <AiIndicatorIcon kind={file.configuration.ai_indicator} className={styles.aiIcon} />
      {!isBlank(file.configuration.ai_indicator_text) &&
       ` ${file.configuration.ai_indicator_text}`}
    </span>
  );
}
