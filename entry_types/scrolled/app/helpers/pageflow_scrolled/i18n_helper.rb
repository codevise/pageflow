module PageflowScrolled
  # @api private
  module I18nHelper
    def scrolled_i18n_translations(entry,
                                   include_inline_editing: false,
                                   include_review: false)
      result = scrolled_i18n_public_translations(entry)

      if include_inline_editing
        result = result.deep_merge(I18n.locale.to_s => {
                                     pageflow_scrolled: {
                                       inline_editing: I18n.t('pageflow_scrolled.inline_editing')
                                     }
                                   })
      end

      if include_review
        result = result.deep_merge(I18n.locale.to_s => {
                                     pageflow_scrolled: {
                                       review: I18n.t('pageflow_scrolled.review')
                                     }
                                   })
      end

      result
    end

    private

    MERGE_IGNORING_NIL = lambda do |_, fallback, value|
      value.presence || fallback
    end

    def scrolled_i18n_public_translations(entry)
      locales = [I18n.default_locale, *I18n.fallbacks[entry.locale].reverse].uniq

      translations = locales.reduce({}) do |result, locale|
        result.deep_merge(
          I18n.t('pageflow_scrolled.public', locale:, default: {}),
          &MERGE_IGNORING_NIL
        )
      end

      {
        entry.locale => {
          pageflow_scrolled: {public: translations}
        }
      }
    end
  end
end
