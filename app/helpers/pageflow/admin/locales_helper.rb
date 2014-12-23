module Pageflow
  module Admin
    module LocalesHelper
      def available_locales_collection
        Pageflow.config.available_locales.map do |locale|
          [I18n.t('language', locale: locale), locale.to_s]
        end
      end
    end
  end
end
