import {Storyline, ChaptersCollection} from 'pageflow/editor';

describe('Storyline', () => {
  it('initializes configuration model from configuration attribute', () => {
    const storyline = new Storyline({configuration: {some: 'value'}},
                                    {chapters: new ChaptersCollection()});

    expect(storyline.configuration.get('some')).toBe('value');
  });

  it('triggers change:configuration event when configuration changes', () => {
    const storyline = new Storyline({id: 5, configuration: {some: 'value'}},
                                    {chapters: new ChaptersCollection()});
    const listener = jest.fn();

    storyline.on('change:configuration', listener);
    storyline.configuration.set('some', 'other value');

    expect(listener).toHaveBeenCalledWith(storyline, undefined, {});
  });

  it('triggers change:main event when configuration main attribute changes', () => {
    const stpryline = new Storyline({id: 5},
                                    {chapters: new ChaptersCollection()});
    const listener = jest.fn();

    stpryline.on('change:main', listener);
    stpryline.configuration.set('main', true);

    expect(listener).toHaveBeenCalled();
  });

  it('auto saves', () => {
    const storyline = new Storyline({id: 5, configuration: {some: 'value'}},
                                    {chapters: new ChaptersCollection()});
    storyline.save = jest.fn();

    storyline.configuration.set('some', 'other value');

    expect(storyline.save).toHaveBeenCalled();
  });

  it('includes configuration in data returned by toJSON', () => {
    const storyline = new Storyline({id: 5, configuration: {some: 'value'}},
                                    {chapters: new ChaptersCollection()});

    expect(storyline.toJSON()).toMatchObject({configuration: {some: 'value'}});
  });
});
