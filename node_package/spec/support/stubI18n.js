import sinon from 'sinon';

export default function stubI18n() {
  beforeEach(() => {
    window.I18n = {
      t: sinon.stub().returns('translation')
    };
  });

  afterEach(() => {
    delete window.I18n;
  });
};
