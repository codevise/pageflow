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
                variant: 'lg',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'sm',
        paletteColor: 'primary'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor'
      });

      expect(delegator.get('typographyVariant')).toEqual('sm');
      expect(delegator.get('paletteColor')).toEqual('primary');
    });

    it('rewrites legacy typographyVariant to paletteColor', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              lgAccent: {
                variant: 'lg',
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
        paletteColorPropertyName: 'paletteColor',
      });

      expect(delegator.get('typographyVariant')).toEqual('lg');
      expect(delegator.get('paletteColor')).toEqual('accent');
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
                variant: 'lg',
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

      expect(delegator.get('typographyVariant')).toEqual('lg');
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
                variant: 'lg',
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

      expect(delegator.get('typographyVariant')).toEqual('lg');
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
                variant: 'lg',
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

      expect(delegator.get('typographyVariant')).toEqual('lg');
      expect(delegator.get('paletteColor')).toEqual('accent');
    });
  });
});
