module Pageflow
  module PublicI18nHelper # rubocop:todo Style/Documentation
    def public_i18n_javascript_tag(entry)
      render('pageflow/public_i18n/javascript_tag',
             entry_locale: entry.locale,
             translations: public_i18n_translations(entry))
    end

    def public_i18n_translations(entry)
      merge_ignoring_nil = lambda do |_, fallback, value|
        value.presence || fallback
      end

      locales = [I18n.default_locale, *I18n.fallbacks[entry.locale].reverse].uniq &
                I18n.available_locales

      translations = locales.reduce({}) do |result, locale|
        result.deep_merge(I18n.t('pageflow.public', locale:, default: {}),
                          &merge_ignoring_nil)
      end

      {pageflow: {public: translations}}
    end
  end
end
