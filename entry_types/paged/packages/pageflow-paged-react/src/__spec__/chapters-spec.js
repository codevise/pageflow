import chaptersModule from 'chapters';
import {chapterAttribute} from 'chapters/selectors';
import createStore from 'createStore';


describe('chapters', () => {
  it('exports redux module for chapters collection', () => {
    const chapters = [
      {
        id: 100,
        title: 'Chapter 5',
        position: 4
      }
    ];
    const store = createStore([chaptersModule], {chapters});

    expect(chapterAttribute('title', {id: 100})(store.getState())).toBe('Chapter 5');
    expect(chapterAttribute('position', {id: 100})(store.getState())).toBe(4);
  });
});
