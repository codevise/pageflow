module Pageflow
  module PublicI18nHelper
    def public_i18n_javascript_tag(entry)
      render('pageflow/public_i18n/javascript_tag',
             entry_locale: entry.locale,
             translations: public_i18n_translations(entry))
    end

    def public_i18n_translations(entry, parent_key = 'pageflow')
      merge_ignoring_nil = lambda do |_, fallback, value|
        value.presence || fallback
      end
      translations = Hash.new
      translations[parent_key.to_sym] = {
        public: I18n.t("#{parent_key}.public", locale: I18n.default_locale)
                    .dup
                    .deep_merge(I18n.t("#{parent_key}.public", locale: entry.locale),
                                &merge_ignoring_nil)
      }
      translations
    end

    def public_scrolled_i18n_translations(entry)
      public_i18n_translations entry, 'pageflow_scrolled'
    end
  end
end
