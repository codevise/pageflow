import i18nModule from 'i18n';
import {t, locale} from 'i18n/selectors';
import createStore from 'createStore';

import {expect} from 'support/chai';
import stubI18n from 'support/stubI18n';

describe('i18n', () => {
  stubI18n();

  it('provides t selector to fetch translations', () => {
    const store = createStore([i18nModule], {locale: 'fr'});

    t(store.getState())('some.key');

    expect(I18n.t).to.have.been.calledWith('some.key', {locale: 'fr'});
  });

  it('provides locale selector to fetch locale name', () => {
    const store = createStore([i18nModule], {locale: 'fr'});

    const result = locale(store.getState());

    expect(result).toBe('fr');
  });
});
