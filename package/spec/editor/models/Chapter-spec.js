import {Chapter, PagesCollection} from 'pageflow/editor';

describe('Chapter', () => {
  it('initializes configuration model from configuration attribute', () => {
    const chapter = new Chapter({configuration: {some: 'value'}},
                                {pages: new PagesCollection()});

    expect(chapter.configuration.get('some')).toBe('value');
  });

  it('triggers change:configuration event when configuration changes', () => {
    const chapter = new Chapter({id: 5, configuration: {some: 'value'}},
                                {pages: new PagesCollection()});
    const listener = jest.fn();

    chapter.on('change:configuration', listener);
    chapter.configuration.set('some', 'other value');

    expect(listener).toHaveBeenCalledWith(chapter, undefined, {});
  });

  it('auto saves', () => {
    const chapter = new Chapter({id: 5, configuration: {some: 'value'}},
                                {pages: new PagesCollection()});
    chapter.save = jest.fn();

    chapter.configuration.set('some', 'other value');

    expect(chapter.save).toHaveBeenCalled();
  });

  it('includes all attributes in data returned by toJSON', () => {
    const chapter = new Chapter({title: 'Title', configuration: {some: 'value'}},
                                {pages: new PagesCollection()});

    expect(chapter.toJSON()).toMatchObject({
      title: 'Title',
      configuration: {some: 'value'}
    });
  });
});
