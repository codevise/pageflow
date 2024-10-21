module Pageflow
  module Admin
    module LocalesHelper
      def locale_name_for(locale, i18n_key = 'pageflow.public._language')
        I18n.t(i18n_key, locale: locale)
      end

      def available_locales_collection
        locales_collection(Pageflow.config.available_locales, 'language')
      end

      def available_public_locales_collection
        locales_collection(Pageflow.config.available_public_locales)
      end

      private

      def locales_collection(locales, i18n_key = 'pageflow.public._language')
        locales.map do |locale|
          [locale_name_for(locale, i18n_key), locale.to_s]
        end
      end
    end
  end
end
