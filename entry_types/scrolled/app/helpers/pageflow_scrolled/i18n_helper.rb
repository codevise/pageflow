module PageflowScrolled
  # @api private
  module I18nHelper
    def scrolled_i18n_translations(entry,
                                   ui_locale: I18n.locale,
                                   include_inline_editing: false,
                                   include_review: false)
      ui_scopes = []
      ui_scopes << :inline_editing if include_inline_editing
      ui_scopes << :review if include_review

      ui_scopes.reduce(scrolled_i18n_public_translations(entry)) do |result, scope|
        result.deep_merge(
          ui_locale.to_s => {
            pageflow_scrolled: {
              scope => I18n.t("pageflow_scrolled.#{scope}", locale: ui_locale)
            }
          }
        )
      end
    end

    private

    MERGE_IGNORING_NIL = lambda do |_, fallback, value|
      value.presence || fallback
    end

    # Entry locales are not expected to be complete. Merge translations
    # of all fallback locales since the frontend does not know about
    # fallbacks.
    def scrolled_i18n_public_translations(entry)
      locales = [I18n.default_locale, *I18n.fallbacks[entry.locale].reverse].uniq &
                I18n.available_locales

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
