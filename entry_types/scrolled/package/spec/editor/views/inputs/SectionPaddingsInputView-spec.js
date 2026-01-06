import '@testing-library/jest-dom/extend-expect';

import {SectionPaddingsInputView} from 'editor/views/inputs/SectionPaddingsInputView';
import {editor} from 'pageflow/editor';

import {useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';
import userEvent from '@testing-library/user-event';

describe('SectionPaddingsInputView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.section_paddings_input.motif': 'Motif'
  });

  beforeEach(() => {
    jest.spyOn(editor, 'navigate').mockImplementation(() => {});
  });

  it('displays Motif prefix for paddingTop when exposeMotifArea is true', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {exposeMotifArea: true, paddingTop: 'lg'}}],
      themeOptions: {
        properties: {
          root: {
            'sectionPaddingTop-sm': '10vh',
            'sectionPaddingTop-lg': '30vh'
          }
        }
      },
      themeTranslations: {
        scales: {
          sectionPaddingTop: {
            sm: 'Small',
            lg: 'Large'
          }
        }
      }
    });

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button')).toHaveTextContent('Motif/Large');
  });

  it('displays Motif prefix for portraitPaddingTop when exposeMotifArea is true', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {
        exposeMotifArea: true,
        customPortraitPaddings: true,
        paddingTop: 'sm',
        portraitPaddingTop: 'lg'
      }}],
      themeOptions: {
        properties: {
          root: {
            'sectionPaddingTop-sm': '10vh',
            'sectionPaddingTop-lg': '30vh'
          }
        }
      },
      themeTranslations: {
        scales: {
          sectionPaddingTop: {
            sm: 'Small',
            lg: 'Large'
          }
        }
      }
    });

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button')).toHaveTextContent('Motif/Small');
    expect(getByRole('button')).toHaveTextContent('Motif/Large');
  });

  it('displays default value text when no padding is set', () => {
    const entry = createEntry({
      sections: [{id: 1}],
      themeOptions: {
        properties: {
          root: {
            'sectionPaddingTop-sm': '10vh',
            'sectionPaddingTop-md': '20vh',
            'sectionDefaultPaddingTop': '20vh'
          }
        }
      },
      themeTranslations: {
        scales: {
          sectionPaddingTop: {
            sm: 'Small',
            md: 'Medium'
          }
        }
      }
    });

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button')).toHaveTextContent('Medium');
  });

  it('displays paddingTop value text', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {paddingTop: 'sm'}}],
      themeOptions: {
        properties: {
          root: {
            'sectionPaddingTop-sm': '10vh',
            'sectionPaddingTop-md': '20vh'
          }
        }
      },
      themeTranslations: {
        scales: {
          sectionPaddingTop: {
            sm: 'Small',
            md: 'Medium'
          }
        }
      }
    });

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button')).toHaveTextContent('Small');
  });

  it('displays paddingBottom value text', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {paddingBottom: 'lg'}}],
      themeOptions: {
        properties: {
          root: {
            'sectionPaddingBottom-sm': '10vh',
            'sectionPaddingBottom-lg': '30vh'
          }
        }
      },
      themeTranslations: {
        scales: {
          sectionPaddingBottom: {
            sm: 'Small',
            lg: 'Large'
          }
        }
      }
    });

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button')).toHaveTextContent('Large');
  });

  it('hides portrait paddings when customPortraitPaddings is false even if portrait values set', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {
        paddingTop: 'sm',
        paddingBottom: 'md',
        portraitPaddingTop: 'lg',
        portraitPaddingBottom: 'lg'
      }}],
      themeOptions: {
        properties: {
          root: {
            'sectionPaddingTop-sm': '10vh',
            'sectionPaddingTop-lg': '30vh',
            'sectionPaddingBottom-md': '20vh',
            'sectionPaddingBottom-lg': '30vh'
          }
        }
      },
      themeTranslations: {
        scales: {
          sectionPaddingTop: {
            sm: 'Small',
            lg: 'Large'
          },
          sectionPaddingBottom: {
            md: 'Medium',
            lg: 'Large'
          }
        }
      }
    });

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const {getByRole, queryAllByText} = renderBackboneView(view);

    expect(getByRole('button')).toHaveTextContent('Small');
    expect(getByRole('button')).toHaveTextContent('Medium');
    queryAllByText('Large').forEach(el => expect(el).not.toBeVisible());
  });

  it('displays portrait paddings when customPortraitPaddings is true', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {
        customPortraitPaddings: true,
        paddingTop: 'sm',
        portraitPaddingTop: 'lg'
      }}],
      themeOptions: {
        properties: {
          root: {
            'sectionPaddingTop-sm': '10vh',
            'sectionPaddingTop-lg': '30vh'
          }
        }
      },
      themeTranslations: {
        scales: {
          sectionPaddingTop: {
            sm: 'Small',
            lg: 'Large'
          }
        }
      }
    });

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button')).toHaveTextContent('Small');
    expect(getByRole('button')).toHaveTextContent('Large');
  });

  it('displays default values for portrait paddings when customPortraitPaddings is true but values not set', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {
        customPortraitPaddings: true,
        paddingTop: 'lg'
      }}],
      themeOptions: {
        properties: {
          root: {
            'sectionPaddingTop-sm': '10vh',
            'sectionPaddingTop-lg': '30vh',
            'sectionDefaultPaddingTop': '10vh'
          }
        }
      },
      themeTranslations: {
        scales: {
          sectionPaddingTop: {
            sm: 'Small',
            lg: 'Large'
          }
        }
      }
    });

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button')).toHaveTextContent('Large');
    expect(getByRole('button')).toHaveTextContent('Small');
  });

  it('triggers scrollToSection when clicking button', async () => {
    const entry = createEntry({
      sections: [{id: 1}]
    });
    const listener = jest.fn();
    entry.on('scrollToSection', listener);

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const user = userEvent.setup();
    const {getByRole} = renderBackboneView(view);

    await user.click(getByRole('button'));

    expect(listener).toHaveBeenCalledWith(entry.sections.get(1), {ifNeeded: true});
  });

  it('navigates to paddings editor when clicking button', async () => {
    const entry = createEntry({
      sections: [{id: 1}]
    });

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const user = userEvent.setup();
    const {getByRole} = renderBackboneView(view);

    await user.click(getByRole('button'));

    expect(editor.navigate).toHaveBeenCalledWith('/scrolled/sections/1/paddings', {trigger: true});
  });

  it('triggers selectSectionPaddings when clicking button', async () => {
    const entry = createEntry({
      sections: [{id: 1}]
    });
    const listener = jest.fn();
    entry.on('selectSectionPaddings', listener);

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const user = userEvent.setup();
    const {getByRole} = renderBackboneView(view);

    await user.click(getByRole('button'));

    expect(listener).toHaveBeenCalledWith(entry.sections.get(1));
  });

  it('uses appearance-scoped default value for paddingTop', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {appearance: 'cards'}}],
      themeOptions: {
        properties: {
          root: {
            'sectionPaddingTop-sm': '10vh',
            'sectionPaddingTop-lg': '30vh',
            'sectionDefaultPaddingTop': '10vh'
          },
          cardsAppearanceSection: {
            'sectionDefaultPaddingTop': '30vh'
          }
        }
      },
      themeTranslations: {
        scales: {
          sectionPaddingTop: {
            sm: 'Small',
            lg: 'Large'
          }
        }
      }
    });

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const {getByRole} = renderBackboneView(view);

    // Should display 'Large' (lg) because cardsAppearanceSection defaults to 30vh
    // rather than 'Small' (sm) from root default of 10vh
    expect(getByRole('button')).toHaveTextContent('Large');
  });

  it('updates displayed default value when appearance changes', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {appearance: 'shadow', exposeMotifArea: false}}],
      themeOptions: {
        properties: {
          root: {
            'sectionPaddingTop-sm': '10vh',
            'sectionPaddingTop-lg': '30vh',
            'sectionDefaultPaddingTop': '10vh'
          },
          cardsAppearanceSection: {
            'sectionDefaultPaddingTop': '30vh'
          }
        }
      },
      themeTranslations: {
        scales: {
          sectionPaddingTop: {
            sm: 'Small',
            lg: 'Large'
          }
        }
      }
    });

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button')).toHaveTextContent('Small');

    entry.sections.get(1).configuration.set('appearance', 'cards');

    expect(getByRole('button')).toHaveTextContent('Large');
  });
});
