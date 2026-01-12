import {renderEntry} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect';

describe('section appearance scope class', () => {
  it('applies scope class for default shadow appearance', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).el).toHaveClass('scope-shadowAppearanceSection');
  });

  it('applies scope class for cards appearance', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6, configuration: {appearance: 'cards'}}],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).el).toHaveClass('scope-cardsAppearanceSection');
  });

  it('applies scope class for transparent appearance', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6, configuration: {appearance: 'transparent'}}],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).el).toHaveClass('scope-transparentAppearanceSection');
  });
});
