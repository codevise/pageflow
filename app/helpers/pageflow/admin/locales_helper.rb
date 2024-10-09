module Pageflow
  module Admin
    module LocalesHelper
      def available_locales_collection
        locales_collection(Pageflow.config.available_locales, 'language')
      end

      def available_public_locales_collection
        locales_collection(Pageflow.config.available_public_locales, 'pageflow.public._language')
      end

      private

      def locales_collection(locales, i18n_key)
        locales.map do |locale|
          [I18n.t(i18n_key, locale: locale), locale.to_s]
        end
      end
    end
  end
end
