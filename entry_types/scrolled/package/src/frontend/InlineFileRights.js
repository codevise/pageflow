import React from 'react';

import {useI18n} from './i18n';
import {isBlank} from './utils/blank';
import {Widget} from './Widget';

import styles from './InlineFileRights.module.css';

export function InlineFileRights({items = [],
                                  context = 'standAlone',
                                  playerControlsFadedOut,
                                  playerControlsStandAlone}) {
  const {t} = useI18n();
  const filteredItems = items.filter(item =>
    item.file && item.file.inlineRights && !isBlank(item.file.rights)
  );

  if (!filteredItems.length) {
    return null;
  }

  return (
    <Widget role="inlineFileRights"
            props={{context, playerControlsFadedOut, playerControlsStandAlone}}>
      <ul className={styles.list}>
        {filteredItems.map(({label, file}) =>
          <li key={`${label}-${file.id}`}>

            {label &&
              <span>{t(label, {scope: 'pageflow_scrolled.public.inline_file_rights_labels'})}: </span>}
            {renderRights(file)}
            {renderLicense(file)}
          </li>
        )}
      </ul>
    </Widget>
  );
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
