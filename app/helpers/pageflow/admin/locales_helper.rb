module Pageflow
  module Admin
    module LocalesHelper
      include Pageflow::PublicI18n::LocalesHelper

      def available_locales_collection
        Pageflow.config.available_locales.map do |locale|
          [I18n.t('language', locale:), locale.to_s]
        end
      end

      def available_public_locales_collection
        Pageflow.config.available_public_locales.map do |locale|
          [public_locale_name_for(locale), locale.to_s]
        end
      end
    end
  end
end
