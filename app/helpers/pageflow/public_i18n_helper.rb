module Pageflow
  module PublicI18nHelper
    def public_i18n_javascript_tag(entry)
      render('pageflow/public_i18n/javascript_tag',
             entry_locale: entry.locale,
             translations: public_i18n_translations(entry))
    end

    def public_i18n_translations(entry)
      {
        pageflow: {
          public: I18n.t('pageflow.public', locale: I18n.default_locale)
                      .dup
                      .deep_merge(I18n.t('pageflow.public', locale: entry.locale))
        }
      }
    end
  end
end
