import i18nModule from 'i18n';
import {t, locale} from 'i18n/selectors';
import createStore from 'createStore';

import {expect} from 'support/chai';
import sinon from 'sinon';

describe('i18n', () => {
  beforeEach(() => {
    window.I18n = {
      t: sinon.spy()
    };
  });

  afterEach(() => {
    delete window.I18n;
  });

  it('provides t selector to fetch translations', () => {
    const store = createStore([i18nModule], {locale: 'fr'});

    t(store.getState())('some.key');

    expect(I18n.t).to.have.been.calledWith('some.key', {locale: 'fr'});
  });

  it('provides locale selector to fetch locale name', () => {
    const store = createStore([i18nModule], {locale: 'fr'});

    const result = locale(store.getState());

    expect(result).to.eq('fr');
  });
});
