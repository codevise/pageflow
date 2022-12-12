import {renderEntry} from 'support/pageObjects';

describe('section dom id', () => {
  it('adds padding to bottom of section by default', () => {
    const {container} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}]
      }
    });

    expect(container.querySelector('section#section-6')).not.toBeNull();
  });
});
