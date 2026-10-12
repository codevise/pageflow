import React, {useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {Combobox} from '@headlessui/react'
import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';
import {cssModulesUtils} from 'pageflow/ui';

import styles from './EntrySelectView.module.css';

export const EntrySelectView = Marionette.ItemView.extend({
  template: () => `
    <div class="${styles.container}"></div>
  `,

  ui: cssModulesUtils.ui(styles, 'container'),

  collectionEvents: {
    'add remove reset sync': 'renderCombobox'
  },

  initialize() {
    this.selectedEntryId = this.options.selectedEntryId;
  },

  onRender() {
    this.renderCombobox();
  },

  onClose() {
    ReactDOM.unmountComponentAtNode(this.ui.container[0]);
  },

  renderCombobox() {
    ReactDOM.render(
      <EntryCombobox entries={this.collection.toArray()}
                     label={this.options.label}
                     selectedEntry={this.collection.get(this.selectedEntryId) || null}
                     onSelect={entry => this.handleSelect(entry)} />,
      this.ui.container[0]
    );
  },

  handleSelect(entry) {
    this.selectedEntryId = entry?.id;
    this.renderCombobox();
    this.options.onSelect(entry);
  }
});

function EntryCombobox({entries, label, selectedEntry, onSelect}) {
  const [query, setQuery] = useState('');
  const buttonRef = useRef();

  const normalizedQuery = query.toLowerCase();
  const filteredEntries = entries.filter(entry =>
    entry.get('title').toLowerCase().includes(normalizedQuery)
  );

  function handleChange(entry) {
    setQuery('');
    onSelect(entry);
  }

  return (
    <Combobox value={selectedEntry} onChange={handleChange} nullable>
      {({open}) =>
        <>
          {label &&
           <Combobox.Label className={styles.label}>{label}</Combobox.Label>}
          <div className={styles.inputWrapper}>
            <Combobox.Input className={styles.input}
                            placeholder={I18n.t('pageflow_scrolled.editor.entry_select.placeholder')}
                            displayValue={entry => entry ? entry.get('title') : ''}
                            onClick={() => !open && buttonRef.current.click()}
                            onChange={event => setQuery(event.target.value)} />
            <Combobox.Button ref={buttonRef}
                             className={styles.button}
                             aria-label={I18n.t('pageflow_scrolled.editor.entry_select.show_entries')} />
          </div>
          <Combobox.Options className={styles.options}>
            {filteredEntries.map(entry =>
              <Option key={entry.id} value={entry}>
                <span className={styles.title}>{entry.get('title')}</span>
                <PublicationStatePill publicationState={entry.get('publicationState')} />
              </Option>
            )}
            {!filteredEntries.length &&
             <div className={styles.noMatches}>
               {I18n.t('pageflow_scrolled.editor.entry_select.no_matches')}
             </div>}
          </Combobox.Options>
        </>
      }
    </Combobox>
  );
}

function Option({value, children}) {
  return (
    <Combobox.Option value={value}>
      {({active}) =>
        <div className={classNames(styles.option, {[styles.activeOption]: active})}>
          {children}
        </div>
      }
    </Combobox.Option>
  );
}

function PublicationStatePill({publicationState}) {
  const label = pillLabels[publicationState];

  if (!label) {
    return null;
  }

  return (
    <span className={styles.pill}>
      {I18n.t(`pageflow_scrolled.editor.entry_select.${label}`)}
    </span>
  );
}

const pillLabels = {
  not_published: 'not_published',
  published_with_password_protection: 'password_protected'
};
