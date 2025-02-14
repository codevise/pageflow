import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';
import {Model} from 'backbone';

describe('ScrolledEntry', () => {
  describe('#createLegacyTypographyVariantDelegator', () => {
    it('delegates model methods', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {},
            ...normalizeSeed()
          }
        }
      );
      const model = new Model();
      const listener = jest.fn();

      const delegator = entry.createLegacyTypographyVariantDelegator({model});
      delegator.on('change', listener);
      delegator.set('some', 'value');

      expect(delegator.get('some')).toEqual('value');
      expect(listener).toHaveBeenCalled();
    });

    it('leaves properties unchanged for non-legacy typographyVariant', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              lgAccent: {
                size: 'lg',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'highlight',
        paletteColor: 'primary'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor'
      });

      expect(delegator.get('typographyVariant')).toEqual('highlight');
      expect(delegator.get('paletteColor')).toEqual('primary');
    });

    it('rewrites legacy typographyVariant to paletteColor', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              highlightAccent: {
                variant: 'highlight',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'highlightAccent'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor',
      });

      expect(delegator.get('typographyVariant')).toEqual('highlight');
      expect(delegator.get('paletteColor')).toEqual('accent');
    });

    it('rewrites legacy typographyVariant to typographySize', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              lg: {
                size: 'lg'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'lg'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor',
      });

      expect(delegator.get('typographyVariant')).toBeUndefined();
      expect(delegator.get('typographySize')).toEqual('lg');
    });

    it('supports rewriting to default variant', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              accent: {
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'accent'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor',
      });

      expect(delegator.get('typographyVariant')).toBeUndefined();
      expect(delegator.get('paletteColor')).toEqual('accent');
    });

    it('allows overriding legacy typographyVariant paletteColor', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              lgAccent: {
                size: 'lg',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'lgAccent'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor'
      });
      delegator.set('paletteColor', 'primary')

      expect(delegator.get('typographySize')).toEqual('lg');
      expect(delegator.get('paletteColor')).toEqual('primary');
    });

    it('allows overriding legacy typographyVariant paletteColor with auto value', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              lgAccent: {
                size: 'lg',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'lgAccent'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor'
      });
      delegator.set('paletteColor', undefined)

      expect(delegator.get('typographySize')).toEqual('lg');
      expect(delegator.get('paletteColor')).toBeUndefined();
    });

    it('ignores blank paletteColor', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              lgAccent: {
                size: 'lg',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'lgAccent',
        paletteColor: ''
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor'
      });

      expect(delegator.get('typographySize')).toEqual('lg');
      expect(delegator.get('paletteColor')).toEqual('accent');
    });

    it('allows overriding legacy typographyVariant size', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              lgAccent: {
                size: 'lg',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'lgAccent'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'color'
      });
      delegator.set('typographySize', 'sm')

      expect(delegator.get('typographyVariant')).toBeUndefined();
      expect(delegator.get('color')).toEqual('accent');
      expect(delegator.get('typographySize')).toEqual('sm');
    });

    it('preserves already overriden size when overriding palette color', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              highlightAccent: {
                variant: 'highlight',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'highlightAccent',
        typographySize: 'sm'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor'
      });
      delegator.set('paletteColor', 'primary')

      expect(delegator.get('typographyVariant')).toEqual('highlight');
      expect(delegator.get('typographySize')).toEqual('sm');
      expect(delegator.get('paletteColor')).toEqual('primary');
    });

    it('preserves already overriden palette color when overriding size', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              highlightLg: {
                variant: 'highlight',
                paletteColor: 'accent',
                size: 'lg'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'highlightLg',
        paletteColor: 'primary'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor'
      });
      delegator.set('typographySize', 'sm')

      expect(delegator.get('typographyVariant')).toEqual('highlight');
      expect(delegator.get('typographySize')).toEqual('sm');
      expect(delegator.get('paletteColor')).toEqual('primary');
    });
  });
});
