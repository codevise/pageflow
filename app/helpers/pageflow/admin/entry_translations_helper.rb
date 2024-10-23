module Pageflow
  module Admin
    # @api private
    module EntryTranslationsHelper
      include Pageflow::PublicI18n::LocalesHelper

      def entry_translation_display_locale(entry)
        display_locale = public_locale_name_for((entry.published_revision || entry.draft).locale)

        if entry.default_translation?
          t('pageflow.admin.entry_translations.default_translation', display_locale:)
        else
          display_locale
        end
      end
    end
  end
end
