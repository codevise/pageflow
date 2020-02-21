module PageflowScrolled
  # @api private
  module I18nHelper
    def scrolled_i18n_translations(entry, include_inline_editing: false)
      result = scrolled_i18n_public_translations(entry)

      return result unless include_inline_editing

      result.deep_merge(I18n.locale.to_s => {
                          pageflow_scrolled: {
                            inline_editing: I18n.t('pageflow_scrolled.inline_editing')
                          }
                        })
    end

    private

    MERGE_IGNORING_NIL = lambda do |_, fallback, value|
      value.presence || fallback
    end

    def scrolled_i18n_public_translations(entry)
      translations =
        I18n.t('pageflow_scrolled.public', locale: I18n.default_locale, default: {})
            .deep_merge(I18n.t('pageflow_scrolled.public', locale: entry.locale, default: {}),
                        &MERGE_IGNORING_NIL)

      {
        entry.locale => {
          pageflow_scrolled: {public: translations}
        }
      }
    end
  end
end
